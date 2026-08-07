begin;

create schema if not exists extensions;
alter extension btree_gist set schema extensions;

insert into public.business_units (code, name, description, is_active)
values
  ('casa_bernocchi', 'Casa Bernocchi', 'Gobierno central y Segreteria Generale.', true),
  ('ordo_medicinae', 'Ordo Medicinae', 'Salud y bienestar clínico.', true),
  ('ordo_iuris', 'Ordo Iuris', 'Derecho y arquitectura institucional, en estructuración.', false),
  ('ordo_scientia', 'Ordo Scientia', 'Investigación y conocimiento verificable, en desarrollo.', false),
  ('ordo_innovatio', 'Ordo Innovatio', 'Sistemas digitales e inteligencia aplicada, en desarrollo.', false),
  ('ordo_humanitatis', 'Ordo Humanitatis', 'Educación, cultura y formación, planificada.', false),
  ('ordo_capitalis', 'Ordo Capitalis', 'Capital, empresa y stewardship, planificada.', false)
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.services (business_unit_id, code, name, description, is_active)
select bu.id, seed.code, seed.name, seed.description, seed.is_active
from (
  values
    ('casa_bernocchi', 'general_inquiry', 'Consulta institucional', 'Entrada general para Segreteria Generale.', true),
    ('ordo_medicinae', 'medicinae_consultation', 'Consulta Bernocchi Health', 'Solicitud de consulta profesional.', true),
    ('ordo_iuris', 'iuris_inquiry', 'Consulta Ordo Iuris', 'Manifestación de interés; no constituye aceptación de asesoramiento.', false),
    ('ordo_scientia', 'scientia_inquiry', 'Propuesta Ordo Scientia', 'Propuesta de investigación o colaboración.', false),
    ('ordo_innovatio', 'innovatio_inquiry', 'Consulta Ordo Innovatio', 'Propuesta de sistemas o colaboración digital.', false),
    ('ordo_humanitatis', 'humanitatis_interest', 'Interés Ordo Humanitatis', 'Registro de interés en programas futuros.', false),
    ('ordo_capitalis', 'capitalis_inquiry', 'Consulta Ordo Capitalis', 'Contacto institucional; no constituye oferta ni asesoramiento de inversión.', false)
) as seed(business_unit_code, code, name, description, is_active)
join public.business_units bu on bu.code = seed.business_unit_code
on conflict (code) do update
set
  business_unit_id = excluded.business_unit_id,
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  updated_at = now();

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null unique default gen_random_uuid(),
  booking_reservation_id uuid not null unique references public.booking_reservations(id) on delete restrict,
  service_code text not null,
  description text not null check (char_length(description) between 3 and 240),
  amount_minor integer not null check (amount_minor > 0),
  currency text not null check (currency in ('EUR', 'USD', 'CRC')),
  status text not null default 'pending' check (
    status in ('pending', 'checkout_created', 'processing', 'completed', 'failed', 'expired', 'cancelled', 'refunded')
  ),
  provider text check (provider is null or provider in ('paypal', 'onvo')),
  provider_order_id text unique,
  provider_capture_id text unique,
  provider_amount_minor integer check (provider_amount_minor is null or provider_amount_minor > 0),
  provider_currency text check (provider_currency is null or provider_currency in ('EUR', 'USD', 'CRC')),
  checkout_url text,
  expires_at timestamptz not null,
  completed_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (provider_amount_minor is null and provider_currency is null)
    or (provider_amount_minor is not null and provider_currency is not null)
  )
);

comment on table public.payment_orders is
  'Server-owned payment orders. Public clients receive only a random bearer token; all writes use the service role.';
comment on column public.payment_orders.amount_minor is
  'Canonical catalogue amount in the smallest currency unit; never accepted from browser input.';

create index if not exists payment_orders_booking_reservation_id_idx
  on public.payment_orders (booking_reservation_id);
create index if not exists payment_orders_status_expires_at_idx
  on public.payment_orders (status, expires_at);

alter table public.payment_orders enable row level security;

create table if not exists public.payment_webhook_events (
  id bigint generated always as identity primary key,
  provider text not null check (provider in ('paypal', 'onvo')),
  provider_event_id text,
  event_type text not null,
  payload_hash text not null check (payload_hash ~ '^[0-9a-f]{64}$'),
  processing_status text not null default 'received' check (
    processing_status in ('received', 'processed', 'ignored', 'failed')
  ),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, payload_hash)
);

