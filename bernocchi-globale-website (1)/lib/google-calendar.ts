import { createSign } from 'node:crypto'

export const CASA_BERNOCCHI_CALENDAR_SCOPES = {
  casa_bernocchi: 'Casa Bernocchi',
  general_secretariat: 'Segreteria Generale',
  segreteria_generale: 'Segreteria Generale',
  office_of_founder: 'Ufficio del Fondatore',
  health: 'Bernocchi Health',
  legal: 'Bernocchi Legal',
  technology: 'Bernocchi Technology',
  business_services: 'Bernocchi Business Services',
  ordo_medicinae: 'Ordo Medicinae · Bernocchi Health',
  ordo_iuris: 'Ordo Iuris',
  ordo_scientia: 'Ordo Scientia',
  ordo_capitalis: 'Ordo Capitalis',
  ordo_innovatio: 'Ordo Innovatio',
  ordo_humanitatis: 'Ordo Humanitatis',
} as const

export type CalendarScope = keyof typeof CASA_BERNOCCHI_CALENDAR_SCOPES

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
  return value.replace(/^['\"]|['\"]$/g, '').replaceAll('\\n', '\n')
}

function calendarMap(): Partial<Record<CalendarScope, string>> {
  const raw = process.env.GOOGLE_CALENDAR_MAP_JSON
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const result: Partial<Record<CalendarScope, string>> = {}
    for (const scope of Object.keys(CASA_BERNOCCHI_CALENDAR_SCOPES) as CalendarScope[]) {
      const value = parsed[scope]
      if (typeof value === 'string' && value.trim()) result[scope] = value.trim()
    }
    return result
  } catch {
    throw new CalendarUnavailableError('GOOGLE_CALENDAR_MAP_JSON is invalid JSON.')
  }
}

export function resolveCalendarId(scope: CalendarScope = 'ordo_medicinae') {
  return calendarMap()[scope] || process.env.GOOGLE_CALENDAR_ID || ''
}

export function isGoogleCalendarConfigured(scope: CalendarScope = 'ordo_medicinae') {
  return Boolean(
    resolveCalendarId(scope) &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  )
}

function config(scope: CalendarScope = 'ordo_medicinae') {
  const calendarId = resolveCalendarId(scope)
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!calendarId || !email || !key) {
    throw new CalendarUnavailableError(`Google Calendar is not configured for ${scope}.`)
  }
  return { calendarId, email, key: normalizePrivateKey(key) }
}

const base64url = (input: string) => Buffer.from(input).toString('base64url')
let cachedToken: { value: string; expiresAt: number } | undefined

async function accessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !rawKey) throw new CalendarUnavailableError('Google Calendar service account is not configured.')
  const key = normalizePrivateKey(rawKey)
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

async function calendarApi(path: string, init?: RequestInit, scope: CalendarScope = 'ordo_medicinae') {
  const { calendarId } = config(scope)
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
    throw new CalendarUnavailableError(`Google Calendar request failed (${response.status}) for ${scope}.`)
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

export async function listEvents(startAt: string, endAt: string, scope: CalendarScope = 'ordo_medicinae'): Promise<CalendarEvent[]> {
  const query = new URLSearchParams({
    timeMin: startAt,
    timeMax: endAt,
    singleEvents: 'true',
    showDeleted: 'false',
    maxResults: '250',
  })
  const result = await calendarApi(`/events?${query}`, undefined, scope) as { items?: CalendarEvent[] }
  return result.items ?? []
}

export async function deleteCalendarEvent(eventId: string, scope: CalendarScope = 'ordo_medicinae') {
  await calendarApi(`/events/${encodeURIComponent(eventId)}`, { method: 'DELETE' }, scope)
}

export async function assertCalendarAvailable(startAt: string, endAt: string, scope: CalendarScope = 'ordo_medicinae') {
  const requestedStart = new Date(startAt)
  const requestedEnd = new Date(endAt)
  const events = await listEvents(startAt, endAt, scope)
  const now = new Date()

  const expiredHolds = events.filter((event) => event.id && isExpiredPendingHold(event, now))
  await Promise.allSettled(expiredHolds.map((event) => deleteCalendarEvent(event.id!, scope)))

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

  if (conflict) throw new CalendarConflictError(`The selected interval is occupied in ${scope}.`)
}

export async function createCasaBernocchiEvent(input: {
  calendarScope: CalendarScope
  summary: string
  description?: string
  startAt: string
  endAt: string
  visibility?: 'private' | 'default'
  transparency?: 'opaque' | 'transparent'
  extendedProperties?: Record<string, string>
}) {
  const resource = {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.startAt, timeZone: 'America/Costa_Rica' },
    end: { dateTime: input.endAt, timeZone: 'America/Costa_Rica' },
    visibility: input.visibility ?? 'private',
    transparency: input.transparency ?? 'opaque',
    extendedProperties: {
      private: {
        casaBernocchiScope: input.calendarScope,
        ...input.extendedProperties,
      },
    },
  }

  const created = await calendarApi('/events', {
    method: 'POST',
    body: JSON.stringify(resource),
  }, input.calendarScope) as CalendarEvent

  if (!created.id) throw new CalendarUnavailableError('Google Calendar did not return an event id.')
  return created.id
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
  calendarScope?: CalendarScope
}) {
  const calendarScope = input.calendarScope ?? 'ordo_medicinae'
  const scopeLabel = CASA_BERNOCCHI_CALENDAR_SCOPES[calendarScope]
  return createCasaBernocchiEvent({
    calendarScope,
    summary: `PENDIENTE DE CONFIRMACIÓN — ${scopeLabel} — ${input.consultation}`,
    description: [
      `Referencia: ${input.referenceCode ?? 'pendiente'}`,
      `Paciente: ${input.patientName}`,
      `Correo: ${input.patientEmail}`,
      `WhatsApp: ${input.patientWhatsapp}`,
      `Modalidad: ${input.mode === 'in-person' ? 'presencial' : 'online'}`,
      `Unidad: ${scopeLabel}`,
      'Estado: pago y confirmación pendientes',
      'Origen: bernocchiglobale.it',
      '',
      'No se recopiló información clínica mediante el sitio web.',
    ].join('\n'),
    startAt: input.startAt,
    endAt: input.endAt,
    extendedProperties: {
      bookingId: input.reservationId,
      bookingStatus: 'pending_deposit',
      holdExpiresAt: input.holdExpiresAt,
      referenceCode: input.referenceCode ?? '',
      consultationId: input.consultationId,
      mode: input.mode,
      language: input.language,
    },
  })
}
