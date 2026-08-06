import test from 'node:test'
import assert from 'node:assert/strict'
import { consultationDuration, costaRicaDateTime, isExpiredHold, overlaps, slotId } from '../lib/booking.ts'
import { createAdminToken, verifyAdminToken } from '../lib/admin-token.ts'
import { eventBlocksSlot, normalizePrivateKey } from '../lib/google-calendar.ts'
import { detectLocale } from '../lib/i18n.ts'

test('language detection prioritises cookie, browser and fallback', () => {
  assert.equal(detectLocale('it', 'es-CR'), 'it'); assert.equal(detectLocale(null, 'es-CR,es;q=0.9'), 'es'); assert.equal(detectLocale(null, 'fr-FR'), 'en')
})

test('consultation duration comes from canonical catalogue', () => {
  assert.equal(consultationDuration('couples-therapy'), 60)
  assert.equal(consultationDuration('unknown'), null)
})
test('overlap and occupied slot detection', () => {
  const start = costaRicaDateTime('2030-01-01', '10:00'); const end = new Date(start.valueOf() + 60 * 60_000)
  assert.equal(overlaps(start, end, new Date(start.valueOf() - 1), new Date(start.valueOf() + 1)), true)
  assert.equal(eventBlocksSlot({ start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } }, start, end), true)
})
test('expired provisional holds do not expose or block availability', () => {
  const start = new Date('2030-01-01T16:00:00Z'); const end = new Date('2030-01-01T17:00:00Z')
  const privateProperties = { bookingStatus: 'pending_deposit', holdExpiresAt: '2029-01-01T00:00:00Z', patientEmail: 'private@example.test' }
  assert.equal(isExpiredHold(privateProperties, new Date('2029-02-01')), true)
  assert.equal(eventBlocksSlot({ start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() }, extendedProperties: { private: privateProperties } }, start, end, new Date('2029-02-01')), false)
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
