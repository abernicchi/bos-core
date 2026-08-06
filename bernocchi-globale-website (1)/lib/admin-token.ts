import { createHmac, timingSafeEqual } from 'node:crypto'

type Payload = { eventId: string; exp: number }
const secret = () => { if (!process.env.BOOKING_ADMIN_SECRET) throw new Error('Admin secret is not configured'); return process.env.BOOKING_ADMIN_SECRET }
export function createAdminToken(eventId: string, expiresAt: Date) {
  const payload = Buffer.from(JSON.stringify({ eventId, exp: expiresAt.valueOf() } satisfies Payload)).toString('base64url')
  return `${payload}.${createHmac('sha256', secret()).update(payload).digest('base64url')}`
}
export function verifyAdminToken(token: string, now = new Date()): Payload | null {
  const [payload, signature] = token.split('.'); if (!payload || !signature) return null
  const expected = createHmac('sha256', secret()).update(payload).digest()
  let actual: Buffer; try { actual = Buffer.from(signature, 'base64url') } catch { return null }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null
  try { const result = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Payload; return result.eventId && result.exp > now.valueOf() ? result : null } catch { return null }
}
