begin;

create or replace view public.analytics_funnel_daily
with (security_invoker = true)
as
select
  date_trunc('day', created_at) as day,
  count(*) filter (where event_name = 'page_view') as page_views,
  count(*) filter (where event_name = 'ordo_view') as ordo_views,
  count(*) filter (where event_name = 'ordo_inquiry_start') as inquiry_starts,
  count(*) filter (where event_name = 'inquiry_submit') as inquiry_submits,
  count(*) filter (where event_name = 'booking_start') as booking_starts,
  count(*) filter (where event_name = 'booking_submit') as booking_submits,
  count(*) filter (where event_name = 'payment_start') as payment_starts,
  count(*) filter (where event_name = 'payment_complete') as payment_completes,
  round(
    count(*) filter (where event_name = 'inquiry_submit')::numeric
    / nullif(count(*) filter (where event_name = 'ordo_inquiry_start'), 0),
    4
  ) as inquiry_completion_rate,
  round(
    count(*) filter (where event_name = 'booking_submit')::numeric
    / nullif(count(*) filter (where event_name = 'booking_start'), 0),
    4
  ) as booking_completion_rate,
  round(
    count(*) filter (where event_name = 'payment_complete')::numeric
    / nullif(count(*) filter (where event_name = 'payment_start'), 0),
    4
  ) as payment_completion_rate
from public.analytics_events
group by 1;

comment on view public.analytics_funnel_daily is
  'Consent-based, pseudonymous journey metrics. Rates are diagnostic and must be read with event volume.';

create or replace view public.payment_operations_daily
with (security_invoker = true)
as
select
  date_trunc('day', created_at) as day,
  count(*) as orders_created,
  count(*) filter (where status = 'completed') as orders_completed,
  count(*) filter (where status = 'refunded') as orders_refunded,
  round(
    count(*) filter (where status = 'completed')::numeric / nullif(count(*), 0),
    4
  ) as order_completion_rate,
  sum(provider_amount_minor) filter (where status = 'completed' and provider_currency = 'EUR') as completed_eur_minor,
  sum(provider_amount_minor) filter (where status = 'completed' and provider_currency = 'USD') as completed_usd_minor,
  sum(provider_amount_minor) filter (where status = 'completed' and provider_currency = 'CRC') as completed_crc_minor
from public.payment_orders
group by 1;

comment on view public.payment_operations_daily is
  'Operational payment truth from reconciled orders; unlike journey analytics, this is not consent-dependent.';

revoke all on public.analytics_funnel_daily from public, anon, authenticated;
revoke all on public.payment_operations_daily from public, anon, authenticated;
grant select on public.analytics_funnel_daily to service_role;
grant select on public.payment_operations_daily to service_role;

commit;
