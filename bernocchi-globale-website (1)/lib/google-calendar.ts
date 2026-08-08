import { createSign } from 'node:crypto'

export type CalendarEvent = {
  id?: string
  summary?: string
  status?: string
  transparency?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
  extendedProperties?: { private?: Record<string, string> }
}

export class CalendarUnavailableError extends Error {}
export class CalendarConflictError extends Error {}

export function normalizePrivateKey(value: string) {
  return value.replace(/^['"]|['"]$/g, '').replaceAll('\\n', '\n')
}

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env.GOOGLE_CALENDAR_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  )
}

function config() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!calendarId || !email || !key) {
    throw new CalendarUnavailableError('Google Calendar is not configured.')
  }
  return { calendarId, email, key: normalizePrivateKey(key) }
}

const base64url = (input: string) => Buffer.from(input).toString('base64url')
let cachedToken: { value: string; expiresAt: number } | undefined

async function accessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

  const { email, key } = config()
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
  const assertion = `${unsigned}.${signer.sign(key, 'base64url')}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  })
  if (!response.ok) throw new CalendarUnavailableError('Google Calendar authentication failed.')

  const result = await response.json() as { access_token?: string; expires_in?: number }
  if (!result.access_token) throw new CalendarUnavailableError('Google Calendar did not return an access token.')

  cachedToken = {
    value: result.access_token,
    expiresAt: Date.now() + (result.expires_in ?? 3600) * 1000,
  }
  return result.access_token
}

async function calendarApi(path: string, init?: RequestInit) {
  const { calendarId } = config()
  const token = await accessToken()
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}${path}`,
    {
      ...init,
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        ...init?.headers,
      },
      cache: 'no-store',
    },
  )
  if (!response.ok) {
    throw new CalendarUnavailableError(`Google Calendar request failed (${response.status}).`)
  }
  return response.status === 204 ? null : response.json()
}

function overlaps(start: Date, end: Date, otherStart: Date, otherEnd: Date) {
  return start < otherEnd && end > otherStart
}

function isExpiredPendingHold(event: CalendarEvent, now = new Date()) {
  const properties = event.extendedProperties?.private
  return properties?.bookingStatus === 'pending_deposit' &&
    Boolean(properties.holdExpiresAt) &&
    new Date(properties!.holdExpiresAt) <= now
}

export async function listEvents(startAt: string, endAt: string): Promise<CalendarEvent[]> {
  const query = new URLSearchParams({
    timeMin: startAt,
    timeMax: endAt,
    singleEvents: 'true',
    showDeleted: 'false',
    maxResults: '250',
  })
  const result = await calendarApi(`/events?${query}`) as { items?: CalendarEvent[] }
  return result.items ?? []
}

export async function assertCalendarAvailable(startAt: string, endAt: string) {
  const requestedStart = new Date(startAt)
  const requestedEnd = new Date(endAt)
  const events = await listEvents(startAt, endAt)
  const now = new Date()

  const expiredHolds = events.filter((event) => event.id && isExpiredPendingHold(event, now))
  await Promise.allSettled(expiredHolds.map((event) => deleteCalendarEvent(event.id!)))

  const conflict = events.some((event) => {
    if (isExpiredPendingHold(event, now)) return false
    if (event.status === 'cancelled' || event.transparency === 'transparent') return false
    if (!event.start?.dateTime || !event.end?.dateTime) return true
    return overlaps(
      requestedStart,
      requestedEnd,
      new Date(event.start.dateTime),
      new Date(event.end.dateTime),
    )
  })

  if (conflict) throw new CalendarConflictError('The selected interval is occupied in Google Calendar.')
}

export async function createPendingCalendarEvent(input: {
  reservationId: string
  referenceCode?: string
  consultation: string
  consultationId: string
  mode: string
  language: string
  patientName: string
  patientEmail: string
  patientWhatsapp: string
  startAt: string
  endAt: string
  holdExpiresAt: string
}) {
  const resource = {
    summary: `PENDIENTE DE CONFIRMACIÓN — Bernocchi Health — ${input.consultation}`,
    description: [
      `Referencia: ${input.referenceCode ?? 'pendiente'}`,
      `Paciente: ${input.patientName}`,
      `Correo: ${input.patientEmail}`,
      `WhatsApp: ${input.patientWhatsapp}`,
      `Modalidad: ${input.mode === 'in-person' ? 'presencial' : 'online'}`,
      'Estado: pago y confirmación pendientes',
      'Origen: bernocchiglobale.it',
      '',
      'No se recopiló información clínica mediante el sitio web.',
    ].join('\n'),
    start: { dateTime: input.startAt, timeZone: 'America/Costa_Rica' },
    end: { dateTime: input.endAt, timeZone: 'America/Costa_Rica' },
    visibility: 'private',
    transparency: 'opaque',
    extendedProperties: {
      private: {
        bookingId: input.reservationId,
        bookingStatus: 'pending_deposit',
        holdExpiresAt: input.holdExpiresAt,
        referenceCode: input.referenceCode ?? '',
        consultationId: input.consultationId,
        mode: input.mode,
        language: input.language,
      },
    },
  }

  const created = await calendarApi('/events', {
    method: 'POST',
    body: JSON.stringify(resource),
  }) as CalendarEvent

  if (!created.id) throw new CalendarUnavailableError('Google Calendar did not return an event id.')
  return created.id
}

export async function deleteCalendarEvent(eventId: string) {
  await calendarApi(`/events/${encodeURIComponent(eventId)}`, { method: 'DELETE' })
}
