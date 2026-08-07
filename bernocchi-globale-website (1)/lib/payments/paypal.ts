import 'server-only'

import type { PaymentCurrency } from './config'
import type { PaymentOrder } from './orders'

type PayPalLink = { href: string; rel: string; method: string }
type PayPalOrderResponse = {
  id?: string
  status?: string
  links?: PayPalLink[]
  details?: Array<{ issue?: string; description?: string }>
  debug_id?: string
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id?: string
        status?: string
        amount?: { value?: string; currency_code?: string }
      }>
    }
  }>
}

export type PayPalWebhookEvent = {
  id?: string
  event_type?: string
  resource?: {
    id?: string
    amount?: { value?: string; currency_code?: string }
    supplementary_data?: {
      related_ids?: { order_id?: string; capture_id?: string }
    }
    links?: PayPalLink[]
  }
}

function paypalBaseUrl() {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

async function paypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !secret) throw new Error('PAYPAL_NOT_CONFIGURED')

  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })
  const data = (await response.json().catch(() => null)) as {
    access_token?: string
    error_description?: string
  } | null
  if (!response.ok || !data?.access_token) {
    throw new Error(`PAYPAL_AUTH_FAILED:${response.status}:${data?.error_description ?? ''}`)
  }
  return data.access_token
}

function paypalAmount(amountMinor: number) {
  return (amountMinor / 100).toFixed(2)
}

async function paypalRequest<T>(
  path: string,
  init: RequestInit,
  requestId?: string,
) {
  const accessToken = await paypalAccessToken()
  const response = await fetch(`${paypalBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(requestId ? { 'PayPal-Request-Id': requestId } : {}),
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
  const data = (await response.json().catch(() => null)) as T
  if (!response.ok) {
    throw new Error(`PAYPAL_REQUEST_FAILED:${response.status}:${JSON.stringify(data)}`)
  }
  return data
}

export async function createPayPalOrder(order: PaymentOrder) {
  const data = await paypalRequest<PayPalOrderResponse>(
    '/v2/checkout/orders',
    {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: order.id,
            custom_id: order.public_token,
            description: order.description.slice(0, 127),
            amount: {
              currency_code: order.currency,
              value: paypalAmount(order.amount_minor),
            },
          },
        ],
        application_context: {
          brand_name: 'Casa Bernocchi',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    },
    `cb-create-${order.id}`,
  )
  if (!data.id) throw new Error('PAYPAL_ORDER_ID_MISSING')
  return data
}

export async function capturePayPalOrder(
  providerOrderId: string,
  paymentOrderId: string,
) {
  return paypalRequest<PayPalOrderResponse>(
    `/v2/checkout/orders/${encodeURIComponent(providerOrderId)}/capture`,
    { method: 'POST', body: '{}' },
    `cb-capture-${paymentOrderId}`,
  )
}

export function extractCapture(data: PayPalOrderResponse) {
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
  const value = capture?.amount?.value
  const currency = capture?.amount?.currency_code as PaymentCurrency | undefined
  if (
    data.status !== 'COMPLETED' ||
    capture?.status !== 'COMPLETED' ||
    !capture.id ||
    !value ||
    !currency
  ) {
    throw new Error('PAYPAL_CAPTURE_INCOMPLETE')
  }
  const amountMinor = Math.round(Number(value) * 100)
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new Error('PAYPAL_CAPTURE_AMOUNT_INVALID')
  }
  return { captureId: capture.id, amountMinor, currency }
}

export async function verifyPayPalWebhook(
  headers: Headers,
  event: PayPalWebhookEvent,
) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) throw new Error('PAYPAL_WEBHOOK_NOT_CONFIGURED')

  const required = {
    transmission_id: headers.get('paypal-transmission-id'),
    transmission_time: headers.get('paypal-transmission-time'),
    cert_url: headers.get('paypal-cert-url'),
    auth_algo: headers.get('paypal-auth-algo'),
    transmission_sig: headers.get('paypal-transmission-sig'),
  }
  if (Object.values(required).some((value) => !value)) return false

  const result = await paypalRequest<{ verification_status?: string }>(
    '/v1/notifications/verify-webhook-signature',
    {
      method: 'POST',
      body: JSON.stringify({
        ...required,
        webhook_id: webhookId,
        webhook_event: event,
      }),
    },
  )
  return result.verification_status === 'SUCCESS'
}

function captureIdFromLinks(links: PayPalLink[] | undefined) {
  const href = links?.find((link) => link.rel === 'up')?.href
  const match = href?.match(/\/v2\/payments\/captures\/([^/?#]+)/)
  return match?.[1]
}

export async function getPayPalRefundCaptureId(event: PayPalWebhookEvent) {
  const embedded = event.resource?.supplementary_data?.related_ids?.capture_id
    ?? captureIdFromLinks(event.resource?.links)
  if (embedded) return embedded

  const refundId = event.resource?.id
  if (!refundId) return undefined
  const refund = await paypalRequest<{ links?: PayPalLink[] }>(
    `/v2/payments/refunds/${encodeURIComponent(refundId)}`,
    { method: 'GET' },
  )
  return captureIdFromLinks(refund.links)
}
