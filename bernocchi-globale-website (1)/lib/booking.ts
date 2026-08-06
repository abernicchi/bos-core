import { bookingTimeSlots, consultationTypes } from './content.ts'

export const CALENDAR_TIMEZONE = 'America/Costa_Rica'
export const HOLD_MINUTES = 30

export function consultationDuration(id: string): number | null {
  const item = consultationTypes.find((entry) => entry.id === id)
  if (!item) return null
  const value = Number.parseInt(item.duration, 10)
  return Number.isFinite(value) ? value : null
}

export function costaRicaDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00-06:00`)
}

export function overlaps(start: Date, end: Date, otherStart: Date, otherEnd: Date) {
  return start < otherEnd && end > otherStart
}

export function isExpiredHold(properties: Record<string, string> | undefined, now = new Date()) {
  return properties?.bookingStatus === 'pending_deposit' &&
    Boolean(properties.holdExpiresAt) && new Date(properties!.holdExpiresAt) <= now
}

export function slotId(date: string, time: string, duration: number) {
  return `bh${date.replaceAll('-', '')}${time.replace(':', '')}${duration}`.toLowerCase()
}

export function validBookingDate(date: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const value = costaRicaDateTime(date, '23:59')
  return !Number.isNaN(value.valueOf()) && value >= now
}

export { bookingTimeSlots }
