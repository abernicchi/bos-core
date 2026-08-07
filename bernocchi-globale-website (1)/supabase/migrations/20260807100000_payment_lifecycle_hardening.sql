begin;

alter table public.payment_webhook_events
  drop constraint if exists payment_webhook_events_processing_status_check;

alter table public.payment_webhook_events
  add constraint payment_webhook_events_processing_status_check
  check (processing_status in ('received', 'processing', 'processed', 'ignored', 'failed'));

alter table public.payment_webhook_events
  add column if not exists processing_started_at timestamptz,
  add column if not exists attempt_count integer not null default 0,
  add column if not exists last_error text;

alter table public.payment_webhook_events
  drop constraint if exists payment_webhook_events_provider_payload_hash_key;

drop index if exists public.payment_webhook_provider_event_uidx;

alter table public.payment_webhook_events
  add column if not exists dedupe_key text
  generated always as (coalesce(provider_event_id, payload_hash)) stored;

create unique index if not exists payment_webhook_events_dedupe_uidx
  on public.payment_webhook_events (provider, dedupe_key);

create or replace function public.claim_payment_webhook_event(
  p_provider text,
  p_provider_event_id text,
  p_event_type text,
  p_payload_hash text
)
returns table(webhook_event_id bigint, should_process boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id bigint;
  v_key text := coalesce(nullif(btrim(p_provider_event_id), ''), p_payload_hash);
begin
  if p_provider not in ('paypal', 'onvo') then raise exception 'invalid provider'; end if;
  if p_payload_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid payload hash'; end if;
  if btrim(coalesce(p_event_type, '')) = '' then raise exception 'event type required'; end if;

  insert into public.payment_webhook_events (
    provider,
    provider_event_id,
    event_type,
    payload_hash,
    processing_status,
    processing_started_at,
    attempt_count
  ) values (
    p_provider,
    nullif(btrim(p_provider_event_id), ''),
    left(p_event_type, 180),
    p_payload_hash,
    'processing',
    now(),
    1
  )
  on conflict (provider, dedupe_key) do update
  set
    event_type = excluded.event_type,
    processing_status = 'processing',
    processing_started_at = now(),
    processed_at = null,
    attempt_count = public.payment_webhook_events.attempt_count + 1,
    last_error = null
  where public.payment_webhook_events.processing_status in ('received', 'failed')
    or (
      public.payment_webhook_events.processing_status = 'processing'
      and public.payment_webhook_events.processing_started_at < now() - interval '5 minutes'
    )
  returning id into v_id;

  if v_id is null then
    select id into v_id
    from public.payment_webhook_events
    where provider = p_provider and dedupe_key = v_key;

    return query select v_id, false;
    return;
  end if;

  return query select v_id, true;
end;
$$;

revoke all on function public.claim_payment_webhook_event(text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.claim_payment_webhook_event(text, text, text, text)
  to service_role;

create or replace function public.finish_payment_webhook_event(
  p_webhook_event_id bigint,
  p_status text,
  p_error text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_status not in ('processed', 'ignored', 'failed') then
    raise exception 'invalid terminal webhook status';
  end if;

  update public.payment_webhook_events
  set
    processing_status = p_status,
    processed_at = case when p_status in ('processed', 'ignored') then now() else null end,
    last_error = case when p_status = 'failed' then left(coalesce(p_error, 'processing failed'), 1000) else null end
  where id = p_webhook_event_id;
end;
$$;

revoke all on function public.finish_payment_webhook_event(bigint, text, text)
  from public, anon, authenticated;
grant execute on function public.finish_payment_webhook_event(bigint, text, text)
  to service_role;

create or replace function public.expire_stale_checkout_holds()
returns table(expired_orders integer, expired_bookings integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_orders integer := 0;
  v_bookings integer := 0;
begin
  update public.payment_orders
  set status = 'expired', updated_at = now()
  where status in ('pending', 'checkout_created', 'processing')
    and expires_at < now();
  get diagnostics v_orders = row_count;

  update public.booking_reservations
  set status = 'expired', payment_status = 'failed', updated_at = now()
  where status = 'pending_deposit'
    and hold_expires_at is not null
    and hold_expires_at < now();
  get diagnostics v_bookings = row_count;

  return query select v_orders, v_bookings;
end;
$$;

revoke all on function public.expire_stale_checkout_holds()
  from public, anon, authenticated;
grant execute on function public.expire_stale_checkout_holds()
  to service_role;

commit;