create unique index if not exists payment_webhook_provider_event_uidx
  on public.payment_webhook_events (provider, provider_event_id)
  where provider_event_id is not null;

alter table public.payment_webhook_events enable row level security;

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null check (
    event_name in (
      'page_view', 'ordo_view', 'ordo_inquiry_start', 'inquiry_submit',
      'booking_start', 'booking_submit', 'payment_start', 'payment_complete'
    )
  ),
  anonymous_id text check (anonymous_id is null or anonymous_id ~ '^[0-9a-f]{64}$'),
  path text not null check (path ~ '^/' and char_length(path) <= 300),
  ordo_code text references public.business_units(code) on update cascade,
  service_code text,
  provider text check (provider is null or provider in ('paypal', 'onvo')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_created_at_idx
  on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_ordo_created_at_idx
  on public.analytics_events (ordo_code, created_at desc)
  where ordo_code is not null;

alter table public.analytics_events enable row level security;

alter table public.booking_reservations
  drop constraint if exists booking_reservations_payment_method_check;
alter table public.booking_reservations
  add constraint booking_reservations_payment_method_check
  check (payment_method in ('pending', 'sinpe', 'card', 'bank_transfer', 'cash', 'paypal', 'onvo'));

create or replace function public.create_public_service_request(
  p_full_name text,
  p_email text,
  p_phone text,
  p_country text,
  p_inquiry_type text,
  p_language text,
  p_mode text,
  p_message text,
  p_ordo_code text default null
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_person_id uuid;
  v_business_unit_id uuid;
  v_service_id uuid;
  v_reference text;
  v_first_name text;
  v_last_name text;
  v_unit_code text := coalesce(nullif(btrim(p_ordo_code), ''), 'casa_bernocchi');
  v_service_code text;
begin
  if btrim(coalesce(p_full_name, '')) = ''
    or btrim(coalesce(p_email, '')) = ''
    or btrim(coalesce(p_message, '')) = '' then
    raise exception 'required fields missing';
  end if;

  select id into v_business_unit_id
  from public.business_units
  where code = v_unit_code;

  if v_business_unit_id is null then
    raise exception 'unknown business unit';
  end if;

  v_service_code := case v_unit_code
    when 'ordo_medicinae' then 'medicinae_consultation'
    when 'ordo_iuris' then 'iuris_inquiry'
    when 'ordo_scientia' then 'scientia_inquiry'
    when 'ordo_innovatio' then 'innovatio_inquiry'
    when 'ordo_humanitatis' then 'humanitatis_interest'
    when 'ordo_capitalis' then 'capitalis_inquiry'
    else 'general_inquiry'
  end;

  select id into v_service_id
  from public.services
  where code = v_service_code;

  v_first_name := split_part(btrim(p_full_name), ' ', 1);
  v_last_name := nullif(btrim(substr(btrim(p_full_name), char_length(v_first_name) + 1)), '');

  insert into public.persons (
    first_name,
    last_name,
    email,
    phone_e164,
    language_code,
    consent_to_contact,
    consent_at,
    privacy_notice_version
  ) values (
    v_first_name,
    v_last_name,
    lower(btrim(p_email)),
    case when btrim(coalesce(p_phone, '')) ~ '^\+[1-9][0-9]{7,14}$' then btrim(p_phone) else null end,
    case when btrim(coalesce(p_language, '')) ~ '^[a-z]{2}(-[A-Z]{2})?$' then btrim(p_language) else 'es' end,
    true,
    now(),
    '2026-08'
  ) returning id into v_person_id;

  insert into public.service_requests (
    person_id,
    business_unit_id,
    service_id,
    channel,
    status,
    subject,
    summary,
    preferred_mode,
    source,
    consent_to_contact,
    consent_at,
    privacy_notice_version,
    metadata
  ) values (
    v_person_id,
    v_business_unit_id,
    v_service_id,
    'web',
    'new',
    concat('Consulta ', coalesce(nullif(btrim(p_inquiry_type), ''), 'institucional')),
    left(btrim(p_message), 2000),
    case
      when p_mode = 'online' then 'online'
      when p_mode = 'in-person' then 'in_person'
      else null
    end,
    'bernocchiglobale.it',
    true,
    now(),
    '2026-08',
    jsonb_build_object(
      'country_text', left(coalesce(p_country, ''), 80),
      'inquiry_type', left(coalesce(p_inquiry_type, ''), 40),
      'language', left(coalesce(p_language, ''), 10)
    )
  ) returning reference_code into v_reference;

  insert into public.audit_events (
    actor_type, event_type, entity_type, payload
  ) values (
    'api', 'service_request.created', 'service_request',
    jsonb_build_object('reference_code', v_reference, 'business_unit_code', v_unit_code)
  );

  return v_reference;
end;
$$;

revoke all on function public.create_public_service_request(text, text, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.create_public_service_request(text, text, text, text, text, text, text, text, text)
  to service_role;

create or replace function public.complete_payment_order(
  p_payment_order_id uuid,
  p_provider text,
  p_provider_order_id text,
  p_capture_id text,
  p_amount_minor integer,
  p_currency text
)
returns table(status text, booking_status text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.payment_orders%rowtype;
  v_expected_amount integer;
  v_expected_currency text;
begin
  select * into v_order
  from public.payment_orders
  where id = p_payment_order_id
  for update;

  if not found then raise exception 'payment order not found'; end if;
  if p_provider not in ('paypal', 'onvo') then raise exception 'invalid provider'; end if;

  v_expected_amount := coalesce(v_order.provider_amount_minor, v_order.amount_minor);
  v_expected_currency := coalesce(v_order.provider_currency, v_order.currency);

  if p_amount_minor <> v_expected_amount or p_currency <> v_expected_currency then
    raise exception 'payment amount or currency mismatch';
  end if;
  if v_order.provider is not null and v_order.provider <> p_provider then
    raise exception 'payment provider mismatch';
  end if;
  if v_order.provider_order_id is not null and v_order.provider_order_id <> p_provider_order_id then
    raise exception 'provider order mismatch';
  end if;

  if v_order.status <> 'completed' then
    update public.payment_orders
    set
      provider = p_provider,
      provider_order_id = p_provider_order_id,
      provider_capture_id = p_capture_id,
      provider_amount_minor = v_expected_amount,
      provider_currency = v_expected_currency,
      status = 'completed',
      completed_at = now(),
      updated_at = now()
    where id = v_order.id;

    update public.booking_reservations
    set
      status = 'confirmed',
      payment_method = p_provider,
      payment_status = 'paid',
      hold_expires_at = null,
      updated_at = now()
    where id = v_order.booking_reservation_id;

    insert into public.audit_events (
      actor_type, event_type, entity_type, entity_id, payload
    ) values (
      'api', 'payment.completed', 'payment_order', v_order.id,
      jsonb_build_object(
        'provider', p_provider,
        'provider_order_id', p_provider_order_id,
        'capture_id', p_capture_id,
        'amount_minor', p_amount_minor,
        'currency', p_currency
      )
    );
  end if;

  return query
  select po.status, br.status::text
  from public.payment_orders po
  join public.booking_reservations br on br.id = po.booking_reservation_id
  where po.id = v_order.id;
end;
$$;

revoke all on function public.complete_payment_order(uuid, text, text, text, integer, text)
  from public, anon, authenticated;
grant execute on function public.complete_payment_order(uuid, text, text, text, integer, text)
  to service_role;

create or replace function public.refund_payment_order(
  p_payment_order_id uuid,
  p_provider text,
  p_provider_event_id text
)
returns table(status text, payment_status text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.payment_orders%rowtype;
begin
  select * into v_order
  from public.payment_orders
  where id = p_payment_order_id
  for update;

  if not found then raise exception 'payment order not found'; end if;
  if v_order.provider <> p_provider then raise exception 'payment provider mismatch'; end if;

  if v_order.status <> 'refunded' then
    update public.payment_orders
    set status = 'refunded', refunded_at = now(), updated_at = now()
    where id = v_order.id;

    update public.booking_reservations
    set payment_status = 'refunded', updated_at = now()
    where id = v_order.booking_reservation_id;

    insert into public.audit_events (
      actor_type, event_type, entity_type, entity_id, payload
    ) values (
      'api', 'payment.refunded', 'payment_order', v_order.id,
      jsonb_build_object('provider', p_provider, 'provider_event_id', p_provider_event_id)
    );
  end if;

  return query
  select po.status, br.payment_status
  from public.payment_orders po
  join public.booking_reservations br on br.id = po.booking_reservation_id
  where po.id = v_order.id;
end;
$$;

revoke all on function public.refund_payment_order(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.refund_payment_order(uuid, text, text)
  to service_role;

commit;
