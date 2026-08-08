import { createSign } from 'node:crypto'
import { NextResponse } from 'next/server'

const base64url = (input: string) => Buffer.from(input).toString('base64url')
const normalizeKey = (value: string) => value.replace(/^['\"]|['\"]$/g, '').replaceAll('\\n', '\n')

function safeError(body: unknown) {
  if (!body || typeof body !== 'object') return null
  const root = body as Record<string, unknown>
  const raw = root.error
  if (!raw || typeof raw !== 'object') return null
  const e = raw as Record<string, unknown>
  const errors = Array.isArray(e.errors) ? e.errors : []
  const first = errors[0] && typeof errors[0] === 'object' ? errors[0] as Record<string, unknown> : null
  return {
    code: typeof e.code === 'number' ? e.code : undefined,
    message: typeof e.message === 'string' ? e.message.slice(0, 240) : undefined,
    reason: first && typeof first.reason === 'string' ? first.reason.slice(0, 120) : undefined,
  }
}

export async function GET() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!calendarId || !email || !rawKey) return NextResponse.json({ ok: false, stage: 'config' })

  try {
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
    const assertion = `${unsigned}.${signer.sign(normalizeKey(rawKey), 'base64url')}`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
      cache: 'no-store',
    })
    const tokenBody = await tokenRes.json().catch(() => null) as { access_token?: string } | null
    if (!tokenRes.ok || !tokenBody?.access_token) {
      return NextResponse.json({ ok: false, stage: 'auth', status: tokenRes.status, error: safeError(tokenBody) })
    }

    const token = tokenBody.access_token
    const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}`
    const start = new Date(Date.now() + 15 * 60_000)
    const end = new Date(start.getTime() + 5 * 60_000)

    const readRes = await fetch(`${base}/events?timeMin=${encodeURIComponent(start.toISOString())}&timeMax=${encodeURIComponent(end.toISOString())}&singleEvents=true&maxResults=1`, {
      headers: { authorization: `Bearer ${token}` }, cache: 'no-store',
    })
    const readBody = await readRes.json().catch(() => null)
    if (!readRes.ok) return NextResponse.json({ ok: false, stage: 'read', status: readRes.status, error: safeError(readBody) })

    const insertRes = await fetch(`${base}/events`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        summary: 'Casa Bernocchi · Calendar Core probe',
        description: 'Temporary service-account writer test; automatically deleted.',
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        transparency: 'transparent',
        visibility: 'private',
      }),
      cache: 'no-store',
    })
    const insertBody = await insertRes.json().catch(() => null) as { id?: string } | null
    if (!insertRes.ok || !insertBody?.id) {
      return NextResponse.json({ ok: false, stage: 'insert', status: insertRes.status, error: safeError(insertBody) })
    }

    const deleteRes = await fetch(`${base}/events/${encodeURIComponent(insertBody.id)}`, {
      method: 'DELETE', headers: { authorization: `Bearer ${token}` }, cache: 'no-store',
    })

    return NextResponse.json({
      ok: deleteRes.ok,
      stage: deleteRes.ok ? 'complete' : 'delete',
      auth: true,
      read: true,
      insert: true,
      delete: deleteRes.ok,
    })
  } catch (error) {
    return NextResponse.json({ ok: false, stage: 'exception', message: error instanceof Error ? error.message.slice(0, 240) : 'unknown' })
  }
}
