import { NextResponse } from 'next/server'
import { getPaymentConfig } from '@/lib/payments/config'
import { createPayPalOrder } from '@/lib/payments/paypal'
import {
  getPaymentOrderByToken,
  setProviderCheckout,
} from '@/lib/payments/orders'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { paymentToken?: unknown }
    const token = typeof body.paymentToken === 'string' ? body.paymentToken : ''
    const order = await getPaymentOrderByToken(token)
    if (!order) return NextResponse.json({ error: 'Enlace inválido.' }, { status: 404 })

    const config = getPaymentConfig(order.service_code)
    if (!config.enabled || !config.paypal) {
      return NextResponse.json({ error: 'PayPal no está habilitado.' }, { status: 503 })
    }
    if (order.status === 'completed') {
      return NextResponse.json({ error: 'La orden ya fue pagada.' }, { status: 409 })
    }
    if (!['pending', 'checkout_created', 'failed'].includes(order.status)) {
      return NextResponse.json({ error: 'La orden no admite cobro.' }, { status: 409 })
    }
    if (new Date(order.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: 'El enlace ha expirado.' }, { status: 410 })
    }
    if (order.provider === 'paypal' && order.provider_order_id) {
      return NextResponse.json({ id: order.provider_order_id })
    }

    const paypalOrder = await createPayPalOrder(order)
    await setProviderCheckout({
      paymentOrderId: order.id,
      provider: 'paypal',
      providerOrderId: paypalOrder.id!,
      providerAmountMinor: order.amount_minor,
      providerCurrency: order.currency,
    })
    return NextResponse.json({ id: paypalOrder.id })
  } catch (error) {
    console.error('[Casa Bernocchi] PayPal order creation failed:', error)
    return NextResponse.json(
      { error: 'No fue posible iniciar el pago.' },
      { status: 502 },
    )
  }
}
