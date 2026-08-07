import { NextResponse } from 'next/server'
import {
  verifyPayPalWebhook,
  getPayPalRefundCaptureId,
  type PayPalWebhookEvent,
} from '@/lib/payments/paypal'
import {
  completePayment,
  finishWebhookEvent,
  getBookingContact,
  getPaymentOrderByCaptureId,
  getPaymentOrderByProviderOrderId,
  refundPayment,
  registerWebhookEvent,
} from '@/lib/payments/orders'
import {
  sendPaymentConfirmation,
  sendRefundConfirmation,
} from '@/lib/payments/notifications'

function amountMinor(value: string | undefined) {
  const amount = Math.round(Number(value) * 100)
  return Number.isSafeInteger(amount) && amount > 0 ? amount : undefined
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  let event: PayPalWebhookEvent
  let webhookEventId: number | undefined
  try {
    event = JSON.parse(rawBody) as PayPalWebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  try {
    const verified = await verifyPayPalWebhook(request.headers, event)
    if (!verified) return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })

    const registration = await registerWebhookEvent({
      provider: 'paypal',
      providerEventId: event.id,
      eventType: event.event_type ?? 'unknown',
      rawBody,
    })
    if (registration.duplicate) return NextResponse.json({ ok: true, duplicate: true })
    webhookEventId = registration.webhookEventId

    let handled = false

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const providerOrderId = event.resource?.supplementary_data?.related_ids?.order_id
      const amount = amountMinor(event.resource?.amount?.value)
      const currency = event.resource?.amount?.currency_code as 'EUR' | 'USD' | 'CRC' | undefined
      if (!providerOrderId || !event.resource?.id || !amount || !currency) {
        throw new Error('PAYPAL_WEBHOOK_FIELDS_MISSING')
      }
      const order = await getPaymentOrderByProviderOrderId('paypal', providerOrderId)
      if (!order) throw new Error('PAYMENT_ORDER_NOT_FOUND')
      await completePayment({
        paymentOrderId: order.id,
        provider: 'paypal',
        providerOrderId,
        captureId: event.resource.id,
        amountMinor: amount,
        currency,
      })
      const contact = await getBookingContact(order.booking_reservation_id)
      if (contact) {
        await sendPaymentConfirmation({
          order,
          contact,
          provider: 'paypal',
          transactionId: event.resource.id,
        })
      }
      handled = true
    }

    if (event.event_type === 'PAYMENT.CAPTURE.REFUNDED' && event.resource?.id) {
      const captureId = await getPayPalRefundCaptureId(event)
      if (!captureId) throw new Error('PAYPAL_REFUND_CAPTURE_ID_MISSING')
      const refundAmount = amountMinor(event.resource?.amount?.value)
      const refundCurrency = event.resource?.amount?.currency_code as 'EUR' | 'USD' | 'CRC' | undefined
      if (!refundAmount || !refundCurrency) throw new Error('PAYPAL_REFUND_AMOUNT_MISSING')
      const order = await getPaymentOrderByCaptureId('paypal', captureId)
      if (order) {
        const refund = await refundPayment({
          paymentOrderId: order.id,
          provider: 'paypal',
          providerEventId: event.id ?? event.resource.id,
          amountMinor: refundAmount,
          currency: refundCurrency,
        })
        const contact = await getBookingContact(order.booking_reservation_id)
        if (contact && (refund.status === 'partially_refunded' || refund.status === 'refunded')) {
          await sendRefundConfirmation({
            order,
            contact,
            status: refund.status,
            amountMinor: refundAmount,
            currency: refundCurrency,
            transactionId: event.resource.id,
          })
        }
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
        console.error('[Casa Bernocchi] PayPal webhook status update failed:', statusError)
      }
    }
    console.error('[Casa Bernocchi] PayPal webhook processing failed:', error)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}
