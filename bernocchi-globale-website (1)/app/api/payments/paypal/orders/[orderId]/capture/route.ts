import { NextResponse } from 'next/server'
import { capturePayPalOrder, extractCapture } from '@/lib/payments/paypal'
import {
  completePayment,
  getPaymentOrderByToken,
  paymentIsExpired,
} from '@/lib/payments/orders'

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
      return NextResponse.json({ status: 'COMPLETED' })
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

    return NextResponse.json({ status: 'COMPLETED', captureId: capture.captureId })
  } catch (error) {
    console.error('[Casa Bernocchi] PayPal capture failed:', error)
    return NextResponse.json(
      { error: 'No fue posible confirmar el pago.' },
      { status: 502 },
    )
  }
}
