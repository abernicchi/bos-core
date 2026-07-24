import { NextResponse } from 'next/server'
import { sendEmail, SEGRETERIA_RECIPIENT } from '@/lib/email'
import { site } from '@/lib/content'

/**
 * APPOINTMENT REQUEST endpoint for Bernocchi Health.
 *
 * Captures a booking *request* (no payment) and delivers it to the Segreteria
 * Generale via Resend (see lib/email). A confirmation is also sent to the
 * visitor. When RESEND_API_KEY is not configured, the request is validated and
 * logged server-side so the flow keeps working.
 *
 * Privacy:
 *   - We deliberately do NOT collect clinical history or sensitive medical
 *     information here — only scheduling and contact details.
 *   - Provider keys are read from server-only env vars, never exposed.
 *
 * Spam protection:
 *   - A hidden honeypot field ("company") must remain empty. Bots that fill it
 *     receive a silent success and are dropped.
 *
 * PAYMENT PLACEHOLDER:
 *   - Payment is intentionally NOT collected yet. When Stripe is activated,
 *     initiate checkout from the booking flow (see components/embedded-checkout
 *     and app/actions/stripe.ts) after this request is created.
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
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 })
  }

  // Honeypot: bots fill hidden fields. Silently accept and drop.
  if (clean(payload.company, 200) || clean(payload.website, 200)) {
    return NextResponse.json({ ok: true }, { status: 200 })
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
      { error: 'Validation failed.', fields: errors },
      { status: 422 },
    )
  }

  const summary = [
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

  // 1) Notify the Segreteria Generale.
  const notify = await sendEmail({
    to: SEGRETERIA_RECIPIENT,
    replyTo: email,
    subject: `Appointment request — ${consultation} — ${fullName}`,
    text: summary,
  })

  if (notify.status === 'error') {
    console.error('[v0] Appointment delivery failed:', notify.detail)
    return NextResponse.json({ error: 'Delivery failed.' }, { status: 502 })
  }

  if (notify.status === 'skipped') {
    console.log(
      '[v0] New Bernocchi Health appointment request (email not configured)',
      { recipient: SEGRETERIA_RECIPIENT, summary },
    )
  }

  // 2) Confirm to the visitor (best-effort; never blocks the response).
  const confirmation = [
    `Dear ${fullName},`,
    '',
    'Thank you for your appointment request with Bernocchi Health. Our Segreteria Generale has received the following details and will contact you to confirm availability:',
    '',
    `Consultation: ${consultation}`,
    `Mode: ${mode}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    `Preferred language: ${language || '—'}`,
    '',
    'This is a request only — no payment has been taken. If you would like to speak with us sooner, you may reply to this email.',
    '',
    'With our regards,',
    'Segreteria Generale',
    site.name,
  ].join('\n')

  if (notify.status === 'sent') {
    const ack = await sendEmail({
      to: email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject: 'We have received your appointment request — Bernocchi Health',
      text: confirmation,
    })
    if (ack.status === 'error') {
      // Non-fatal: the Segreteria was already notified.
      console.error('[v0] Visitor confirmation failed:', ack.detail)
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
