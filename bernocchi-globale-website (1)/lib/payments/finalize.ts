import 'server-only'

import { sendEmail, SEGRETERIA_RECIPIENT } from '@/lib/email'
import { supabaseRequest } from '@/lib/supabase-rest'
import type { PaymentOrder } from './orders'
import { confirmPaidCalendarReservation } from './calendar-confirmation'

type PaidBooking = {
  id: string
  consultation: string
  consultation_id: string
  mode: string
  language: string
  patient_name: string
  patient_email: string
  start_at: string
  end_at: string
  reference_code: string
  google_event_id: string | null
  confirmation_email_sent_at: string | null
  payment_status: string
}

type Provider = 'paypal' | 'onvo'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function languageOf(value: string) {
  return value === 'it' ? 'it' : value === 'en' ? 'en' : 'es'
}

const copy = {
  es: {
    locale: 'es-CR',
    subject: (ref: string) => `Cita confirmada — Casa Bernocchi · ${ref}`,
    eyebrow: 'Conferma definitiva · Bernocchi Health',
    title: 'Su cita ha quedado confirmada',
    greeting: (name: string) => `Estimado/a ${name},`,
    intro: 'Hemos recibido y conciliado correctamente su pago. La reserva ha pasado a estado confirmado y el horario queda registrado en el calendario institucional de Bernocchi Health.',
    consultation: 'Consulta',
    mode: 'Modalidad',
    date: 'Fecha',
    time: 'Hora',
    reference: 'Referencia',
    payment: 'Pago confirmado',
    provider: 'Proveedor',
    transaction: 'Transacción',
    amount: 'Importe',
    online: 'Online',
    inPerson: 'Presencial',
    notice: 'Conserve esta comunicación como constancia de la confirmación de su cita. Para cualquier ajuste o aclaración, responda directamente a este correo.',
    regards: 'Con nuestra más alta consideración',
  },
  it: {
    locale: 'it-IT',
    subject: (ref: string) => `Appuntamento confermato — Casa Bernocchi · ${ref}`,
    eyebrow: 'Conferma definitiva · Bernocchi Health',
    title: 'Il Suo appuntamento è confermato',
    greeting: (name: string) => `Gentile ${name},`,
    intro: 'Il pagamento è stato ricevuto e riconciliato correttamente. La prenotazione è ora confermata e l’orario risulta registrato nel calendario istituzionale di Bernocchi Health.',
    consultation: 'Consulenza',
    mode: 'Modalità',
    date: 'Data',
    time: 'Ora',
    reference: 'Riferimento',
    payment: 'Pagamento confermato',
    provider: 'Fornitore',
    transaction: 'Transazione',
    amount: 'Importo',
    online: 'Online',
    inPerson: 'In presenza',
    notice: 'Conservi questa comunicazione quale conferma dell’appuntamento. Per qualsiasi modifica o chiarimento, può rispondere direttamente a questa email.',
    regards: 'Con la nostra più alta considerazione',
  },
  en: {
    locale: 'en-GB',
    subject: (ref: string) => `Appointment confirmed — Casa Bernocchi · ${ref}`,
    eyebrow: 'Final confirmation · Bernocchi Health',
    title: 'Your appointment is confirmed',
    greeting: (name: string) => `Dear ${name},`,
    intro: 'Your payment has been received and reconciled successfully. The reservation is now confirmed and the time is registered in the Bernocchi Health institutional calendar.',
    consultation: 'Consultation',
    mode: 'Mode',
    date: 'Date',
    time: 'Time',
    reference: 'Reference',
    payment: 'Payment confirmed',
    provider: 'Provider',
    transaction: 'Transaction',
    amount: 'Amount',
    online: 'Online',
    inPerson: 'In person',
    notice: 'Please retain this communication as confirmation of your appointment. For any adjustment or clarification, reply directly to this email.',
    regards: 'With our highest consideration',
  },
} as const

async function getBooking(id: string) {
  const fields = [
    'id', 'consultation', 'consultation_id', 'mode', 'language', 'patient_name',
    'patient_email', 'start_at', 'end_at', 'reference_code', 'google_event_id',
    'confirmation_email_sent_at', 'payment_status',
  ].join(',')
  const { data } = await supabaseRequest<PaidBooking[]>(
    `booking_reservations?id=eq.${encodeURIComponent(id)}&select=${fields}&limit=1`,
  )
  return data[0]
}

