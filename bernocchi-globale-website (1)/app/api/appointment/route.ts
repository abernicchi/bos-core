import { NextResponse } from 'next/server'
import { sendEmail, SEGRETERIA_RECIPIENT } from '@/lib/email'
import { consultationTypes } from '@/lib/content'
import { normalizeLocale } from '@/lib/i18n'
import {
  createPaymentOrderForReservation,
  expireStaleCheckoutHolds,
  paymentIsAvailable,
  paymentLinkFor,
} from '@/lib/payments/orders'

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
    await expireStaleCheckoutHolds()
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
    const result = await response.json().catch(() => null) as Array<{ id?: string; reference_code?: string }> | { message?: string } | null
    if (!response.ok) return { status: 'error' as const, detail: JSON.stringify(result), responseStatus: response.status }
    const reservationId = Array.isArray(result) ? result[0]?.id : undefined
    const referenceCode = Array.isArray(result) ? result[0]?.reference_code : undefined
    return { status: 'saved' as const, reservationId, referenceCode }
  } catch (error) {
    return { status: 'error' as const, detail: String(error), responseStatus: 0 }
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
    const conflict = databaseResult.responseStatus === 409
    return NextResponse.json(
      {
        error: conflict
          ? 'The selected time is no longer available.'
          : 'The reservation could not be registered.',
      },
      { status: conflict ? 409 : 502 },
    )
  }

  let paymentOrder: Awaited<ReturnType<typeof createPaymentOrderForReservation>>
  if (databaseResult.status === 'saved' && databaseResult.reservationId) {
    try {
      paymentOrder = await createPaymentOrderForReservation(
        databaseResult.reservationId,
        consultationId,
      )
    } catch (error) {
      console.error('[Casa Bernocchi] Payment order creation failed:', error)
    }
  }
  const paymentAvailable = Boolean(paymentOrder && paymentIsAvailable(paymentOrder))
  const paymentLink = paymentOrder && paymentAvailable ? paymentLinkFor(paymentOrder) : undefined

  const internalSummary = [
    'New appointment request — Bernocchi Health', '',
    `Reference: ${databaseResult.status === 'saved' ? databaseResult.referenceCode ?? 'generated' : 'email-only fallback'}`,
    `Consultation: ${consultation}`, `Mode: ${mode}`, `Requested date: ${date}`, `Requested time: ${time}`,
    `Preferred language: ${language}`, `Payment method: ${paymentAvailable ? 'online link available' : 'pending'}`, `Payment status: pending`,
    paymentLink && `Payment link: ${paymentLink}`, '',
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

  const confirmationCopy = {
    es: { subject: 'Solicitud de cita recibida — Bernocchi Health', title: 'Su solicitud ha sido recibida', body: 'La Segreteria Generale verificará la disponibilidad y remitirá la confirmación definitiva.', payment: 'El método de pago permanece pendiente. No se ha realizado ningún cobro.' },
    en: { subject: 'Appointment request received — Bernocchi Health', title: 'Your request has been received', body: 'The Segreteria Generale will verify availability and send final confirmation.', payment: 'The payment method remains pending. No charge has been made.' },
    it: { subject: 'Richiesta di appuntamento ricevuta — Bernocchi Health', title: 'La Sua richiesta è stata ricevuta', body: 'La Segreteria Generale verificherà la disponibilità e invierà la conferma definitiva.', payment: 'Il metodo di pagamento resta in attesa. Non è stato effettuato alcun addebito.' },
    fr: { subject: 'Demande de rendez-vous reçue — Bernocchi Health', title: 'Votre demande a été reçue', body: 'La Segreteria Generale vérifiera la disponibilité et enverra la confirmation définitive.', payment: 'Le mode de paiement reste en attente. Aucun débit n’a été effectué.' },
    de: { subject: 'Terminanfrage erhalten — Bernocchi Health', title: 'Ihre Anfrage ist eingegangen', body: 'Die Segreteria Generale prüft die Verfügbarkeit und sendet die endgültige Bestätigung.', payment: 'Die Zahlungsmethode ist noch offen. Es wurde nichts belastet.' },
    ca: { subject: 'Sol·licitud de cita rebuda — Bernocchi Health', title: 'La vostra sol·licitud ha estat rebuda', body: 'La Segreteria Generale verificarà la disponibilitat i enviarà la confirmació definitiva.', payment: 'El mètode de pagament continua pendent. No s’ha realitzat cap cobrament.' },
    zh: { subject: '已收到预约申请 — Bernocchi Health', title: '您的申请已收到', body: 'Segreteria Generale 将核实可用时间并发送最终确认。', payment: '付款方式仍为待定，尚未产生任何扣款。' },
    pl: { subject: 'Otrzymano prośbę o wizytę — Bernocchi Health', title: 'Otrzymaliśmy Twoje zgłoszenie', body: 'Segreteria Generale sprawdzi dostępność i prześle ostateczne potwierdzenie.', payment: 'Metoda płatności pozostaje oczekująca. Nie pobrano opłaty.' },
    ru: { subject: 'Запрос на приём получен — Bernocchi Health', title: 'Ваш запрос получен', body: 'Segreteria Generale проверит доступность и направит окончательное подтверждение.', payment: 'Способ оплаты пока не назначен. Списание не производилось.' },
    ja: { subject: '予約申請を受け付けました — Bernocchi Health', title: '申請を受け付けました', body: 'Segreteria Generale が空き状況を確認し、最終確認を送付します。', payment: '支払方法は未定です。請求は行われていません。' },
  }[language]

  if (notifySegreteria.status === 'sent') {
    const patientText = [
      confirmationCopy.title, '', confirmationCopy.body,
      paymentAvailable
        ? 'A private online payment link is available below. No charge is made until you complete the provider checkout.'
        : confirmationCopy.payment,
      paymentLink ? paymentLink : '', '',
      `Consultation: ${consultation}`, `Mode: ${mode}`, `Requested date: ${date}`,
      `Requested time: ${time}`,
      `Reference: ${databaseResult.status === 'saved' ? databaseResult.referenceCode ?? 'pending' : 'pending'}`,
      '', 'Casa Bernocchi · Segreteria Generale',
    ].join('\n')
    const patientHtml = `<!doctype html><html lang="${language}"><body style="margin:0;background:#07131f;color:#f7f1e6;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:48px 24px"><p style="color:#c9a85f;letter-spacing:.18em;text-transform:uppercase;font-size:11px">Bernocchi Health</p><h1 style="font-family:Georgia,serif;font-weight:400;font-size:36px;line-height:1.15">${confirmationCopy.title}</h1><p style="color:rgba(255,255,255,.72);line-height:1.7">${confirmationCopy.body}</p><div style="margin:28px 0;padding:20px;border:1px solid rgba(201,168,95,.35);border-radius:16px;background:rgba(201,168,95,.08)"><strong style="color:#e2c77f">${paymentAvailable ? 'A private online payment link is ready.' : confirmationCopy.payment}</strong>${paymentLink ? `<p style="margin:18px 0 0"><a href="${paymentLink}" style="display:inline-block;border-radius:999px;background:#c9a85f;color:#07131f;padding:12px 20px;text-decoration:none;font-weight:700">Open secure payment</a></p>` : ''}</div><table style="width:100%;border-collapse:collapse;color:rgba(255,255,255,.72);font-size:14px"><tr><td style="padding:8px 0">${consultation}</td></tr><tr><td style="padding:8px 0">${mode} · ${date} · ${time}</td></tr><tr><td style="padding:8px 0">Reference: ${databaseResult.status === 'saved' ? databaseResult.referenceCode ?? 'pending' : 'pending'}</td></tr></table><p style="margin-top:36px;color:rgba(255,255,255,.42);font-size:12px">Casa Bernocchi · Segreteria Generale</p></div></body></html>`
    const patientConfirmation = await sendEmail({
      to: email,
      replyTo: SEGRETERIA_RECIPIENT,
      subject: confirmationCopy.subject,
      text: patientText,
      html: patientHtml,
    })
    if (patientConfirmation.status === 'error') console.error('[Casa Bernocchi] Patient confirmation failed:', patientConfirmation.detail)
  }

  return NextResponse.json({
    ok: true,
    referenceCode: databaseResult.status === 'saved' ? databaseResult.referenceCode : undefined,
    paymentToken: paymentAvailable ? paymentOrder?.public_token : undefined,
    paymentMethod: paymentAvailable ? 'online' : 'pending',
    paymentStatus: 'pending',
  }, { status: 200 })
}
