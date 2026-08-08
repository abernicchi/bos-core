import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  assertCalendarAvailable,
  CalendarConflictError,
  createPendingCalendarEvent,
} from '@/lib/google-calendar'
import { consultationTypes } from '@/lib/content'
import { OFFICE_ACCESS_COOKIE, requireSchedulingIdentity } from '@/lib/office-auth'
import { supabaseRequest } from '@/lib/supabase-rest'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i

type Reservation = {
  id: string
  reference_code: string
  consultation_id: string
  consultation: string
  mode: string
  language: string
  patient_name: string
  patient_email: string
  patient_whatsapp: string
  start_at: string
  end_at: string
  hold_expires_at: string
}

function clean(value: unknown, max = 180) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(request: Request) {
  const store = await cookies()
  const accessToken = store.get(OFFICE_ACCESS_COOKIE)?.value
  if (!accessToken) return NextResponse.json({ error: 'Sesión expirada.' }, { status: 401 })

  try {
    const identity = await requireSchedulingIdentity(accessToken)
    if (!identity.profile.can_create_appointments) {
      return NextResponse.json({ error: 'El perfil no puede crear citas.' }, { status: 403 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const patientName = clean(body.patientName, 160)
    const patientEmail = clean(body.patientEmail, 240).toLowerCase()
    const patientWhatsapp = clean(body.patientWhatsapp, 40)
    const consultationId = clean(body.consultationId, 80)
    const mode = clean(body.mode, 20)
    const language = clean(body.language, 5) || 'es'
    const country = clean(body.country, 80) || 'Costa Rica'
    const localStart = clean(body.localStart, 40)

    const service = consultationTypes.find((item) => item.id === consultationId)
    const durationMinutes = service ? Number.parseInt(service.duration, 10) : NaN
    if (
      !patientName ||
      !patientEmail.includes('@') ||
      !patientWhatsapp ||
      !service ||
      !Number.isFinite(durationMinutes) ||
      !['online', 'in-person'].includes(mode) ||
      !['es', 'it', 'en'].includes(language) ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(localStart)
    ) {
      return NextResponse.json({ error: 'Revise los datos de la cita.' }, { status: 400 })
    }

    const start = new Date(`${localStart}:00-06:00`)
    const end = new Date(start.getTime() + durationMinutes * 60_000)
    if (!Number.isFinite(start.getTime()) || start.getTime() < Date.now() - 5 * 60_000) {
      return NextResponse.json({ error: 'La fecha indicada no es válida.' }, { status: 400 })
    }
    if (start.getTime() > Date.now() + 366 * 24 * 60 * 60_000) {
      return NextResponse.json({ error: 'La cita excede el horizonte permitido.' }, { status: 400 })
    }

    const startAt = start.toISOString()
    const endAt = end.toISOString()
    await assertCalendarAvailable(startAt, endAt, 'ordo_medicinae')

    const holdExpiresAt = new Date(Date.now() + 24 * 60 * 60_000).toISOString()
    const { data } = await supabaseRequest<Reservation[]>('booking_reservations', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        consultation_id: consultationId,
        consultation: service.name,
        mode,
        language,
        patient_name: patientName,
        patient_email: patientEmail,
        patient_whatsapp: patientWhatsapp,
        start_at: startAt,
        end_at: endAt,
        status: 'pending_deposit',
        hold_expires_at: holdExpiresAt,
        country,
        source_locale: language,
        payment_method: 'pending',
        payment_status: 'pending',
      }),
    })
    const reservation = data[0]
    if (!reservation?.id || !UUID_RE.test(reservation.id)) throw new Error('RESERVATION_NOT_CREATED')

    try {
      const eventId = await createPendingCalendarEvent({
        reservationId: reservation.id,
        referenceCode: reservation.reference_code,
        consultation: reservation.consultation,
        consultationId: reservation.consultation_id,
        mode: reservation.mode,
        language: reservation.language,
        patientName: reservation.patient_name,
        patientEmail: reservation.patient_email,
        patientWhatsapp: reservation.patient_whatsapp,
        startAt: reservation.start_at,
        endAt: reservation.end_at,
        holdExpiresAt: reservation.hold_expires_at,
        calendarScope: 'ordo_medicinae',
      })
      await supabaseRequest(`booking_reservations?id=eq.${reservation.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ google_event_id: eventId, updated_at: new Date().toISOString() }),
      })
    } catch (error) {
      await supabaseRequest(`booking_reservations?id=eq.${reservation.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'failed', updated_at: new Date().toISOString() }),
      }).catch(() => undefined)
      throw error
    }

    await supabaseRequest('scheduling_audit_events', {
      method: 'POST',
      body: JSON.stringify({
        actor_id: identity.user.id,
        action: 'booking.manual_created',
        entity_type: 'booking_reservation',
        entity_id: reservation.id,
        metadata: {
          source: 'segretaria_console',
          reference_code: reservation.reference_code,
          consultation_id: consultationId,
          start_at: startAt,
          mode,
        },
      }),
    })

    return NextResponse.json({
      ok: true,
      bookingReservationId: reservation.id,
      referenceCode: reservation.reference_code,
    })
  } catch (error) {
    console.error('[Casa Bernocchi] Manual booking failed:', error)
    if (error instanceof CalendarConflictError) {
      return NextResponse.json({ error: 'Ese horario ya está ocupado en Calendar.' }, { status: 409 })
    }
    const text = String(error)
    if (text.includes('AUTH') || text.includes('OFFICE_')) {
      return NextResponse.json({ error: 'Sesión no válida.' }, { status: 401 })
    }
    return NextResponse.json({ error: 'No fue posible crear la cita. Revise disponibilidad e inténtelo nuevamente.' }, { status: 502 })
  }
}
