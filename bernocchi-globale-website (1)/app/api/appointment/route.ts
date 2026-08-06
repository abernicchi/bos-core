import { NextResponse } from 'next/server'
import {
  buildAppointmentConfirmationEmail,
  buildAppointmentConfirmationText,
  getAppointmentConfirmationSubject,
  sendEmail,
  SEGRETERIA_RECIPIENT,
} from '@/lib/email'
import { consultationDuration, costaRicaDateTime, validBookingDate } from '@/lib/booking'
import { CalendarConflictError, createPending, deleteEvent, eventBlocksSlot, listEvents } from '@/lib/google-calendar'
import { ReservationConflictError, reserveAtomic, updateReservation } from '@/lib/booking-store'
import { createAdminToken } from '@/lib/admin-token'
import { bookingTimeSlots, consultationModes, consultationTypes, languages } from '@/lib/content'

/**
 * Appointment-request endpoint for Bernocchi Health.
 *
 * Receives scheduling and contact information only.
 * No clinical or sensitive medical information is collected.
 */

function clean(value: unknown, max = 500): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let payload: Record<string, unknown>

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid body.' },
      { status: 400 },
    )
  }

  /*
   * Honeypot protection.
   * Legitimate visitors leave these hidden fields empty.
   */
  if (
    clean(payload.company, 200) ||
    clean(payload.website, 200)
  ) {
    return NextResponse.json(
      { ok: true },
      { status: 200 },
    )
  }

  const consultation = clean(payload.consultation, 120)
  const mode = clean(payload.mode, 40)
  const fullName = clean(payload.fullName, 160)
  const email = clean(payload.email, 200)
  const whatsapp = clean(payload.whatsapp, 60)
  const country = clean(payload.country, 100)
  const language = clean(payload.language, 40)
  const date = clean(payload.date, 40)
  const time = clean(payload.time, 40)
  const consultationId = clean(payload.consultationId, 80)
  const acceptedTerms = payload.acceptedTerms === true
  const duration = consultationDuration(consultationId)
  const canonicalConsultation = consultationTypes.find((item) => item.id === consultationId)
  const canonicalMode = consultationModes.find((item) => item.value === mode || item.label === mode)
  const canonicalLanguage = languages.find((item) => item.value === language || item.label === language)

  const errors: string[] = []

  if (!consultation || !canonicalConsultation || consultation !== canonicalConsultation.name || !duration) errors.push('consultation')
  if (!canonicalMode) errors.push('mode')
  if (!fullName) errors.push('fullName')
  if (!EMAIL_RE.test(email)) errors.push('email')
  if (!whatsapp) errors.push('whatsapp')
  if (!country) errors.push('country')
  if (!date) errors.push('date')
  if (!bookingTimeSlots.includes(time)) errors.push('time')
  if (!canonicalLanguage) errors.push('language')
  if (!acceptedTerms) errors.push('acceptedTerms')
  if (!validBookingDate(date) || Number.isNaN(costaRicaDateTime(date, time).valueOf())) errors.push('date')

  if (errors.length > 0) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        fields: errors,
      },
      { status: 422 },
    )
  }

  const start = costaRicaDateTime(date, time)
  const end = new Date(start.valueOf() + duration! * 60_000)
  let hold: { id: string; holdExpiresAt: string }
  let reservationId: string | undefined
  let googleEventId: string | undefined
  try {
    const before = await listEvents(start, end)
    if (before.some((event) => eventBlocksSlot(event, start, end))) return NextResponse.json({ error: 'Slot unavailable.' }, { status: 409 })
    const holdExpiresAt = new Date(Date.now() + 30 * 60_000).toISOString()
    const reservation = await reserveAtomic({ consultationId, consultation, mode: canonicalMode!.value, language: canonicalLanguage!.value, patientName: fullName, patientEmail: email, patientWhatsapp: whatsapp, startAt: start.toISOString(), endAt: end.toISOString(), holdExpiresAt })
    reservationId = reservation.id
    const after = await listEvents(start, end)
    if (after.some((event) => eventBlocksSlot(event, start, end))) { await updateReservation(reservation.id, { status: 'released' }); return NextResponse.json({ error: 'Slot unavailable.' }, { status: 409 }) }
    hold = await createPending({ bookingId: reservation.id, date, time, duration: duration!, consultation, consultationId, patientName: fullName, patientEmail: email, patientWhatsapp: whatsapp, language: canonicalLanguage!.value, mode: canonicalMode!.value, holdExpiresAt })
    googleEventId = hold.id
    await updateReservation(reservation.id, { google_event_id: hold.id })
  } catch (error) {
    if (googleEventId) await deleteEvent(googleEventId).catch(() => undefined)
    if (reservationId) await updateReservation(reservationId, { status: 'failed' }).catch(() => undefined)
    if (error instanceof CalendarConflictError || error instanceof ReservationConflictError) return NextResponse.json({ error: 'Slot unavailable.' }, { status: 409 })
    return NextResponse.json({ error: 'Calendar temporarily unavailable.' }, { status: 503 })
  }

  const reviewToken = createAdminToken(hold.id, new Date(Date.now() + 48 * 60 * 60_000))
  const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it'}/admin/bookings/${encodeURIComponent(reviewToken)}`

  /*
   * Internal message received by Segreteria Generale.
   */
  const internalSummary = [
    'New appointment request — Bernocchi Health',
    '',
    `Consultation: ${consultation}`,
    `Mode: ${mode}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    `Preferred language: ${language || '—'}`,
    '',
    `Full name: ${fullName}`,
    `Email: ${email}`,
    `WhatsApp: ${whatsapp}`,
    `Country: ${country}`,
    `Booking identifier: ${hold.id}`,
    `Provisional hold expires: ${hold.holdExpiresAt}`,
    `Secure review: ${reviewUrl}`,
    '',
    'Note: no clinical information is collected through the website.',
  ].join('\n')

  const notifySegreteria = await sendEmail({
    to: SEGRETERIA_RECIPIENT,
    replyTo: email,
    subject: `Appointment request — ${consultation} — ${fullName}`,
    text: internalSummary,
  })

  if (notifySegreteria.status === 'error') {
    await deleteEvent(hold.id).catch(() => undefined)
    if (reservationId) await updateReservation(reservationId, { status: 'failed' }).catch(() => undefined)
    console.error(
      '[Casa Bernocchi] Appointment delivery failed:',
      notifySegreteria.detail,
    )

    return NextResponse.json(
      { error: 'Delivery failed.' },
      { status: 502 },
    )
  }

  if (notifySegreteria.status === 'skipped') {
    console.log(
      '[Casa Bernocchi] Appointment received without email delivery.',
      {
        recipient: SEGRETERIA_RECIPIENT,
        bookingId: hold.id,
      },
    )
  }

  const confirmationData = {
    fullName,
    consultation,
    mode,
    date,
    time,
    language,
  }

  /*
   * Plain-text fallback and premium HTML presentation are generated
   * from the same language-aware source.
   */
  const confirmationText =
    buildAppointmentConfirmationText(confirmationData)

  const confirmationHtml =
    buildAppointmentConfirmationEmail(confirmationData)

  /*
   * Patient confirmation is best-effort:
   * the appointment remains received even if this second email fails.
   */
  if (notifySegreteria.status === 'sent') {
    const patientConfirmation = await sendEmail({
      to: email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject: getAppointmentConfirmationSubject(language),
      text: confirmationText,
      html: confirmationHtml,
    })

    if (patientConfirmation.status === 'error') {
      console.error(
        '[Casa Bernocchi] Patient confirmation failed:',
        patientConfirmation.detail,
      )
    }
  }

  return NextResponse.json(
    { ok: true, bookingId: hold.id, holdExpiresAt: hold.holdExpiresAt },
    { status: 200 },
  )
}
