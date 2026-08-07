begin;

alter table public.payment_orders
  add column if not exists refunded_amount_minor integer not null default 0
  check (refunded_amount_minor >= 0);

alter table public.payment_orders
  drop constraint if exists payment_orders_status_check;

alter table public.payment_orders
  add constraint payment_orders_status_check check (
    status in (
      'pending', 'checkout_created', 'processing', 'completed', 'failed',
      'expired', 'cancelled', 'partially_refunded', 'refunded'
    )
  );

drop function if exists public.refund_payment_order(uuid, text, text);

create or replace function public.refund_payment_order(
  p_payment_order_id uuid,
  p_provider text,
  p_provider_event_id text,
  p_amount_minor integer,
  p_currency text
)
returns table(status text, payment_status text, refunded_amount_minor integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.payment_orders%rowtype;
  v_expected_amount integer;
  v_expected_currency text;
  v_refunded_total integer;
  v_is_full_refund boolean;
begin
  select * into v_order
  from public.payment_orders
  where id = p_payment_order_id
  for update;

  if not found then raise exception 'payment order not found'; end if;
  if v_order.provider <> p_provider then raise exception 'payment provider mismatch'; end if;
  if p_amount_minor <= 0 then raise exception 'invalid refund amount'; end if;

  v_expected_amount := coalesce(v_order.provider_amount_minor, v_order.amount_minor);
  v_expected_currency := coalesce(v_order.provider_currency, v_order.currency);
  if p_currency <> v_expected_currency then raise exception 'refund currency mismatch'; end if;

  v_refunded_total := v_order.refunded_amount_minor + p_amount_minor;
  if v_refunded_total > v_expected_amount then raise exception 'refund exceeds captured amount'; end if;
  v_is_full_refund := v_refunded_total = v_expected_amount;

  update public.payment_orders
  set
    status = case when v_is_full_refund then 'refunded' else 'partially_refunded' end,
    refunded_amount_minor = v_refunded_total,
    refunded_at = case when v_is_full_refund then now() else refunded_at end,
    updated_at = now()
  where id = v_order.id;

  update public.booking_reservations
  set
    payment_status = case when v_is_full_refund then 'refunded' else 'paid' end,
    updated_at = now()
  where id = v_order.booking_reservation_id;

  insert into public.audit_events (
    actor_type, event_type, entity_type, entity_id, payload
  ) values (
    'api',
    case when v_is_full_refund then 'payment.refunded' else 'payment.partially_refunded' end,
    'payment_order',
    v_order.id,
    jsonb_build_object(
      'provider', p_provider,
      'provider_event_id', p_provider_event_id,
      'refund_amount_minor', p_amount_minor,
      'refunded_total_minor', v_refunded_total,
      'currency', p_currency
    )
  );

  return query
  select po.status, br.payment_status, po.refunded_amount_minor
  from public.payment_orders po
  join public.booking_reservations br on br.id = po.booking_reservation_id
  where po.id = v_order.id;
end;
$$;

revoke all on function public.refund_payment_order(uuid, text, text, integer, text)
  from public, anon, authenticated;
grant execute on function public.refund_payment_order(uuid, text, text, integer, text)
  to service_role;

create or replace function public.guard_payment_terminal_state()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.status in ('partially_refunded', 'refunded') and new.status = 'completed' then
    raise exception 'refunded payment cannot return to completed';
  end if;
  return new;
end;
$$;

drop trigger if exists payment_orders_terminal_state_guard on public.payment_orders;
create trigger payment_orders_terminal_state_guard
before update of status on public.payment_orders
for each row execute function public.guard_payment_terminal_state();

create or replace view public.payment_operations_daily
with (security_invoker = true)
as
select
  date_trunc('day', created_at) as day,
  count(*) as orders_created,
  count(*) filter (where completed_at is not null) as orders_completed,
  count(*) filter (where status = 'refunded') as orders_refunded,
  round(
    count(*) filter (where completed_at is not null)::numeric / nullif(count(*), 0),
    4
  ) as order_completion_rate,
  sum(provider_amount_minor) filter (where completed_at is not null and provider_currency = 'EUR') as completed_eur_minor,
  sum(provider_amount_minor) filter (where completed_at is not null and provider_currency = 'USD') as completed_usd_minor,
  sum(provider_amount_minor) filter (where completed_at is not null and provider_currency = 'CRC') as completed_crc_minor,
  count(*) filter (where status = 'partially_refunded') as orders_partially_refunded,
  sum(refunded_amount_minor) filter (where provider_currency = 'EUR') as refunded_eur_minor,
  sum(refunded_amount_minor) filter (where provider_currency = 'USD') as refunded_usd_minor,
  sum(refunded_amount_minor) filter (where provider_currency = 'CRC') as refunded_crc_minor,
  sum(provider_amount_minor - refunded_amount_minor) filter (where completed_at is not null and provider_currency = 'EUR') as net_eur_minor,
  sum(provider_amount_minor - refunded_amount_minor) filter (where completed_at is not null and provider_currency = 'USD') as net_usd_minor,
  sum(provider_amount_minor - refunded_amount_minor) filter (where completed_at is not null and provider_currency = 'CRC') as net_crc_minor
from public.payment_orders
group by 1;

comment on view public.payment_operations_daily is
  'Operational payment truth: completed orders, full/partial refunds, gross and net reconciled amounts by currency.';

revoke all on public.payment_operations_daily from public, anon, authenticated;
grant select on public.payment_operations_daily to service_role;

commit;
