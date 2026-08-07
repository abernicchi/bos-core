'use client'

import { useRef, useState, type FormEvent } from 'react'
import { Check, Loader2 } from 'lucide-react'
import {
  consultationModes,
  inquiryTypes,
  languages,
  type InquiryType,
} from '@/lib/content'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics-events'

const fieldClass =
  'w-full rounded-sm border border-input bg-card px-3.5 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold'
const labelClass =
  'mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground'

type Props = {
  /** Pre-select and (optionally) lock the inquiry type for dedicated pages. */
  defaultType?: InquiryType
  lockType?: boolean
  /** Restrict selectable inquiry types. */
  allowedTypes?: InquiryType[]
  /** Route the enquiry to one of the canonical Ordines. */
  ordoCode?: string
  className?: string
}

export function InquiryForm({
  defaultType = 'institutional',
  lockType = false,
  allowedTypes,
  ordoCode,
  className,
}: Props) {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const journeyStarted = useRef(false)

  const typeOptions = allowedTypes
    ? inquiryTypes.filter((t) => allowedTypes.includes(t.value))
    : inquiryTypes

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    const nextErrors: Record<string, string> = {}
    if (!String(data.fullName ?? '').trim())
      nextErrors.fullName = 'Your name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email ?? '')))
      nextErrors.email = 'Please enter a valid email address.'
    if (!String(data.message ?? '').trim())
      nextErrors.message = 'Please write a short message.'
    if (!data.consent) nextErrors.consent = 'Consent is required.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      trackEvent('inquiry_submit', { ordoCode })
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-sm border border-gold/40 bg-card p-8 text-center',
          className,
        )}
        role="status"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-gold text-gold">
          <Check className="size-6" />
        </span>
        <h3 className="mt-5 font-serif text-2xl text-card-foreground">
          Message received
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you. The Segreteria Generale will review your message and reply
          with the discretion it deserves.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={() => {
        if (!journeyStarted.current) {
          journeyStarted.current = true
          trackEvent('ordo_inquiry_start', { ordoCode })
        }
      }}
      noValidate
      className={cn('space-y-5', className)}
    >
      {ordoCode ? <input type="hidden" name="ordoCode" value={ordoCode} /> : null}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className={fieldClass}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName ? (
            <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={!!errors.email}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-destructive">{errors.email}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inquiryType" className={labelClass}>
            Type of enquiry
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            defaultValue={defaultType}
            disabled={lockType}
            className={cn(fieldClass, lockType && 'opacity-70')}
          >
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="language" className={labelClass}>
            Preferred language
          </label>
          <select
            id="language"
            name="language"
            defaultValue="en"
            className={fieldClass}
          >
            {languages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mode" className={labelClass}>
          Preferred consultation mode
        </label>
        <select
          id="mode"
          name="mode"
          defaultValue="online"
          className={fieldClass}
        >
          {consultationModes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Short message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={fieldClass}
          placeholder="Briefly tell us the reason for your message. Please do not include clinical information or sensitive data."
          aria-invalid={!!errors.message}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-destructive">{errors.message}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          className="mt-0.5 size-4 shrink-0 rounded-[3px] border-input accent-[var(--gold)]"
          aria-invalid={!!errors.consent}
        />
        <span>
          I have read the privacy notice and consent to the processing of my
          data so that I may be contacted.
        </span>
      </label>
      {errors.consent ? (
        <p className="-mt-2 text-xs text-destructive">{errors.consent}</p>
      ) : null}

      {status === 'error' ? (
        <p className="text-sm text-destructive">
          Something went wrong while sending. Please try again or write directly
          to the Segreteria Generale.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-gold/90 disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending
          </>
        ) : (
          'Send message'
        )}
      </button>
    </form>
  )
}
