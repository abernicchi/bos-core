import { NextResponse } from 'next/server'
import { bookingTimeSlots, consultationDuration, costaRicaDateTime, validBookingDate } from '@/lib/booking'
import { eventBlocksSlot, listEvents, removeExpired } from '@/lib/google-calendar'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); const date = searchParams.get('date') ?? ''; const consultationId = searchParams.get('consultationId') ?? ''
  const duration = consultationDuration(consultationId)
  if (!duration || !validBookingDate(date)) return NextResponse.json({ error: 'Invalid date or consultation.' }, { status: 422 })
  try {
    const dayStart = costaRicaDateTime(date, '00:00'); const dayEnd = new Date(dayStart.valueOf() + 24 * 60 * 60_000)
    const events = await listEvents(dayStart, dayEnd); void removeExpired(events)
    const now = new Date()
    const slots = bookingTimeSlots.map((time) => { const start = costaRicaDateTime(date, time); const end = new Date(start.valueOf() + duration * 60_000); return { time, available: start > now && !events.some((event) => eventBlocksSlot(event, start, end, now)) } })
    return NextResponse.json({ date, consultationId, timezone: 'America/Costa_Rica', slots })
  } catch {
    return NextResponse.json({ error: 'Availability is temporarily unavailable.' }, { status: 503 })
  }
}
