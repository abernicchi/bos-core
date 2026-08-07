import { NextResponse } from 'next/server'
import { verifyOnvoWebhook, type OnvoWebhookEvent } from '@/lib/payments/onvo'
import {
  completePayment,
  finishWebhookEvent,
  getBookingContact,
  getPaymentOrderByProviderOrderId,
  registerWebhookEvent,
} from '@/lib/payments/orders'
import { sendPaymentConfirmation } from '@/lib/payments/notifications'

export async function POST(request: Request) {
  if (!verifyOnvoWebhook(request.headers)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  const rawBody = await request.text()
  let event: OnvoWebhookEvent
  let webhookEventId: number | undefined
  try {
    event = JSON.parse(rawBody) as OnvoWebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  try {
    const registration = await registerWebhookEvent({
      provider: 'onvo',
      providerEventId: event.type && event.data?.id
        ? `${event.type}:${event.data.id}`
        : undefined,
      eventType: event.type ?? 'unknown',
      rawBody,
    })
    if (registration.duplicate) return NextResponse.json({ ok: true, duplicate: true })
    webhookEventId = registration.webhookEventId

    let handled = false

    if (event.type === 'checkout-session.succeeded') {
      const providerOrderId = event.data?.id
      const amount = event.data?.amountTotal
      const currency = event.data?.currency
      if (!providerOrderId || !amount || !currency) {
        throw new Error('ONVO_WEBHOOK_FIELDS_MISSING')
      }
      const order = await getPaymentOrderByProviderOrderId('onvo', providerOrderId)
      if (!order) throw new Error('PAYMENT_ORDER_NOT_FOUND')
      await completePayment({
        paymentOrderId: order.id,
        provider: 'onvo',
        providerOrderId,
        captureId: event.data?.paymentIntentId ?? providerOrderId,
        amountMinor: amount,
        currency,
      })
      const contact = await getBookingContact(order.booking_reservation_id)
      if (contact) {
        await sendPaymentConfirmation({
          order,
          contact,
          provider: 'onvo',
          transactionId: event.data?.paymentIntentId ?? providerOrderId,
        })
      }
      handled = true
    }

    await finishWebhookEvent(webhookEventId, handled ? 'processed' : 'ignored')
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (webhookEventId) {
      try {
        await finishWebhookEvent(webhookEventId, 'failed', error)
      } catch (statusError) {
        console.error('[Casa Bernocchi] ONVO webhook status update failed:', statusError)
      }
    }
    console.error('[Casa Bernocchi] ONVO webhook processing failed:', error)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
