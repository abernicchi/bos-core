import { NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-token'
import { CalendarConflictError, HoldExpiredError, confirmEvent, deleteEvent, getEvent, waitForConference } from '@/lib/google-calendar'
import { reservationByGoogleEvent, updateReservation } from '@/lib/booking-store'
import { buildConfirmedAppointmentEmail, buildConfirmedAppointmentText, getConfirmedAppointmentSubject, SEGRETERIA_RECIPIENT, sendEmail } from '@/lib/email'

function redirect(request: Request, token: string, result: string) {
  return NextResponse.redirect(new URL(`/admin/bookings/${encodeURIComponent(token)}?result=${result}`, request.url), 303)
}

export async function POST(request: Request) {
  const data = await request.formData(); const token = String(data.get('token') ?? ''); const action = String(data.get('action') ?? '')
  const payload = verifyAdminToken(token); if (!payload) return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 403 })
  try {
    const event = await getEvent(payload.eventId); const properties = event.extendedProperties?.private ?? {}
    if (action === 'confirm') {
      const reservation = await reservationByGoogleEvent(payload.eventId)
      if (!reservation) return redirect(request, token, 'error')
      if (reservation.confirmation_email_sent_at) return redirect(request, token, 'confirmed')
      const confirmed = properties.bookingStatus === 'confirmed' ? event : await confirmEvent(event)
      await updateReservation(reservation.id, { status: 'confirmed' })
      let updated = confirmed; let meetUrl: string | undefined
      if (properties.mode === 'online') {
        const conference = await waitForConference(payload.eventId)
        updated = conference.event
        if (conference.status === 'pending') return redirect(request, token, 'meet-pending')
        if (conference.status === 'failed') return redirect(request, token, 'meet-failed')
        meetUrl = conference.videoUrl
      }
      const start = updated.start?.dateTime ? new Date(updated.start.dateTime) : undefined
      const date = start ? new Intl.DateTimeFormat(properties.language ?? 'en', { dateStyle: 'long', timeZone: 'America/Costa_Rica' }).format(start) : '—'
      const time = start ? new Intl.DateTimeFormat(properties.language ?? 'en', { timeStyle: 'short', timeZone: 'America/Costa_Rica' }).format(start) : '—'
      const message = { fullName: properties.patientName ?? '', consultation: properties.consultation ?? '', mode: properties.mode ?? '', language: properties.language ?? 'en', date, time, meetUrl }
      const delivery = await sendEmail({ to: properties.patientEmail, replyTo: SEGRETERIA_RECIPIENT, subject: getConfirmedAppointmentSubject(message.language), text: buildConfirmedAppointmentText(message), html: buildConfirmedAppointmentEmail(message) })
      if (delivery.status === 'sent') await updateReservation(reservation.id, { confirmation_email_sent_at: new Date().toISOString() })
      if (delivery.status === 'error') console.error('[booking-admin] confirmation email delivery failed', { bookingId: reservation.id })
      return redirect(request, token, delivery.status === 'error' ? 'confirmed-email-error' : 'confirmed')
    }
    if (action === 'release' || action === 'cancel') {
      if (event.status !== 'cancelled') await deleteEvent(payload.eventId)
      const reservation = await reservationByGoogleEvent(payload.eventId)
      if (reservation) await updateReservation(reservation.id, { status: action === 'release' ? 'released' : 'cancelled' })
      return redirect(request, token, action === 'release' ? 'released' : 'cancelled')
    }
    return NextResponse.json({ error: 'Invalid action.' }, { status: 422 })
  } catch (error) {
    if (error instanceof HoldExpiredError) return redirect(request, token, 'expired')
    if (error instanceof CalendarConflictError) return redirect(request, token, 'conflict')
    return redirect(request, token, 'error')
  }
}
