import { NextResponse } from 'next/server'
import {
  buildAppointmentConfirmationEmail,
  buildAppointmentConfirmationText,
  getAppointmentConfirmationSubject,
  sendEmail,
  SEGRETERIA_RECIPIENT,
} from '@/lib/email'
import { consultationTypes } from '@/lib/content'
import { normalizeLocale } from '@/lib/i18n'

function clean(value: unknown, max = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const ALLOWED_MODES = new Set(['online', 'in-person'])

function durationMinutes(consultationId: string) {
  const service = consultationTypes.find((item) => item.id === consultationId)
  const match = service?.duration.match(/\d+/)
  return match ? Number(match[0]) : 50
}

function reservationTimes(date: string, time: string, duration: number) {
  const startAt = new Date(`${date}T${time}:00-06:00`)
  if (Number.isNaN(startAt.getTime())) return null
  const endAt = new Date(startAt.getTime() + duration * 60_000)
  return { startAt: startAt.toISOString(), endAt: endAt.toISOString() }
}

async function persistReservation(data: {
  consultationId: string
  consultation: string
  mode: string
  language: string
  fullName: string
  email: string
  whatsapp: string
  country: string
  date: string
  time: string
}) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return { status: 'skipped' as const }

  const times = reservationTimes(data.date, data.time, durationMinutes(data.consultationId))
  if (!times) return { status: 'error' as const, detail: 'Invalid reservation time.' }

  const headers: Record<string, string> = {
    apikey: key,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
  if (key.split('.').length === 3) headers.Authorization = `Bearer ${key}`

  try {
    const response = await fetch(`${url}/rest/v1/booking_reservations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        consultation_id: data.consultationId,
        consultation: data.consultation,
        mode: data.mode,
        language: data.language,
        source_locale: data.language,
        patient_name: data.fullName,
        patient_email: data.email,
        patient_whatsapp: data.whatsapp,
        country: data.country,
        start_at: times.startAt,
        end_at: times.endAt,
        status: 'pending_deposit',
        payment_method: 'pending',
        payment_status: 'pending',
        hold_expires_at: new Date(Date.now() + 30 * 60_000).toISOString(),
      }),
      cache: 'no-store',
    })
    const result = await response.json().catch(() => null) as Array<{ reference_code?: string }> | { message?: string } | null
    if (!response.ok) return { status: 'error' as const, detail: JSON.stringify(result) }
    const referenceCode = Array.isArray(result) ? result[0]?.reference_code : undefined
    return { status: 'saved' as const, referenceCode }
  } catch (error) {
    return { status: 'error' as const, detail: String(error) }
  }
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 })
  }

  if (clean(payload.company, 200) || clean(payload.website, 200)) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const consultationId = clean(payload.consultationId, 80)
  const consultation = clean(payload.consultation, 120)
  const mode = clean(payload.mode, 40)
  const fullName = clean(payload.fullName, 160)
  const email = clean(payload.email, 200)
  const whatsapp = clean(payload.whatsapp, 60)
  const country = clean(payload.country, 100)
  const language = normalizeLocale(clean(payload.language, 10))
  const date = clean(payload.date, 40)
  const time = clean(payload.time, 40)
  const consent = payload.consent === true || payload.consent === 'yes'

  const errors: string[] = []
  if (!consultationId || !consultationTypes.some((item) => item.id === consultationId)) errors.push('consultationId')
  if (!consultation) errors.push('consultation')
  if (!ALLOWED_MODES.has(mode)) errors.push('mode')
  if (fullName.length < 3) errors.push('fullName')
  if (!EMAIL_RE.test(email)) errors.push('email')
  if (!/^\+[1-9]\d{7,14}$/.test(whatsapp)) errors.push('whatsapp')
  if (!country) errors.push('country')
  if (!DATE_RE.test(date)) errors.push('date')
  if (!TIME_RE.test(time)) errors.push('time')
  if (!consent) errors.push('consent')

  if (errors.length > 0) {
    return NextResponse.json({ error: 'Validation failed.', fields: errors }, { status: 422 })
  }

  const databaseResult = await persistReservation({ consultationId, consultation, mode, language, fullName, email, whatsapp, country, date, time })
  if (databaseResult.status === 'error') {
    console.error('[Casa Bernocchi] Supabase reservation persistence failed:', databaseResult.detail)
  }

  const internalSummary = [
    'New appointment request — Bernocchi Health', '',
    `Reference: ${databaseResult.status === 'saved' ? databaseResult.referenceCode ?? 'generated' : 'email-only fallback'}`,
    `Consultation: ${consultation}`, `Mode: ${mode}`, `Requested date: ${date}`, `Requested time: ${time}`,
    `Preferred language: ${language}`, `Payment method: pending`, `Payment status: pending`, '',
    `Full name: ${fullName}`, `Email: ${email}`, `WhatsApp: ${whatsapp}`, `Country: ${country}`, '',
    'Note: no clinical information is collected through the website.',
  ].join('\n')

  const notifySegreteria = await sendEmail({
    to: SEGRETERIA_RECIPIENT,
    replyTo: email,
    subject: `Appointment request — ${consultation} — ${fullName}`,
    text: internalSummary,
  })

  if (notifySegreteria.status === 'error') {
    console.error('[Casa Bernocchi] Appointment delivery failed:', notifySegreteria.detail)
    if (databaseResult.status !== 'saved') return NextResponse.json({ error: 'Delivery failed.' }, { status: 502 })
  }

  if (notifySegreteria.status === 'skipped') {
    console.log('[Casa Bernocchi] Appointment received without email delivery.', { recipient: SEGRETERIA_RECIPIENT, summary: internalSummary })
  }

  const confirmationData = { fullName, consultation, mode, date, time, language }
  if (notifySegreteria.status === 'sent') {
    const patientConfirmation = await sendEmail({
      to: email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject: getAppointmentConfirmationSubject(language),
      text: buildAppointmentConfirmationText(confirmationData),
      html: buildAppointmentConfirmationEmail(confirmationData),
    })
    if (patientConfirmation.status === 'error') console.error('[Casa Bernocchi] Patient confirmation failed:', patientConfirmation.detail)
  }

  return NextResponse.json({ ok: true, referenceCode: databaseResult.status === 'saved' ? databaseResult.referenceCode : undefined, paymentMethod: 'pending', paymentStatus: 'pending' }, { status: 200 })
}
