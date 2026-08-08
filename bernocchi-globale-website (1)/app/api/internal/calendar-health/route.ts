import { createSign } from 'node:crypto'
import { NextResponse } from 'next/server'

function normalizePrivateKey(value: string) {
  return value.replace(/^['\"]|['\"]$/g, '').replaceAll('\\n', '\n')
}

const base64url = (input: string) => Buffer.from(input).toString('base64url')

function safeGoogleError(body: unknown) {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  const error = record.error
  if (!error || typeof error !== 'object') return null
  const e = error as Record<string, unknown>
  const errors = Array.isArray(e.errors) ? e.errors : []
  const first = errors[0]
  return {
    code: typeof e.code === 'number' ? e.code : undefined,
    message: typeof e.message === 'string' ? e.message.slice(0, 240) : undefined,
    reason: first && typeof first === 'object' && typeof (first as Record<string, unknown>).reason === 'string'
      ? String((first as Record<string, unknown>).reason).slice(0, 120)
      : undefined,
  }
}

export async function GET(request: Request) {
  const expected = process.env.CALENDAR_DIAGNOSTIC_TOKEN
  const supplied = new URL(request.url).searchParams.get('token')
  if (!expected || !supplied || supplied !== expected) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!calendarId || !email || !rawKey) {
    return NextResponse.json({ ok: false, stage: 'config', configured: false }, { status: 503 })
  }

  try {
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

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
      cache: 'no-store',
    })
    const tokenBody = await tokenResponse.json().catch(() => null) as { access_token?: string } | null
    if (!tokenResponse.ok || !tokenBody?.access_token) {
      return NextResponse.json({ ok: false, stage: 'auth', status: tokenResponse.status, error: safeGoogleError(tokenBody) }, { status: 200 })
    }

    const token = tokenBody.access_token
    const start = new Date(Date.now() + 10 * 60_000)
    const end = new Date(start.getTime() + 5 * 60_000)
    const calendarBase = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}`

    const readResponse = await fetch(`${calendarBase}/events?timeMin=${encodeURIComponent(start.toISOString())}&timeMax=${encodeURIComponent(end.toISOString())}&singleEvents=true&maxResults=1`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    const readBody = await readResponse.json().catch(() => null)
    if (!readResponse.ok) {
      return NextResponse.json({ ok: false, stage: 'read', status: readResponse.status, error: safeGoogleError(readBody) }, { status: 200 })
    }

    const insertResponse = await fetch(`${calendarBase}/events`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        summary: 'Casa Bernocchi · Calendar Core diagnostic',
        description: 'Temporary automated connectivity test. This event should be deleted immediately.',
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        transparency: 'transparent',
        visibility: 'default',
      }),
      cache: 'no-store',
    })
    const insertBody = await insertResponse.json().catch(() => null) as { id?: string } | null
    if (!insertResponse.ok || !insertBody?.id) {
      return NextResponse.json({ ok: false, stage: 'insert', status: insertResponse.status, error: safeGoogleError(insertBody) }, { status: 200 })
    }

    const deleteResponse = await fetch(`${calendarBase}/events/${encodeURIComponent(insertBody.id)}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    return NextResponse.json({
      ok: insertResponse.ok && deleteResponse.ok,
      stage: deleteResponse.ok ? 'complete' : 'delete',
      auth: true,
      read: true,
      insert: true,
      delete: deleteResponse.ok,
      calendarIdMatchesPrimary: calendarId === 'segreteria@bernocchiglobale.it',
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ ok: false, stage: 'exception', message: error instanceof Error ? error.message.slice(0, 240) : 'unknown' }, { status: 200 })
  }
}
