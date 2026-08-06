import { NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-token'
import { confirmEvent, deleteEvent, getEvent } from '@/lib/google-calendar'

export async function POST(request: Request) {
  const data = await request.formData(); const token = String(data.get('token') ?? ''); const action = String(data.get('action') ?? '')
  const payload = verifyAdminToken(token); if (!payload) return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 403 })
  try {
    const event = await getEvent(payload.eventId)
    if (action === 'confirm') await confirmEvent(event)
    else if (action === 'release' || action === 'cancel') { if (event.status !== 'cancelled') await deleteEvent(payload.eventId) }
    else return NextResponse.json({ error: 'Invalid action.' }, { status: 422 })
    console.info('[booking-admin] operation completed', { bookingId: payload.eventId, action })
    return NextResponse.json({ ok: true, action })
  } catch { return NextResponse.json({ error: 'Operation temporarily unavailable.' }, { status: 503 }) }
}
