'use client'

export type AnalyticsEventName =
  | 'page_view'
  | 'ordo_view'
  | 'ordo_inquiry_start'
  | 'inquiry_submit'
  | 'booking_start'
  | 'booking_submit'
  | 'payment_start'
  | 'payment_complete'

type AnalyticsPayload = {
  ordoCode?: string
  serviceCode?: string
  provider?: 'paypal' | 'onvo'
  metadata?: Record<string, string | number | boolean>
}

const CONSENT_KEY = 'cb-cookie-consent'
const ANONYMOUS_KEY = 'cb-anonymous-id'

function anonymousId() {
  let value = window.localStorage.getItem(ANONYMOUS_KEY)
  if (!value) {
    value = crypto.randomUUID()
    window.localStorage.setItem(ANONYMOUS_KEY, value)
  }
  return value
}

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem(CONSENT_KEY) !== 'accepted') return

  void fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      eventName: name,
      anonymousId: anonymousId(),
      path: window.location.pathname,
      ...payload,
    }),
  }).catch(() => undefined)
}
