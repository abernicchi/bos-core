import 'server-only'

import { createHash } from 'node:crypto'
import { getPaymentConfig, getServicePrice, type PaymentCurrency, type PaymentProvider } from './config'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-rest'

export type PaymentOrderStatus =
  | 'pending'
  | 'checkout_created'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'cancelled'
  | 'partially_refunded'
  | 'refunded'

export type PaymentOrder = {
  id: string
  public_token: string
  booking_reservation_id: string
  service_code: string
  description: string
  amount_minor: number
  currency: PaymentCurrency
  status: PaymentOrderStatus
  provider: PaymentProvider | null
  provider_order_id: string | null
  provider_capture_id: string | null
  provider_amount_minor: number | null
  provider_currency: PaymentCurrency | null
  checkout_url: string | null
  expires_at: string
  completed_at: string | null
  created_at: string
}

export type BookingContact = {
  id: string
  patient_email: string
  patient_name: string
  reference_code: string
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function createPaymentOrderForReservation(
  bookingReservationId: string,
  serviceId: string,
) {
  if (!isSupabaseConfigured()) return undefined
  const price = getServicePrice(serviceId)
  if (!price) return undefined

  const { data } = await supabaseRequest<PaymentOrder[]>('payment_orders', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      booking_reservation_id: bookingReservationId,
      service_code: serviceId,
      description: `Bernocchi Health — ${price.service.name}`,
      amount_minor: price.amountMinor,
      currency: price.currency,
      status: 'pending',
      expires_at: new Date(Date.now() + 30 * 60_000).toISOString(),
    }),
  })

  return data[0]
}

export async function getPaymentOrderByToken(token: string) {
  if (!UUID_RE.test(token) || !isSupabaseConfigured()) return undefined
  const select = [
    'id',
    'public_token',
    'booking_reservation_id',
    'service_code',
    'description',
    'amount_minor',
    'currency',
    'status',
    'provider',
    'provider_order_id',
    'provider_capture_id',
    'provider_amount_minor',
    'provider_currency',
    'checkout_url',
    'expires_at',
    'completed_at',
    'created_at',
  ].join(',')
  const { data } = await supabaseRequest<PaymentOrder[]>(
    `payment_orders?public_token=eq.${encodeURIComponent(token)}&select=${select}&limit=1`,
  )
  return data[0]
}

export async function getPaymentOrderByProviderOrderId(
  provider: PaymentProvider,
  providerOrderId: string,
) {
  if (!providerOrderId || providerOrderId.length > 180) return undefined
  const select = [
    'id',
    'public_token',
    'booking_reservation_id',
    'service_code',
    'description',
    'amount_minor',
    'currency',
    'status',
    'provider',
    'provider_order_id',
    'provider_capture_id',
    'provider_amount_minor',
    'provider_currency',
    'checkout_url',
    'expires_at',
    'completed_at',
    'created_at',
  ].join(',')
  const { data } = await supabaseRequest<PaymentOrder[]>(
    `payment_orders?provider=eq.${provider}&provider_order_id=eq.${encodeURIComponent(providerOrderId)}&select=${select}&limit=1`,
  )
  return data[0]
}

export async function getPaymentOrderByCaptureId(
  provider: PaymentProvider,
  captureId: string,
) {
  if (!captureId || captureId.length > 180) return undefined
  const { data } = await supabaseRequest<PaymentOrder[]>(
    `payment_orders?provider=eq.${provider}&provider_capture_id=eq.${encodeURIComponent(captureId)}&select=*&limit=1`,
  )
  return data[0]
}

export async function getBookingContact(bookingReservationId: string) {
  if (!UUID_RE.test(bookingReservationId)) return undefined
  const { data } = await supabaseRequest<BookingContact[]>(
    `booking_reservations?id=eq.${bookingReservationId}&select=id,patient_email,patient_name,reference_code&limit=1`,
  )
  return data[0]
}

