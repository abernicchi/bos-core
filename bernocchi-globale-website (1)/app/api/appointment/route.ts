import { NextResponse } from 'next/server'
import {
  buildAppointmentConfirmationEmail,
  sendEmail,
  SEGRETERIA_RECIPIENT,
} from '@/lib/email'
import { site } from '@/lib/content'

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

  const errors: string[] = []

  if (!consultation) errors.push('consultation')
  if (!mode) errors.push('mode')
  if (!fullName) errors.push('fullName')
  if (!EMAIL_RE.test(email)) errors.push('email')
  if (!whatsapp) errors.push('whatsapp')
  if (!country) errors.push('country')
  if (!date) errors.push('date')
  if (!time) errors.push('time')

  if (errors.length > 0) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        fields: errors,
      },
      { status: 422 },
    )
  }

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
        summary: internalSummary,
      },
    )
  }

  /*
   * Plain-text fallback for email clients that do not render HTML.
   */
  const confirmationText = [
    `Dear ${fullName},`,
    '',
    'Thank you for contacting Bernocchi Health.',
    '',
    'Your appointment request has been received by our Segreteria Generale. A member of our office will review the requested date and contact you personally to confirm availability and the next steps.',
    '',
    `Consultation: ${consultation}`,
    `Mode: ${mode}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    `Preferred language: ${language || 'Not specified'}`,
    '',
    'This communication confirms receipt of your request. It does not yet constitute a confirmed appointment, and no payment has been taken.',
    '',
    'With our regards,',
    'Segreteria Generale',
    site.name,
    site.legalName,
    site.domain,
  ].join('\n')

  /*
   * Premium HTML presentation defined in lib/email.ts.
   */
  const confirmationHtml =
    buildAppointmentConfirmationEmail({
      fullName,
      consultation,
      mode,
      date,
      time,
      language,
    })

  /*
   * Patient confirmation is best-effort:
   * the appointment remains received even if this second email fails.
   */
  if (notifySegreteria.status === 'sent') {
    const patientConfirmation = await sendEmail({
      to: email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject:
        'Your appointment request has been received — Bernocchi Health',
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
    { ok: true },
    { status: 200 },
  )
}
