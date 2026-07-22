import { NextResponse } from 'next/server'
import { sendEmail, SEGRETERIA_RECIPIENT } from '@/lib/email'
import { site } from '@/lib/content'

/**
 * Contact / inquiry endpoint for the Segreteria Generale.
 *
 * Delivery via Resend (see lib/email). The Segreteria is notified and the
 * visitor receives a confirmation. When RESEND_API_KEY is not configured, the
 * request is validated and logged server-side so nothing breaks.
 *
 * Security notes:
 *   - Provider keys are read from server-only env vars, never exposed.
 *   - Input is trimmed and length-capped.
 *   - A hidden honeypot field ("company") drops obvious bots.
 *   - Do NOT persist clinical or sensitive data from the public form.
 */

const ALLOWED_TYPES = [
  'health',
  'institutional',
  'collaboration',
  'research',
  'media',
  'other',
]

function clean(value: unknown, max = 2000): string {
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

  const fullName = clean(payload.fullName, 160)
  const email = clean(payload.email, 200)
  const phone = clean(payload.phone, 60)
  const country = clean(payload.country, 80)
  const inquiryType = clean(payload.inquiryType, 40)
  const language = clean(payload.language, 10)
  const mode = clean(payload.mode, 20)
  const message = clean(payload.message, 2000)
  const consent = payload.consent === 'yes' || payload.consent === true

  const errors: string[] = []
  if (!fullName) errors.push('fullName')
  if (!EMAIL_RE.test(email)) errors.push('email')
  if (!message) errors.push('message')
  if (!consent) errors.push('consent')
  if (inquiryType && !ALLOWED_TYPES.includes(inquiryType))
    errors.push('inquiryType')

  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Validation failed.', fields: errors },
      { status: 422 },
    )
  }

  const summary = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    country && `Country: ${country}`,
    inquiryType && `Type: ${inquiryType}`,
    language && `Language: ${language}`,
    mode && `Mode: ${mode}`,
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n')

  // 1) Notify the Segreteria Generale.
  const notify = await sendEmail({
    to: SEGRETERIA_RECIPIENT,
    replyTo: email,
    subject: `New enquiry — ${inquiryType || 'general'} — ${fullName}`,
    text: summary,
  })

  if (notify.status === 'error') {
    console.error('[v0] Enquiry delivery failed:', notify.detail)
    return NextResponse.json({ error: 'Delivery failed.' }, { status: 502 })
  }

  if (notify.status === 'skipped') {
    console.log('[v0] New Segreteria Generale enquiry (email not configured)', {
      recipient: SEGRETERIA_RECIPIENT,
      summary,
    })
  }

  // 2) Confirm to the visitor (best-effort; never blocks the response).
  if (notify.status === 'sent') {
    const confirmation = [
      `Dear ${fullName},`,
      '',
      'Thank you for contacting Casa Bernocchi. Our Segreteria Generale has received your message and will respond in due course.',
      '',
      'For reference, this is a copy of your enquiry:',
      '',
      message,
      '',
      'With our regards,',
      'Segreteria Generale',
      site.name,
    ].join('\n')

    const ack = await sendEmail({
      to: email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject: 'We have received your message — Casa Bernocchi',
      text: confirmation,
    })
    if (ack.status === 'error') {
      console.error('[v0] Visitor confirmation failed:', ack.detail)
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
