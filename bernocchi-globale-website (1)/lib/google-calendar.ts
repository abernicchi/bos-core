import { createSign } from 'node:crypto'
import { CALENDAR_TIMEZONE, isExpiredHold, overlaps, slotId } from './booking.ts'

export type CalendarEvent = {
  id?: string; summary?: string; description?: string; status?: string
  start?: { dateTime?: string }; end?: { dateTime?: string }
  extendedProperties?: { private?: Record<string, string> }
  hangoutLink?: string
}

export class CalendarUnavailableError extends Error {}
export class CalendarConflictError extends Error {}
export class HoldExpiredError extends Error {}

export function normalizePrivateKey(value: string) {
  return value.replace(/^['"]|['"]$/g, '').replaceAll('\\n', '\n')
}

function config() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!calendarId || !email || !key) throw new CalendarUnavailableError('Calendar is not configured')
  return { calendarId, email, key: normalizePrivateKey(key) }
}

const b64 = (input: string) => Buffer.from(input).toString('base64url')
let cachedToken: { value: string; expires: number } | undefined

async function accessToken() {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value
  const { email, key } = config(); const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64(JSON.stringify({ iss: email, scope: 'https://www.googleapis.com/auth/calendar', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }))}`
  const signer = createSign('RSA-SHA256'); signer.update(unsigned)
  const assertion = `${unsigned}.${signer.sign(key, 'base64url')}`
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) })
  if (!response.ok) throw new CalendarUnavailableError('Calendar authentication failed')
  const result = await response.json() as { access_token: string; expires_in: number }
  cachedToken = { value: result.access_token, expires: Date.now() + result.expires_in * 1000 }
  return result.access_token
}

async function api(path: string, init?: RequestInit) {
  const { calendarId } = config(); const token = await accessToken()
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}${path}`, { ...init, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...init?.headers } })
  if (response.status === 409) throw new CalendarConflictError('Slot conflict')
  if (!response.ok) throw new CalendarUnavailableError(`Calendar request failed (${response.status})`)
  return response.status === 204 ? null : response.json()
}

export async function listEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
  const query = new URLSearchParams({ timeMin: start.toISOString(), timeMax: end.toISOString(), singleEvents: 'true', showDeleted: 'false', maxResults: '2500' })
  const data = await api(`/events?${query}`) as { items?: CalendarEvent[] }
  return data.items ?? []
}

export function eventBlocksSlot(event: CalendarEvent, start: Date, end: Date, now = new Date()) {
  if (event.extendedProperties?.private?.bookingMutex === 'true') return false
  if (event.status === 'cancelled' || isExpiredHold(event.extendedProperties?.private, now)) return false
  if (!event.start?.dateTime || !event.end?.dateTime) return true
  return overlaps(start, end, new Date(event.start.dateTime), new Date(event.end.dateTime))
}

/**
 * A short-lived, Calendar-backed mutex serialises the read/create transaction
 * across serverless instances. One lock per day intentionally protects
 * intervals of different lengths. Google event-id uniqueness is the atomic
 * compare-and-set operation; stale locks are reclaimed once their TTL elapses.
 */
export async function acquireBookingMutex(date: string, now = new Date()): Promise<string> {
  const id = `bhmutex${date.replaceAll('-', '')}`
  const resource = {
    id, summary: 'BLOQUEO TEMPORAL DE RESERVAS — Bernocchi Health',
    start: { dateTime: `${date}T00:00:00-06:00` }, end: { dateTime: `${date}T23:59:59-06:00` },
    visibility: 'private', transparency: 'transparent',
    extendedProperties: { private: { bookingMutex: 'true', lockExpiresAt: new Date(now.valueOf() + 20_000).toISOString() } },
  }
  try { await api('/events', { method: 'POST', body: JSON.stringify(resource) }); return id } catch (error) {
    if (!(error instanceof CalendarConflictError)) throw error
    const existing = await getEvent(id)
    if (isExpiredBookingMutex(existing, now)) { await deleteEvent(id); await api('/events', { method: 'POST', body: JSON.stringify(resource) }); return id }
    throw new CalendarConflictError('Booking transaction already in progress')
  }
}

