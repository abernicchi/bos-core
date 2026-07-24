import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Lock,
  UserRound,
  CalendarCheck,
  ClipboardList,
  HeartPulse,
} from 'lucide-react'
import { ComplianceNote } from '@/components/compliance-note'
import { BookingFlow } from '@/components/booking/booking-flow'
import {
  site,
  healthServices,
  healthServiceCards,
  whyBernocchi,
  patientJourney,
  healthFaqs,
  whatsappUrl,
} from '@/lib/content'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Bernocchi Health — Clinical Sexology, Psychology & Well-being',
  description:
    'Bernocchi Health provides clinical sexology, psychology and human well-being with Italian standards of professional excellence. Confidential consultations, online worldwide or in person.',
  alternates: { canonical: '/health' },
  openGraph: {
    title: 'Bernocchi Health — Clinical Sexology, Psychology & Well-being',
    description:
      'Confidential consultations with Italian standards of professional excellence. Online worldwide or in person.',
    url: '/health',
  },
}

const pillarIcons = [BadgeCheck, ShieldCheck, Lock, Sparkles]
const journeyIcons = [CalendarCheck, UserRound, ClipboardList, HeartPulse]

export default function HealthPage() {
  return (
    <>
      {/* 1 — HERO */}
      <section className="relative overflow-hidden bg-navy text-ivory">
        <Image
          src="/images/health-hero.png"
          alt="A serene, light-filled private consultation space with Italian marble and natural light"
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/80 to-navy"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">
            Bernocchi Health
          </p>
          <h1 className="mt-6 max-w-3xl text-balance font-serif text-4xl leading-[1.05] md:text-6xl">
            Bernocchi Health
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ivory/75 md:text-xl">
            Clinical Sexology, Psychology and Human Well-being with Italian
            standards of professional excellence.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#book"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-3.5 text-sm font-medium text-navy transition-colors hover:bg-gold/90"
            >
              Book a Consultation
            </Link>
            <Link
              href="#why"
              className="inline-flex items-center justify-center rounded-sm border border-ivory/30 px-7 py-3.5 text-sm font-medium text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — OUR SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            Our Services
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl text-foreground md:text-4xl">
            Specialised, confidential care
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Each pathway is delivered by licensed professionals, online or in
            person, with the discretion of a private institution.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {healthServiceCards.map((service) => (
            <li
              key={service.name}
              className="flex flex-col bg-card p-7 transition-colors hover:bg-secondary"
            >
              <h3 className="font-serif text-xl text-foreground text-balance">
                {service.name}
              </h3>
              <span
                className="mt-3 h-px w-10 bg-gold"
                aria-hidden="true"
              />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3 — WHY BERNOCCHI */}
      <section id="why" className="scroll-mt-24 border-y border-border bg-stone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Why Bernocchi
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl text-foreground md:text-4xl">
              The principles behind our care
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our clinical team practises to a single institutional standard —
              rigorous, discreet and enduring.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {whyBernocchi.map((pillar, i) => {
              const Icon = pillarIcons[i % pillarIcons.length]
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col gap-4 bg-card p-7"
                >
                  <Icon className="size-6 text-gold" aria-hidden="true" />
                  <h3 className="font-serif text-xl text-foreground text-balance">
                    {pillar.title}
                    {pillar.flag ? (
                      <span
                        aria-hidden="true"
                        className="ml-1.5 align-baseline"
                      >
                        {pillar.flag}
                      </span>
                    ) : null}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4 — PATIENT JOURNEY */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            Patient Journey
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl text-foreground md:text-4xl">
            A considered path, from first contact to follow-up
          </h2>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {patientJourney.map((stage, i) => {
            const Icon = journeyIcons[i % journeyIcons.length]
            return (
              <li key={stage.step} className="relative flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-sm text-gold">
                    {stage.step}
                  </span>
                  <span
                    className="h-px flex-1 bg-border"
                    aria-hidden="true"
                  />
                  <Icon className="size-5 text-gold" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-serif text-xl text-foreground">
                  {stage.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {stage.body}
                </p>
              </li>
            )
          })}
        </ol>
      </section>

      {/* 5 — CONSULTATIONS, PRICING & BOOKING */}
      <section className="border-t border-border bg-stone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Consultations & fees
              </p>
              <h2 className="mt-3 font-serif text-3xl text-foreground md:text-4xl">
                Transparent, indicative fees
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                Every consultation is delivered by a licensed clinician, online
                or in person. Indicative fees are shown in full — there are no
                hidden costs, and they are confirmed with you before your
                appointment.
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                {healthServices.map((service) => (
                  <li
                    key={service.id}
                    className="rounded-sm border border-border bg-card p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl text-foreground">
                          {service.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {service.duration} · Online or in person
                        </p>
                      </div>
                      <span className="whitespace-nowrap font-serif text-2xl text-foreground">
                        {formatPrice(service.priceInCents, service.currency)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {service.benefits.map((b) => (
                        <li
                          key={b}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src="/images/health-calm.png"
                  alt="A calm, private consultation room bathed in natural light"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <ComplianceNote className="mt-4">
                Bernocchi Health does not provide emergency care. If this is a
                medical emergency, contact your local emergency number
                immediately. Do not enter clinical details in any form on this
                site.
              </ComplianceNote>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING FLOW */}
      <section
        id="book"
        className="scroll-mt-24 border-t border-border bg-navy py-16 text-ivory md:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Book a consultation
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl md:text-4xl">
              Request your appointment in a few steps
            </h2>
            <p className="mt-4 leading-relaxed text-ivory/70">
              Choose a consultation, tell us how you would like to meet, and
              share your details. The Segreteria Generale will confirm
              availability with you.
            </p>
          </div>

          <div className="mt-10">
            <BookingFlow />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ivory/50">
            This is an appointment request only — no payment is taken now, and
            no clinical information is collected. Prefer to speak with us first?
            Message us on{' '}
            <a
              href={whatsappUrl}
              className="text-gold underline-offset-4 hover:underline"
            >
              WhatsApp
            </a>{' '}
            or email{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-gold underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>

      {/* 6 — FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            Frequently Asked Questions
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl text-foreground md:text-4xl">
            Answers, in confidence
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {healthFaqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="font-serif text-lg text-foreground">
                  {faq.question}
                </span>
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 pr-10 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 7 — FINAL CTA */}
      <section className="relative overflow-hidden border-t border-border bg-navy text-ivory">
        <Image
          src="/images/marble-detail.png"
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-navy/80"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <h2 className="text-balance font-serif text-3xl md:text-5xl">
            Book your consultation today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-ivory/75">
            Professional care. Absolute confidentiality. Worldwide online
            consultations.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="#book"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-4 text-sm font-medium text-navy transition-colors hover:bg-gold/90"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