export async function setProviderCheckout(input: {
  paymentOrderId: string
  provider: PaymentProvider
  providerOrderId: string
  providerAmountMinor: number
  providerCurrency: PaymentCurrency
  checkoutUrl?: string
}) {
  const query = [
    `id=eq.${input.paymentOrderId}`,
    'status=in.(pending,checkout_created,failed)',
  ].join('&')
  const { data } = await supabaseRequest<PaymentOrder[]>(`payment_orders?${query}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      provider: input.provider,
      provider_order_id: input.providerOrderId,
      provider_amount_minor: input.providerAmountMinor,
      provider_currency: input.providerCurrency,
      checkout_url: input.checkoutUrl ?? null,
      status: 'checkout_created',
      updated_at: new Date().toISOString(),
    }),
  })
  return data[0]
}

export async function completePayment(input: {
  paymentOrderId: string
  provider: PaymentProvider
  providerOrderId: string
  captureId: string
  amountMinor: number
  currency: PaymentCurrency
}) {
  const { data } = await supabaseRequest<Array<{ status: string }>>(
    'rpc/complete_payment_order',
    {
      method: 'POST',
      body: JSON.stringify({
        p_payment_order_id: input.paymentOrderId,
        p_provider: input.provider,
        p_provider_order_id: input.providerOrderId,
        p_capture_id: input.captureId,
        p_amount_minor: input.amountMinor,
        p_currency: input.currency,
      }),
    },
  )
  return data[0]
}

export async function refundPayment(input: {
  paymentOrderId: string
  provider: PaymentProvider
  providerEventId: string
  amountMinor: number
  currency: PaymentCurrency
}) {
  const { data } = await supabaseRequest<Array<{
    status: string
    payment_status: string
    refunded_amount_minor: number
  }>>(
    'rpc/refund_payment_order',
    {
      method: 'POST',
      body: JSON.stringify({
        p_payment_order_id: input.paymentOrderId,
        p_provider: input.provider,
        p_provider_event_id: input.providerEventId,
        p_amount_minor: input.amountMinor,
        p_currency: input.currency,
      }),
    },
  )
  return data[0]
}

export async function registerWebhookEvent(input: {
  provider: PaymentProvider
  providerEventId?: string
  eventType: string
  rawBody: string
}) {
  const payloadHash = createHash('sha256').update(input.rawBody).digest('hex')
  const { data } = await supabaseRequest<Array<{
    webhook_event_id: number
    should_process: boolean
  }>>('rpc/claim_payment_webhook_event', {
    method: 'POST',
    body: JSON.stringify({
      p_provider: input.provider,
      p_provider_event_id: input.providerEventId ?? null,
      p_event_type: input.eventType,
      p_payload_hash: payloadHash,
    }),
  })
  const claim = data[0]
  if (!claim) throw new Error('WEBHOOK_CLAIM_FAILED')
  return {
    duplicate: !claim.should_process,
    webhookEventId: claim.webhook_event_id,
  }
}

export async function finishWebhookEvent(
  webhookEventId: number,
  status: 'processed' | 'ignored' | 'failed',
  error?: unknown,
) {
  await supabaseRequest('rpc/finish_payment_webhook_event', {
    method: 'POST',
    body: JSON.stringify({
      p_webhook_event_id: webhookEventId,
      p_status: status,
      p_error: status === 'failed' ? String(error ?? 'processing failed') : null,
    }),
  })
}

export async function expireStaleCheckoutHolds() {
  const { data } = await supabaseRequest<Array<{
    expired_orders: number
    expired_bookings: number
  }>>('rpc/expire_stale_checkout_holds', {
    method: 'POST',
    body: '{}',
  })
  return data[0]
}

export function paymentLinkFor(order: PaymentOrder) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it'
  return `${siteUrl.replace(/\/$/, '')}/pay/${order.public_token}`
}

export function paymentIsAvailable(order: PaymentOrder) {
  return getPaymentConfig(order.service_code).enabled
}

export function paymentIsExpired(order: PaymentOrder) {
  return new Date(order.expires_at).getTime() <= Date.now()
}
