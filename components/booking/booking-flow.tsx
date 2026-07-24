'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import {
  consultationModes,
  consultationTypes,
  languages,
  bookingTimeSlots,
} from '@/lib/content'
import { cn } from '@/lib/utils'

/*
 * PAYMENT PLACEHOLDER — Stripe is intentionally NOT active yet.
 * This flow captures an appointment *request* and emails it to the Segreteria
 * Generale. When card payment is enabled later, add a payment step after
 * "Your details" using the existing (dormant) helpers:
 *   - components/embedded-checkout.tsx
 *   - app/actions/stripe.ts
 *   - lib/products.ts
 */

type Booking = {
  consultationId: string
  mode: string
  fullName: string
  email: string
  whatsapp: string
  country: string
  language: string
  date: string
  time: string
}

const STEPS = ['Consultation', 'Mode', 'Your details', 'Confirmation'] as const

const fieldClass =
  'w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold'
const labelClass =
  'mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground'

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function BookingFlow({
  initialConsultationId,
}: {
  initialConsultationId?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Honeypot — must stay empty; a filled value indicates a bot.
  const [company, setCompany] = useState('')
  const [booking, setBooking] = useState<Booking>({
    consultationId: initialConsultationId ?? consultationTypes[0].id,
    mode: 'online',
    fullName: '',
    email: '',
    whatsapp: '',
    country: '',
    language: 'en',
    date: '',
    time: '',
  })

  const consultation = useMemo(
    () =>
      consultationTypes.find((c) => c.id === booking.consultationId) ??
      consultationTypes[0],
    [booking.consultationId],
  )

  function update<K extends keyof Booking>(key: K, value: Booking[K]) {
    setBooking((b) => ({ ...b, [key]: value }))
  }

  const canContinue = (() => {
    switch (step) {
      case 0:
        return !!booking.consultationId
      case 1:
        return !!booking.mode
      case 2:
        return (
          booking.fullName.trim().length > 1 &&
          EMAIL_RE.test(booking.email) &&
          booking.whatsapp.trim().length > 4 &&
          booking.country.trim().length > 1 &&
          !!booking.date &&
          !!booking.time
        )
      default:
        return true
    }
  })()

  const modeLabel =
    consultationModes.find((m) => m.value === booking.mode)?.label ?? '—'
  const languageLabel =
    languages.find((l) => l.value === booking.language)?.label ?? '—'

  async function submitRequest() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultation: consultation.name,
          mode: modeLabel,
          fullName: booking.fullName,
          email: booking.email,
          whatsapp: booking.whatsapp,
          country: booking.country,
          language: languageLabel,
          date: booking.date,
          time: booking.time,
          company,
        }),
      })
      if (!res.ok) {
        throw new Error('request-failed')
      }
      router.push('/health/confirmation')
    } catch {
      setError(
        'We could not submit your request just now. Please try again, or contact us on WhatsApp.',
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      {/* Honeypot — hidden from humans, dropped server-side if filled. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Progress */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-border bg-secondary px-6 py-4 text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex size-5 items-center justify-center rounded-full text-[0.65rem] font-medium',
                i < step && 'bg-gold text-navy',
                i === step && 'border border-gold text-gold',
                i > step && 'border border-border text-muted-foreground',
              )}
            >
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            <span
              className={cn(
                'uppercase tracking-[0.12em]',
                i === step ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 ? (
              <span className="ml-1 text-border">/</span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="p-6 lg:p-8">
        {/* STEP 0 — CONSULTATION */}
        {step === 0 ? (
          <fieldset>
            <legend className="font-serif text-2xl text-card-foreground">
              Choose a consultation
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {consultationTypes.map((c) => {
                const selected = booking.consultationId === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => update('consultationId', c.id)}
                    className={cn(
                      'flex flex-col gap-1 rounded-sm border p-4 text-left transition-colors',
                      selected
                        ? 'border-gold bg-gold/5'
                        : 'border-border hover:border-gold/50',
                    )}
                    aria-pressed={selected}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium text-card-foreground">
                        {c.name}
                      </span>
                      {selected ? (
                        <Check className="size-4 text-gold" />
                      ) : null}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.description}
                    </span>
                    <span className="mt-1 text-xs uppercase tracking-[0.12em] text-gold/80">
                      {c.duration}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        {/* STEP 1 — MODE */}
        {step === 1 ? (
          <fieldset>
            <legend className="font-serif text-2xl text-card-foreground">
              Choose consultation mode
            </legend>
            <p className="mt-2 text-sm text-muted-foreground">
              Meet by secure video or in person, whichever suits you.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {consultationModes.map((m) => {
                const selected = booking.mode === m.value
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => update('mode', m.value)}
                    className={cn(
                      'flex items-center justify-between rounded-sm border p-5 text-left transition-colors',
                      selected
                        ? 'border-gold bg-gold/5'
                        : 'border-border hover:border-gold/50',
                    )}
                    aria-pressed={selected}
                  >
                    <span className="font-medium text-card-foreground">
                      {m.label}
                    </span>
                    {selected ? <Check className="size-4 text-gold" /> : null}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        {/* STEP 2 — DETAILS */}
        {step === 2 ? (
          <fieldset>
            <legend className="font-serif text-2xl text-card-foreground">
              Your details
            </legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={booking.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={booking.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className={labelClass}>
                  WhatsApp number
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+506 …"
                  value={booking.whatsapp}
                  onChange={(e) => update('whatsapp', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  autoComplete="country-name"
                  value={booking.country}
                  onChange={(e) => update('country', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="language" className={labelClass}>
                  Preferred language
                </label>
                <select
                  id="language"
                  value={booking.language}
                  onChange={(e) => update('language', e.target.value)}
                  className={fieldClass}
                >
                  {languages.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className={labelClass}>
                  Preferred date
                </label>
                <input
                  id="date"
                  type="date"
                  min={todayISO()}
                  value={booking.date}
                  onChange={(e) => update('date', e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <span className={labelClass}>Preferred time</span>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {bookingTimeSlots.map((slot) => {
                  const selected = booking.time === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => update('time', slot)}
                      className={cn(
                        'rounded-sm border py-2 text-sm transition-colors',
                        selected
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-border text-card-foreground hover:border-gold/50',
                      )}
                      aria-pressed={selected}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Please do not include clinical or medical information. This is an
              appointment request only — times are indicative and will be
              confirmed by the Segreteria Generale.
            </p>
          </fieldset>
        ) : null}

        {/* STEP 3 — CONFIRMATION */}
        {step === 3 ? (
          <div>
            <h3 className="font-serif text-2xl text-card-foreground">
              Review your request
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please confirm the details below before submitting your
              appointment request.
            </p>
            <div className="mt-5 rounded-sm border border-border bg-secondary p-5 text-sm">
              <dl className="grid gap-2 sm:grid-cols-2">
                <SummaryRow label="Consultation" value={consultation.name} />
                <SummaryRow label="Duration" value={consultation.duration} />
                <SummaryRow label="Mode" value={modeLabel} />
                <SummaryRow label="Language" value={languageLabel} />
                <SummaryRow
                  label="Date & time"
                  value={`${booking.date || '—'} · ${booking.time || '—'}`}
                />
                <SummaryRow label="Full name" value={booking.fullName || '—'} />
                <SummaryRow label="Email" value={booking.email || '—'} />
                <SummaryRow label="WhatsApp" value={booking.whatsapp || '—'} />
                <SummaryRow label="Country" value={booking.country || '—'} />
              </dl>
            </div>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-sm border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={submitRequest}
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit appointment request
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        ) : null}

        {/* NAV */}
        {step < 3 ? (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue}
              className="inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 2 ? 'Review request' : 'Continue'}
              <ArrowRight className="size-4" />
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={submitting}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              Back to details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 sm:block">
      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-card-foreground sm:mt-0.5">{value}</dd>
    </div>
  )
}
