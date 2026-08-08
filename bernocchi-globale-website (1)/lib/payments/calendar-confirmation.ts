import 'server-only'

import { createSign } from 'node:crypto'
import { normalizePrivateKey, resolveCalendarId } from '@/lib/google-calendar'

const base64url = (input: string) => Buffer.from(input).toString('base64url')

async function accessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !rawKey) throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED')

  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64url(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))}`
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  const assertion = `${unsigned}.${signer.sign(normalizePrivateKey(rawKey), 'base64url')}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  })
  const body = await response.json().catch(() => null) as { access_token?: string } | null
  if (!response.ok || !body?.access_token) throw new Error(`GOOGLE_CALENDAR_AUTH_FAILED:${response.status}`)
  return body.access_token
}

export async function confirmPaidCalendarReservation(input: {
  eventId: string
  consultation: string
  referenceCode: string
  patientName: string
  patientEmail: string
  mode: string
  provider: 'paypal' | 'onvo'
  transactionId: string
}) {
  const calendarId = resolveCalendarId('ordo_medicinae')
  if (!calendarId) throw new Error('GOOGLE_CALENDAR_ID_MISSING')

  const token = await accessToken()
  const eventUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(input.eventId)}`
  const existingResponse = await fetch(eventUrl, {
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const existing = await existingResponse.json().catch(() => null) as {
    extendedProperties?: { private?: Record<string, string> }
  } | null
  if (!existingResponse.ok) throw new Error(`GOOGLE_CALENDAR_EVENT_READ_FAILED:${existingResponse.status}`)

  const scopeLabel = 'Ordo Medicinae · Bernocchi Health'
  const response = await fetch(eventUrl, {
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      summary: `CONFIRMADO — ${scopeLabel} — ${input.consultation}`,
      description: [
        `Referencia: ${input.referenceCode}`,
        `Paciente: ${input.patientName}`,
        `Correo: ${input.patientEmail}`,
        `Modalidad: ${input.mode === 'in-person' ? 'presencial' : 'online'}`,
        `Unidad: ${scopeLabel}`,
        `Estado: cita confirmada · pago conciliado (${input.provider === 'paypal' ? 'PayPal' : 'ONVO'})`,
        `Transacción: ${input.transactionId}`,
        'Origen: bernocchiglobale.it',
        '',
        'No se recopiló información clínica mediante el sitio web.',
      ].join('\n'),
      extendedProperties: {
        private: {
          ...(existing?.extendedProperties?.private ?? {}),
          bookingStatus: 'confirmed',
          holdExpiresAt: '',
          paymentProvider: input.provider,
          paymentTransactionId: input.transactionId,
        },
      },
    }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`GOOGLE_CALENDAR_EVENT_CONFIRM_FAILED:${response.status}`)
}
