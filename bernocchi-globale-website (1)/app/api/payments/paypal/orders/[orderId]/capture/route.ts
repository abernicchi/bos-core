import { NextResponse } from 'next/server'
import { capturePayPalOrder, extractCapture } from '@/lib/payments/paypal'
import {
  completePayment,
  getPaymentOrderByToken,
  paymentIsExpired,
} from '@/lib/payments/orders'
import { finalizePaidReservation } from '@/lib/payments/finalize'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params
    const body = (await request.json()) as { paymentToken?: unknown }
    const token = typeof body.paymentToken === 'string' ? body.paymentToken : ''
    const order = await getPaymentOrderByToken(token)
    if (!order || order.provider !== 'paypal' || order.provider_order_id !== orderId) {
      return NextResponse.json({ error: 'Orden no válida.' }, { status: 404 })
    }

    if (order.status === 'completed') {
      let confirmation: 'sent' | 'already_sent' | 'email_failed' | 'unavailable' = 'unavailable'
      if (order.provider_capture_id) {
        try {
          const result = await finalizePaidReservation({
            order,
            provider: 'paypal',
            transactionId: order.provider_capture_id,
          })
          confirmation = result.status
        } catch (error) {
          console.error('[Casa Bernocchi] Completed-payment finalization retry failed:', error)
        }
      }
      return NextResponse.json({ status: 'COMPLETED', confirmation })
    }

    if (paymentIsExpired(order)) {
      return NextResponse.json({ error: 'El enlace ha expirado.' }, { status: 410 })
    }
    if (!['pending', 'checkout_created', 'failed'].includes(order.status)) {
      return NextResponse.json({ error: 'La orden no admite cobro.' }, { status: 409 })
    }

    const paypalOrder = await capturePayPalOrder(orderId, order.id)
    const capture = extractCapture(paypalOrder)
    if (
      capture.amountMinor !== (order.provider_amount_minor ?? order.amount_minor) ||
      capture.currency !== (order.provider_currency ?? order.currency)
    ) {
      throw new Error('PAYPAL_CAPTURE_MISMATCH')
    }

    await completePayment({
      paymentOrderId: order.id,
      provider: 'paypal',
      providerOrderId: orderId,
      captureId: capture.captureId,
      amountMinor: capture.amountMinor,
      currency: capture.currency,
    })

    let confirmation: 'sent' | 'already_sent' | 'email_failed' = 'email_failed'
    try {
      const result = await finalizePaidReservation({
        order,
        provider: 'paypal',
        transactionId: capture.captureId,
      })
      confirmation = result.status
    } catch (error) {
      console.error('[Casa Bernocchi] Post-payment finalization failed:', error)
    }

    return NextResponse.json({
      status: 'COMPLETED',
      captureId: capture.captureId,
      confirmation,
    })
  } catch (error) {
    console.error('[Casa Bernocchi] PayPal capture failed:', error)
    return NextResponse.json(
      { error: 'No fue posible confirmar el pago.' },
      { status: 502 },
    )
  }
}
