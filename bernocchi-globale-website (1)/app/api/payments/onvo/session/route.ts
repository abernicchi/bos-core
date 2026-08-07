import { NextResponse } from 'next/server'
import { getPaymentConfig } from '@/lib/payments/config'
import { createOnvoCheckout } from '@/lib/payments/onvo'
import {
  getBookingContact,
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
    if (!config.enabled || !config.onvo || !config.onvoQuote) {
      return NextResponse.json({ error: 'Pago local no habilitado.' }, { status: 503 })
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
    if (order.provider === 'onvo' && order.checkout_url) {
      return NextResponse.json({ url: order.checkout_url })
    }

    const contact = await getBookingContact(order.booking_reservation_id)
    if (!contact) throw new Error('BOOKING_CONTACT_NOT_FOUND')
    const session = await createOnvoCheckout({
      order,
      contact,
      amountMinor: config.onvoQuote.amountMinor,
      currency: config.onvoQuote.currency,
    })
    await setProviderCheckout({
      paymentOrderId: order.id,
      provider: 'onvo',
      providerOrderId: session.id!,
      providerAmountMinor: config.onvoQuote.amountMinor,
      providerCurrency: config.onvoQuote.currency,
      checkoutUrl: session.url,
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[Casa Bernocchi] ONVO checkout creation failed:', error)
    return NextResponse.json(
      { error: 'No fue posible crear el enlace de pago local.' },
      { status: 502 },
    )
  }
}
