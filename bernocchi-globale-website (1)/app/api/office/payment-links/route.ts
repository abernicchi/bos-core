import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  OFFICE_ACCESS_COOKIE,
  requireSchedulingIdentity,
  supabaseUserRequest,
} from '@/lib/office-auth'

function parseUsd(value: unknown) {
  if (typeof value !== 'string' || !/^\d{1,5}(?:\.\d{1,2})?$/.test(value.trim())) return undefined
  const amount = Math.round(Number(value) * 100)
  return Number.isSafeInteger(amount) && amount > 0 ? amount : undefined
}

export async function POST(request: Request) {
  const store = await cookies()
  const accessToken = store.get(OFFICE_ACCESS_COOKIE)?.value
  if (!accessToken) return NextResponse.json({ error: 'Sesión expirada.' }, { status: 401 })

  try {
    await requireSchedulingIdentity(accessToken)
    const body = (await request.json()) as {
      bookingReservationId?: unknown
      amountUsd?: unknown
      description?: unknown
    }

    const bookingReservationId =
      typeof body.bookingReservationId === 'string' ? body.bookingReservationId : ''
    const amountMinor = parseUsd(body.amountUsd)
    const description = typeof body.description === 'string' ? body.description.trim() : ''

    if (!/^[0-9a-f-]{36}$/i.test(bookingReservationId) || !amountMinor || description.length < 3) {
      return NextResponse.json({ error: 'Datos del enlace incompletos.' }, { status: 400 })
    }

    const result = await supabaseUserRequest<Array<{
      payment_order_id: string
      public_token: string
      amount_minor: number
      currency: string
      expires_at: string
    }>>('rpc/scheduling_create_payment_order', accessToken, {
      method: 'POST',
      body: JSON.stringify({
        p_booking_reservation_id: bookingReservationId,
        p_description: description,
        p_amount_minor: amountMinor,
        p_currency: 'USD',
        p_expires_minutes: 120,
      }),
    })

    const order = result[0]
    if (!order?.public_token) throw new Error('PAYMENT_ORDER_NOT_CREATED')
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it').replace(/\/$/, '')
    return NextResponse.json({
      ok: true,
      url: `${siteUrl}/pay/${order.public_token}`,
      amountMinor: order.amount_minor,
      currency: order.currency,
      expiresAt: order.expires_at,
    })
  } catch (error) {
    console.error('[Casa Bernocchi] Office payment-link creation failed:', error)
    const text = String(error)
    if (text.includes('AUTH') || text.includes('OFFICE_')) {
      return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'No fue posible generar el enlace. Revise que la reserva esté pendiente y el monto autorizado.' },
      { status: 409 },
    )
  }
}