async function claimConfirmation(id: string) {
  const claimedAt = new Date().toISOString()
  const { data } = await supabaseRequest<PaidBooking[]>(
    `booking_reservations?id=eq.${encodeURIComponent(id)}&payment_status=eq.paid&confirmation_email_sent_at=is.null`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        confirmation_email_sent_at: claimedAt,
        updated_at: claimedAt,
      }),
    },
  )
  return data[0] ? { booking: data[0], claimedAt } : undefined
}

async function releaseConfirmation(id: string, claimedAt: string) {
  await supabaseRequest(
    `booking_reservations?id=eq.${encodeURIComponent(id)}&confirmation_email_sent_at=eq.${encodeURIComponent(claimedAt)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ confirmation_email_sent_at: null, updated_at: new Date().toISOString() }),
    },
  )
}

function money(order: PaymentOrder, language: 'es' | 'it' | 'en') {
  const amountMinor = order.provider_amount_minor ?? order.amount_minor
  const currency = order.provider_currency ?? order.currency
  return new Intl.NumberFormat(copy[language].locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100)
}

function dateParts(booking: PaidBooking, language: 'es' | 'it' | 'en') {
  const locale = copy[language].locale
  const start = new Date(booking.start_at)
  return {
    date: new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeZone: 'America/Costa_Rica',
    }).format(start),
    time: new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Costa_Rica',
      timeZoneName: 'short',
    }).format(start),
  }
}

function renderPremiumConfirmation(input: {
  booking: PaidBooking
  order: PaymentOrder
  provider: Provider
  transactionId: string
}) {
  const language = languageOf(input.booking.language)
  const c = copy[language]
  const when = dateParts(input.booking, language)
  const amount = money(input.order, language)
  const providerName = input.provider === 'paypal' ? 'PayPal' : 'ONVO'
  const mode = input.booking.mode === 'in-person' ? c.inPerson : c.online
  const logo = 'https://bernocchiglobale.it/images/casa-bernocchi-logo.jpeg'

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #e4dccd;color:#92733b;font:700 10px Arial,sans-serif;letter-spacing:1.2px;text-transform:uppercase;width:34%">${escapeHtml(label)}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #e4dccd;color:#172235;font:14px Georgia,serif;line-height:1.55">${escapeHtml(value)}</td>
    </tr>`

  const html = `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(c.subject(input.booking.reference_code))}</title></head>
  <body style="margin:0;background:#eee9df;padding:0">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eee9df"><tr><td align="center" style="padding:34px 12px">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px;max-width:600px;background:#fffdf9;border:1px solid #d8cebd;border-radius:7px;overflow:hidden;box-shadow:0 14px 38px rgba(8,16,28,.13)">
        <tr><td align="center" style="padding:34px 42px 30px;background:#07131f;border-bottom:3px solid #b9964a">
          <img src="${logo}" width="82" height="82" alt="Casa Bernocchi" style="display:block;width:82px;height:82px;border-radius:50%;object-fit:cover">
          <div style="margin-top:16px;color:#f3efe5;font:29px Georgia,serif">Casa Bernocchi</div>
          <div style="margin-top:7px;color:#c6a45d;font:700 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase">Segreteria Generale</div>
        </td></tr>
        <tr><td style="padding:40px 46px 38px">
          <div style="color:#9b7b40;font:700 10px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase">${escapeHtml(c.eyebrow)}</div>
          <h1 style="margin:10px 0 18px;color:#142034;font:400 32px Georgia,serif;line-height:1.25">${escapeHtml(c.title)}</h1>
          <p style="margin:0 0 12px;color:#28313e;font:17px Georgia,serif;line-height:1.7">${escapeHtml(c.greeting(input.booking.patient_name))}</p>
          <p style="margin:0;color:#414853;font:14px Georgia,serif;line-height:1.8">${escapeHtml(c.intro)}</p>

          <div style="margin:26px 0 22px;padding:18px 20px;background:#edf5ef;border:1px solid #b8d2bf;border-left:4px solid #3d7d50">
            <div style="color:#2f6c43;font:700 10px Arial,sans-serif;letter-spacing:1.7px;text-transform:uppercase">${escapeHtml(c.payment)}</div>
            <div style="margin-top:7px;color:#173224;font:400 25px Georgia,serif">${escapeHtml(amount)}</div>
          </div>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border:1px solid #d9cebb;border-collapse:collapse;background:#faf7f0">
            ${row(c.consultation, input.booking.consultation)}
            ${row(c.mode, mode)}
            ${row(c.date, when.date)}
            ${row(c.time, when.time)}
            ${row(c.reference, input.booking.reference_code)}
            ${row(c.provider, providerName)}
            ${row(c.transaction, input.transactionId)}
          </table>

          <div style="margin-top:25px;padding:18px 20px;background:#f7f2e8;border:1px solid #ddcfb5;border-left:3px solid #b9964a;color:#4e4b45;font:13px Arial,sans-serif;line-height:1.75">${escapeHtml(c.notice)}</div>

          <div style="margin-top:30px;padding-top:22px;border-top:1px solid #ded4c3;color:#736e65;font:10px Arial,sans-serif;letter-spacing:1.1px;text-transform:uppercase">${escapeHtml(c.regards)}</div>
          <div style="margin-top:7px;color:#172235;font:20px Georgia,serif">Segreteria Generale</div>
          <div style="margin-top:3px;color:#777168;font:12px Arial,sans-serif;line-height:1.6">Casa Bernocchi · Bernocchi Globale Holdings</div>
        </td></tr>
        <tr><td align="center" style="padding:24px 38px;background:#07131f;color:#b1bac5;font:11px Arial,sans-serif;line-height:1.7">
          <div style="color:#d0ad65;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">Conoscenza · Onore · Disciplina · Eredità</div>
          <div style="margin-top:9px">segreteria@bernocchiglobale.it · bernocchiglobale.it</div>
          <div style="margin-top:13px;color:#76808e;font-size:9px">Confirmación transaccional emitida tras conciliación del pago. No constituye factura fiscal.</div>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`

  const text = [
    c.title,
    '',
    c.greeting(input.booking.patient_name),
    c.intro,
    '',
    `${c.consultation}: ${input.booking.consultation}`,
    `${c.mode}: ${mode}`,
    `${c.date}: ${when.date}`,
    `${c.time}: ${when.time}`,
    `${c.reference}: ${input.booking.reference_code}`,
    `${c.amount}: ${amount}`,
    `${c.provider}: ${providerName}`,
    `${c.transaction}: ${input.transactionId}`,
    '',
    c.notice,
    '',
    c.regards,
    'Segreteria Generale',
    'Casa Bernocchi',
  ].join('\n')

  return { subject: c.subject(input.booking.reference_code), text, html, amount, providerName }
}

export async function finalizePaidReservation(input: {
  order: PaymentOrder
  provider: Provider
  transactionId: string
}) {
  const booking = await getBooking(input.order.booking_reservation_id)
  if (!booking) throw new Error('BOOKING_NOT_FOUND_FOR_PAYMENT')
  if (booking.payment_status !== 'paid') throw new Error('BOOKING_PAYMENT_NOT_PAID')

  if (booking.google_event_id) {
    try {
      await confirmPaidCalendarReservation({
        eventId: booking.google_event_id,
        consultation: booking.consultation,
        referenceCode: booking.reference_code,
        patientName: booking.patient_name,
        patientEmail: booking.patient_email,
        mode: booking.mode,
        provider: input.provider,
        transactionId: input.transactionId,
      })
    } catch (error) {
      console.error('[Casa Bernocchi] Paid reservation calendar confirmation failed:', error)
    }
  }

  const claim = await claimConfirmation(booking.id)
  if (!claim) return { status: 'already_sent' as const }

  const message = renderPremiumConfirmation({
    booking: claim.booking,
    order: input.order,
    provider: input.provider,
    transactionId: input.transactionId,
  })

  const patientResult = await sendEmail({
    to: claim.booking.patient_email,
    replyTo: SEGRETERIA_RECIPIENT,
    subject: message.subject,
    text: message.text,
    html: message.html,
  })

  if (patientResult.status !== 'sent') {
    await releaseConfirmation(claim.booking.id, claim.claimedAt).catch(() => undefined)
    const detail = patientResult.status === 'error' ? patientResult.detail : 'email delivery unavailable'
    console.error('[Casa Bernocchi] Final payment confirmation email failed:', detail)
    return { status: 'email_failed' as const }
  }

  const internal = await sendEmail({
    to: SEGRETERIA_RECIPIENT,
    replyTo: claim.booking.patient_email,
    subject: `Cita confirmada y pagada — ${claim.booking.reference_code}`,
    text: [
      'Confirmación definitiva emitida.',
      `Reserva: ${claim.booking.reference_code}`,
      `Paciente: ${claim.booking.patient_name}`,
      `Consulta: ${claim.booking.consultation}`,
      `Importe: ${message.amount}`,
      `Proveedor: ${message.providerName}`,
      `Transacción: ${input.transactionId}`,
    ].join('\n'),
  })
  if (internal.status === 'error') {
    console.error('[Casa Bernocchi] Internal paid-booking notice failed:', internal.detail)
  }

  return { status: 'sent' as const }
}
