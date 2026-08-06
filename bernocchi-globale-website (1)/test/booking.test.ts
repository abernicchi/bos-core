import test from 'node:test'
import assert from 'node:assert/strict'
import { consultationDuration, costaRicaDateTime, isCanonicalBookingSelection, isExpiredHold, overlaps, slotId } from '../lib/booking.ts'
import { createAdminToken, verifyAdminToken } from '../lib/admin-token.ts'
import { assertConfirmableHold, eventBlocksSlot, HoldExpiredError, isExpiredBookingMutex, normalizePrivateKey } from '../lib/google-calendar.ts'
import { detectLocale } from '../lib/i18n.ts'
import { buildConfirmedAppointmentEmail, buildConfirmedAppointmentText, getConfirmedAppointmentSubject } from '../lib/email.ts'

test('language detection prioritises cookie, browser and fallback', () => {
  assert.equal(detectLocale('it', 'es-CR'), 'it'); assert.equal(detectLocale(null, 'es-CR,es;q=0.9'), 'es'); assert.equal(detectLocale(null, 'fr-FR'), 'en')
})

test('consultation duration comes from canonical catalogue', () => {
  assert.equal(consultationDuration('couples-therapy'), 60)
  assert.equal(consultationDuration('unknown'), null)
})
test('manipulated times, modes, languages and consultations are rejected', () => {
  assert.equal(isCanonicalBookingSelection('clinical-sexology', 'online', 'es', '09:00'), true)
  assert.equal(isCanonicalBookingSelection('clinical-sexology', 'online', 'es', '09:30'), false)
  assert.equal(isCanonicalBookingSelection('unknown', 'carrier-pigeon', 'xx', '03:00'), false)
})
test('overlap and occupied slot detection', () => {
  const start = costaRicaDateTime('2030-01-01', '10:00'); const end = new Date(start.valueOf() + 60 * 60_000)
  assert.equal(overlaps(start, end, new Date(start.valueOf() - 1), new Date(start.valueOf() + 1)), true)
  assert.equal(eventBlocksSlot({ start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } }, start, end), true)
})
test('different durations and staggered simultaneous requests overlap', () => {
  const nine = costaRicaDateTime('2030-01-01', '09:00')
  const nineThirty = new Date(nine.valueOf() + 30 * 60_000)
  assert.equal(overlaps(nine, new Date(nine.valueOf() + 50 * 60_000), nine, new Date(nine.valueOf() + 60 * 60_000)), true)
  assert.equal(overlaps(nine, new Date(nine.valueOf() + 60 * 60_000), nineThirty, new Date(nineThirty.valueOf() + 50 * 60_000)), true)
})
test('booking mutex has a recoverable expiry and never blocks availability', () => {
  const mutex = { extendedProperties: { private: { bookingMutex: 'true', lockExpiresAt: '2030-01-01T00:00:20Z' } } }
  assert.equal(isExpiredBookingMutex(mutex, new Date('2030-01-01T00:00:10Z')), false)
  assert.equal(isExpiredBookingMutex(mutex, new Date('2030-01-01T00:00:21Z')), true)
  assert.equal(eventBlocksSlot(mutex, new Date('2030-01-01'), new Date('2030-01-02')), false)
})
test('expired provisional holds do not expose or block availability', () => {
  const start = new Date('2030-01-01T16:00:00Z'); const end = new Date('2030-01-01T17:00:00Z')
  const privateProperties = { bookingStatus: 'pending_deposit', holdExpiresAt: '2029-01-01T00:00:00Z', patientEmail: 'private@example.test' }
  assert.equal(isExpiredHold(privateProperties, new Date('2029-02-01')), true)
  assert.equal(eventBlocksSlot({ start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() }, extendedProperties: { private: privateProperties } }, start, end, new Date('2029-02-01')), false)
})
test('current holds are confirmable and expired holds are rejected', () => {
  const current = { extendedProperties: { private: { bookingStatus: 'pending_deposit', holdExpiresAt: '2030-01-01T01:00:00Z' } } }
  assert.doesNotThrow(() => assertConfirmableHold(current, new Date('2030-01-01T00:00:00Z')))
  assert.throws(() => assertConfirmableHold(current, new Date('2030-01-01T02:00:00Z')), HoldExpiredError)
})
test('deterministic slot id and escaped private key normalization', () => {
  assert.equal(slotId('2030-01-01', '09:00', 50), slotId('2030-01-01', '09:00', 50))
  assert.equal(normalizePrivateKey('"line1\\nline2"'), 'line1\nline2')
})
test('HMAC token accepts valid payload and rejects alteration/expiry', () => {
  process.env.BOOKING_ADMIN_SECRET = 'test-only-secret-at-least-32-characters'
  const token = createAdminToken('event-id', new Date('2030-01-01'))
  assert.equal(verifyAdminToken(token, new Date('2029-01-01'))?.eventId, 'event-id')
  assert.equal(verifyAdminToken(`${token}x`, new Date('2029-01-01')), null)
  assert.equal(verifyAdminToken(token, new Date('2031-01-01')), null)
})
test('confirmed email is trilingual and includes Meet only when supplied', () => {
  const base = { fullName: 'Test', consultation: 'Consultation', mode: 'online', date: '1 January 2030', time: '09:00', language: 'es' }
  assert.match(getConfirmedAppointmentSubject('es'), /confirmada/i)
  assert.match(getConfirmedAppointmentSubject('en'), /confirmed/i)
  assert.match(getConfirmedAppointmentSubject('it'), /confermato/i)
  assert.doesNotMatch(buildConfirmedAppointmentEmail(base), /meet\.google\.com/)
  const withMeet = { ...base, meetUrl: 'https://meet.google.com/abc-defg-hij' }
  assert.match(buildConfirmedAppointmentEmail(withMeet), /meet\.google\.com\/abc-defg-hij/)
  assert.match(buildConfirmedAppointmentText(withMeet), /₡25\.000 CRC/)
})
