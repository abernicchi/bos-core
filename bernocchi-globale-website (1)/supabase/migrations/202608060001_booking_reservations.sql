create extension if not exists btree_gist;

create type public.booking_reservation_status as enum (
  'pending_deposit', 'confirmed', 'expired', 'released', 'cancelled', 'failed'
);

create table public.booking_reservations (
  id uuid primary key default gen_random_uuid(),
  consultation_id text not null,
  consultation text not null,
  mode text not null check (mode in ('online', 'in-person')),
  language text not null check (language in ('es', 'en', 'it')),
  patient_name text not null,
  patient_email text not null,
  patient_whatsapp text not null,
  start_at timestamptz not null,
  end_at timestamptz not null check (end_at > start_at),
  status public.booking_reservation_status not null default 'pending_deposit',
  hold_expires_at timestamptz,
  google_event_id text unique,
  confirmation_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.booking_reservations add constraint booking_reservations_no_active_overlap
  exclude using gist (tstzrange(start_at, end_at, '[)') with &&)
  where (status in ('pending_deposit', 'confirmed'));

alter table public.booking_reservations enable row level security;
-- No public policies: access is server-only through the service role.

create or replace function public.reserve_booking_atomic(
  p_consultation_id text, p_consultation text, p_mode text, p_language text,
  p_patient_name text, p_patient_email text, p_patient_whatsapp text,
  p_start_at timestamptz, p_end_at timestamptz, p_hold_expires_at timestamptz
) returns public.booking_reservations
language plpgsql security definer set search_path = public as $$
declare result public.booking_reservations;
begin
  perform pg_advisory_xact_lock(hashtextextended((p_start_at at time zone 'America/Costa_Rica')::date::text, 0));
  update booking_reservations set status = 'expired', updated_at = now()
    where status = 'pending_deposit' and hold_expires_at <= now();
  if exists (select 1 from booking_reservations where status in ('pending_deposit','confirmed')
    and tstzrange(start_at,end_at,'[)') && tstzrange(p_start_at,p_end_at,'[)')) then
    raise exception using errcode = '23P01', message = 'booking_interval_conflict';
  end if;
  insert into booking_reservations (consultation_id,consultation,mode,language,patient_name,patient_email,patient_whatsapp,start_at,end_at,hold_expires_at)
  values (p_consultation_id,p_consultation,p_mode,p_language,p_patient_name,p_patient_email,p_patient_whatsapp,p_start_at,p_end_at,p_hold_expires_at)
  returning * into result;
  return result;
exception when exclusion_violation then
  raise exception using errcode = '23P01', message = 'booking_interval_conflict';
end $$;
revoke all on function public.reserve_booking_atomic(text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz) from public, anon, authenticated;
grant execute on function public.reserve_booking_atomic(text,text,text,text,text,text,text,timestamptz,timestamptz,timestamptz) to service_role;
