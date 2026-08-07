import { createHmac } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getOrdoByCode } from '@/lib/ordines'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-rest'

const EVENTS = new Set([
  'page_view',
  'ordo_view',
  'ordo_inquiry_start',
  'inquiry_submit',
  'booking_start',
  'booking_submit',
  'payment_start',
  'payment_complete',
])
const PROVIDERS = new Set(['paypal', 'onvo'])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function normalizedPath(path: string) {
  return /^\/pay\/[0-9a-f-]{36}(?:\/|$)/i.test(path)
    ? '/pay/:token'
    : path
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return new NextResponse(null, { status: 204 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 })
  }

  const eventName = text(body.eventName, 50)
  const path = text(body.path, 300)
  const rawAnonymousId = text(body.anonymousId, 80)
  const ordoCode = text(body.ordoCode, 40)
  const serviceCode = text(body.serviceCode, 80)
  const provider = text(body.provider, 20)

  if (!EVENTS.has(eventName) || !path.startsWith('/') || path.startsWith('//')) {
    return NextResponse.json({ error: 'Invalid event.' }, { status: 422 })
  }
  if (rawAnonymousId && !UUID_RE.test(rawAnonymousId)) {
    return NextResponse.json({ error: 'Invalid anonymous identifier.' }, { status: 422 })
  }
  if (ordoCode && !getOrdoByCode(ordoCode)) {
    return NextResponse.json({ error: 'Invalid Ordo.' }, { status: 422 })
  }
  if (provider && !PROVIDERS.has(provider)) {
    return NextResponse.json({ error: 'Invalid provider.' }, { status: 422 })
  }

  const secret = process.env.ANALYTICS_SALT ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonymousId = rawAnonymousId && secret
    ? createHmac('sha256', secret).update(rawAnonymousId).digest('hex')
    : null
  const metadata = body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
    ? Object.fromEntries(
        Object.entries(body.metadata as Record<string, unknown>)
          .slice(0, 8)
          .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
          .map(([key, value]) => [key.slice(0, 40), typeof value === 'string' ? value.slice(0, 120) : value]),
      )
    : {}

  try {
    await supabaseRequest('analytics_events', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        event_name: eventName,
        anonymous_id: anonymousId,
        path: normalizedPath(path),
        ordo_code: ordoCode || null,
        service_code: serviceCode || null,
        provider: provider || null,
        metadata,
      }),
    })
  } catch (error) {
    console.error('[Casa Bernocchi] Analytics event persistence failed:', error)
  }

  return new NextResponse(null, { status: 204 })
}
