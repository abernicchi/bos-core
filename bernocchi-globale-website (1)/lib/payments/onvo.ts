import 'server-only'

import { timingSafeEqual } from 'node:crypto'
import type { PaymentCurrency } from './config'
import type { BookingContact, PaymentOrder } from './orders'

type OnvoCheckoutSession = {
  id?: string
  url?: string
  status?: string
  paymentStatus?: string
  amountTotal?: number
  currency?: PaymentCurrency
  paymentIntentId?: string
  metadata?: Record<string, string>
}

export type OnvoWebhookEvent = {
  type?: string
  data?: OnvoCheckoutSession
}

export async function createOnvoCheckout(input: {
  order: PaymentOrder
  contact: BookingContact
  amountMinor: number
  currency: 'USD' | 'CRC'
}) {
  const secret = process.env.ONVO_SECRET_KEY
  if (!secret) throw new Error('ONVO_NOT_CONFIGURED')
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it').replace(/\/$/, '')
  const returnUrl = `${siteUrl}/pay/${input.order.public_token}`

  const response = await fetch(
    'https://api.onvopay.com/v1/checkout/sessions/one-time-link',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lineItems: [
          {
            quantity: 1,
            unitAmount: input.amountMinor,
            currency: input.currency,
            description: input.order.description,
          },
        ],
        customerEmail: input.contact.patient_email,
        redirectUrl: `${returnUrl}?result=processing`,
        cancelUrl: `${returnUrl}?result=cancelled`,
        metadata: {
          paymentOrderId: input.order.id,
          bookingReference: input.contact.reference_code,
        },
      }),
      cache: 'no-store',
    },
  )
  const data = (await response.json().catch(() => null)) as OnvoCheckoutSession | null
  if (!response.ok || !data?.id || !data.url) {
    throw new Error(`ONVO_CHECKOUT_FAILED:${response.status}:${JSON.stringify(data)}`)
  }
  return data
}

export function verifyOnvoWebhook(headers: Headers) {
  const expected = process.env.ONVO_WEBHOOK_SECRET
  const received = headers.get('x-webhook-secret')
  if (!expected || !received) return false
  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(received)
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  )
}
