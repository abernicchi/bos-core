'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Minimal cookie-consent structure. No invasive tracking runs by default.
 * Only Vercel Analytics (anonymous, cookieless) is used in production.
 * TODO: gate any future non-essential cookies behind an "accepted" consent.
 */
const STORAGE_KEY = 'cb-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) setVisible(true)
  }, [])

  function decide(value: 'accepted' | 'essential') {
    window.localStorage.setItem(STORAGE_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-sm border border-border bg-card p-5 text-card-foreground shadow-xl md:inset-x-auto md:right-6 md:bottom-24"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        We use only essential cookies for the operation of this site. Statistics
        are anonymous and free of invasive tracking. Read our{' '}
        <Link
          href="/cookies"
          className="text-gold underline-offset-4 hover:underline"
        >
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => decide('accepted')}
          className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide('essential')}
          className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-gold"
        >
          Essential only
        </button>
      </div>
    </div>
  )
}