export function isExpiredBookingMutex(event: CalendarEvent, now = new Date()) {
  const expires = event.extendedProperties?.private?.lockExpiresAt
  return event.extendedProperties?.private?.bookingMutex === 'true' && Boolean(expires) && new Date(expires!) <= now
}

export async function releaseBookingMutex(id: string) {
  try { await deleteEvent(id) } catch (error) { if (!(error instanceof CalendarUnavailableError)) throw error }
}

export async function removeExpired(events: CalendarEvent[], now = new Date()) {
  await Promise.allSettled(events.filter((e) => e.id && isExpiredHold(e.extendedProperties?.private, now)).map((e) => deleteEvent(e.id!)))
}

export async function createPending(input: { date: string; time: string; duration: number; consultation: string; consultationId: string; patientName: string; patientEmail: string; patientWhatsapp: string; language: string; mode: string }) {
  const start = new Date(`${input.date}T${input.time}:00-06:00`); const end = new Date(start.valueOf() + input.duration * 60_000)
  const holdExpiresAt = new Date(Date.now() + 30 * 60_000).toISOString()
  const id = slotId(input.date, input.time, input.duration)
  const resource: CalendarEvent & { visibility: string; transparency: string } = {
    id, summary: `PENDIENTE DE DEPÓSITO — Bernocchi Health — ${input.consultation}`,
    description: `Contacto de reserva: ${input.patientName} | ${input.patientEmail} | ${input.patientWhatsapp}`,
    start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() }, visibility: 'private', transparency: 'opaque',
    extendedProperties: { private: { bookingStatus: 'pending_deposit', holdExpiresAt, patientEmail: input.patientEmail, patientName: input.patientName, patientWhatsapp: input.patientWhatsapp, consultation: input.consultation, consultationId: input.consultationId, language: input.language, mode: input.mode } },
  }
  await api('/events', { method: 'POST', body: JSON.stringify(resource) }); return { id, holdExpiresAt }
}

export const getEvent = (id: string) => api(`/events/${encodeURIComponent(id)}`) as Promise<CalendarEvent>
export const deleteEvent = (id: string) => api(`/events/${encodeURIComponent(id)}`, { method: 'DELETE' })

export async function confirmEvent(event: CalendarEvent) {
  if (!event.id) throw new CalendarUnavailableError('Missing event')
  const p = event.extendedProperties?.private ?? {}
  if (p.bookingStatus === 'confirmed') return event
  assertConfirmableHold(event)
  if (!event.start?.dateTime || !event.end?.dateTime) throw new CalendarConflictError('Missing event interval')
  const overlapping = await listEvents(new Date(event.start.dateTime), new Date(event.end.dateTime))
  if (overlapping.some((candidate) => candidate.id !== event.id && eventBlocksSlot(candidate, new Date(event.start!.dateTime!), new Date(event.end!.dateTime!)))) {
    throw new CalendarConflictError('The interval is no longer available')
  }
  const virtual = p.mode === 'online' || /virtual|online|línea/i.test(p.mode ?? '')
  const body = { ...event, summary: `CITA CONFIRMADA — Bernocchi Health — ${p.consultation ?? ''}`, attendees: p.patientEmail ? [{ email: p.patientEmail }] : undefined, extendedProperties: { private: { ...p, bookingStatus: 'confirmed', holdExpiresAt: undefined } }, ...(virtual ? { conferenceData: { createRequest: { requestId: `meet-${event.id}` } } } : {}) }
  return api(`/events/${encodeURIComponent(event.id)}?sendUpdates=all&conferenceDataVersion=1`, { method: 'PATCH', body: JSON.stringify(body) }) as Promise<CalendarEvent>
}

export function assertConfirmableHold(event: CalendarEvent, now = new Date()) {
  const properties = event.extendedProperties?.private ?? {}
  if (properties.bookingStatus !== 'pending_deposit') throw new CalendarConflictError('Booking is not pending')
  if (!properties.holdExpiresAt || new Date(properties.holdExpiresAt) <= now) throw new HoldExpiredError('Provisional hold expired')
}
