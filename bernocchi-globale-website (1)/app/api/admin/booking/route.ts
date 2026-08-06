import { NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-token'
import { CalendarConflictError, HoldExpiredError, confirmEvent, deleteEvent, getEvent } from '@/lib/google-calendar'
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
      if (properties.bookingStatus === 'confirmed') return redirect(request, token, 'confirmed')
      const confirmed = await confirmEvent(event)
      const start = confirmed.start?.dateTime ? new Date(confirmed.start.dateTime) : undefined
      const date = start ? new Intl.DateTimeFormat(properties.language ?? 'en', { dateStyle: 'long', timeZone: 'America/Costa_Rica' }).format(start) : '—'
      const time = start ? new Intl.DateTimeFormat(properties.language ?? 'en', { timeStyle: 'short', timeZone: 'America/Costa_Rica' }).format(start) : '—'
      const message = { fullName: properties.patientName ?? '', consultation: properties.consultation ?? '', mode: properties.mode ?? '', language: properties.language ?? 'en', date, time, meetUrl: confirmed.hangoutLink }
      const delivery = await sendEmail({ to: properties.patientEmail, replyTo: SEGRETERIA_RECIPIENT, subject: getConfirmedAppointmentSubject(message.language), text: buildConfirmedAppointmentText(message), html: buildConfirmedAppointmentEmail(message) })
      if (delivery.status === 'error') console.error('[booking-admin] confirmation email delivery failed', { bookingId: payload.eventId })
      return redirect(request, token, delivery.status === 'error' ? 'confirmed-email-error' : 'confirmed')
    }
    if (action === 'release' || action === 'cancel') {
      if (event.status !== 'cancelled') await deleteEvent(payload.eventId)
      return redirect(request, token, action === 'release' ? 'released' : 'cancelled')
    }
    return NextResponse.json({ error: 'Invalid action.' }, { status: 422 })
  } catch (error) {
    if (error instanceof HoldExpiredError) return redirect(request, token, 'expired')
    if (error instanceof CalendarConflictError) return redirect(request, token, 'conflict')
    return redirect(request, token, 'error')
  }
}
