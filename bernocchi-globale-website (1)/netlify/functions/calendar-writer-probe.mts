import { createSign } from 'node:crypto'

declare const Netlify: { env: { get(name: string): string | undefined } }

const PROBE_TITLE = 'Casa Bernocchi · Calendar Core writer probe 20260808'
const base64url = (input: string) => Buffer.from(input).toString('base64url')
const normalizeKey = (value: string) => value.replace(/^['\"]|['\"]$/g, '').replaceAll('\\n', '\n')

async function tokenFor(email: string, rawKey: string) {
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
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  })
  const body = await response.json().catch(() => null) as { access_token?: string } | null
  if (!response.ok || !body?.access_token) throw new Error(`calendar-probe auth ${response.status}`)
  return body.access_token
}

export default async () => {
  const calendarId = Netlify.env.get('GOOGLE_CALENDAR_ID')
  const email = Netlify.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')
  const key = Netlify.env.get('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')
  if (!calendarId || !email || !key) {
    console.log('calendar-probe config missing')
    return
  }

  try {
    const token = await tokenFor(email, key)
    const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}`
    const now = new Date()
    const max = new Date(now.getTime() + 2 * 60 * 60_000)
    const query = new URLSearchParams({
      q: PROBE_TITLE,
      timeMin: new Date(now.getTime() - 10 * 60_000).toISOString(),
      timeMax: max.toISOString(),
      singleEvents: 'true',
      maxResults: '5',
    })
    const existingResponse = await fetch(`${base}/events?${query}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    const existing = await existingResponse.json().catch(() => null) as { items?: unknown[] } | null
    if (!existingResponse.ok) {
      console.log(`calendar-probe read ${existingResponse.status}`)
      return
    }
    if ((existing?.items?.length ?? 0) > 0) {
      console.log('calendar-probe already present')
      return
    }

    const start = new Date(Date.now() + 30 * 60_000)
    const end = new Date(start.getTime() + 5 * 60_000)
    const insertResponse = await fetch(`${base}/events`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        summary: PROBE_TITLE,
        description: 'Prueba técnica temporal de escritura mediante la cuenta de servicio de Casa Bernocchi. Sin datos de pacientes.',
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        transparency: 'transparent',
        visibility: 'private',
      }),
    })
    console.log(`calendar-probe insert ${insertResponse.status}`)
  } catch (error) {
    console.log(`calendar-probe exception ${error instanceof Error ? error.message : 'unknown'}`)
  }
}

export const config = { schedule: '* * * * *' }
