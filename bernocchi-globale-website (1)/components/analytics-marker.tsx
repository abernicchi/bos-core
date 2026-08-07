'use client'

import { useEffect } from 'react'
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics-events'

export function AnalyticsMarker({
  event,
  ordoCode,
  serviceCode,
  provider,
}: {
  event: AnalyticsEventName
  ordoCode?: string
  serviceCode?: string
  provider?: 'paypal' | 'onvo'
}) {
  useEffect(() => {
    trackEvent(event, { ordoCode, serviceCode, provider })
  }, [event, ordoCode, provider, serviceCode])
  return null
}
