import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock3,
  Globe2,
  HeartHandshake,
  HeartPulse,
  Languages,
  Lock,
  ShieldCheck,
  Sparkles,
  UserRound,
  ClipboardList,
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
  title: 'Bernocchi Health — Sexology, Psychology & Relationship Care',
  description:
    'Confidential, structured care for sexual health, relationships and emotional well-being. Online consultations and in-person care in Costa Rica, subject to professional and jurisdictional eligibility.',
  alternates: { canonical: '/health' },
  openGraph: {
    title: 'Bernocchi Health — Private, structured clinical care',
    description:
      'A confidential first consultation, a clear clinical pathway and continuity of care.',
    url: '/health',
  },
}

const pillarIcons = [BadgeCheck, ShieldCheck, Lock, Sparkles]
const journeyIcons = [CalendarCheck, UserRound, ClipboardList, HeartPulse]

const focusAreas = [
  'Sexual health and sexual function',
  'Desire, intimacy and relational dynamics',
  'Couples and communication',
  'Emotional regulation and behavioural patterns',
  'Male and female sexual health',
  'Neurobehavioural and psychoneuroendocrine perspectives',
]

export default function HealthPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-ivory">
        <Image
          src="/images/health-hero.png"
          alt="Private consultation environment"
          fill
          priority
          className="object-cover opacity-24"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07131f_4%,rgba(7,19,31,.96)_54%,rgba(7,19,31,.72))]" />
        <div className="relative mx-auto grid min-h-[76svh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.12fr_.88fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold">
              Bernocchi Health · Ordo Medicinae
            </p>
            <h1 className="mt-6 max-w-4xl text-balance font-serif text-5xl font-light leading-[.98] sm:text-6xl lg:text-7xl">
              Private care for sexual health, relationships and emotional well-being.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ivory/68 sm:text-lg">
              A confidential first consultation, a clear clinical formulation and a
              considered care pathway — without judgement, pressure or generic packages.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#book"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-[#dfc47f]"
              >
                Request a confidential first consultation <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#professional"
                className="inline-flex items-center justify-center rounded-full border border-ivory/24 px-7 py-3.5 text-sm font-medium text-ivory transition hover:border-gold/60 hover:text-gold"
              >
                Meet the clinical direction
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              [Lock, 'Confidential by design', 'No clinical details are requested through public website forms.'],
              [Clock3, 'Unhurried consultations', 'Most pathways reserve 50–80 minutes for a thorough first conversation.'],
              [Globe2, 'Online or in person', 'Remote care and Costa Rica-based in-person consultations, subject to eligibility.'],
              [Languages, 'English · Spanish · Italian', 'Choose your preferred consultation language when requesting an appointment.'],
            ].map(([Icon, title, body]) => {
              const Component = Icon as typeof Lock
              return (
                <article key={String(title)} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
                  <Component className="size-5 text-gold" />
                  <h2 className="mt-5 font-serif text-xl">{String(title)}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/52">{String(body)}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 bg-[#f7f3ea] text-[#07131f]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">What we help with</p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">
                Specialised care, explained in human terms.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#07131f]/60 lg:justify-self-end">
              People usually arrive with a problem, not a diagnostic label. The first
              consultation is designed to understand what is happening before a plan is recommended.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {healthServiceCards.map((service) => (
              <li key={service.name} className="rounded-3xl border border-[#07131f]/10 bg-white/60 p-7 shadow-[0_18px_60px_rgba(7,19,31,.04)]">
                <HeartHandshake className="size-5 text-[#a3823e]" />
                <h3 className="mt-7 font-serif text-2xl">{service.name}</h3>
                <p className="mt-4 text-sm leading-7 text-[#07131f]/58">{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="professional" className="scroll-mt-24 border-y border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:px-10 lg:py-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_100px_rgba(0,0,0,.28)]">
            <Image
              src="/images/founder-portrait.png"
              alt="Antonello Bernocchi Medici, founder and clinical direction of Bernocchi Health"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07131f] via-[#07131f]/72 to-transparent p-7 pt-24">
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">Founder · Clinical & Scientific Direction</p>
              <h2 className="mt-2 font-serif text-3xl">Antonello Bernocchi Medici</h2>
            </div>
          </div>

          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold">The person behind the clinical standard</p>
            <h2 className="mt-5 max-w-3xl text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">
              The first task is not to impress you. It is to understand your case correctly.
            </h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-white/60">
              <p>
                The clinical direction of Bernocchi Health works at the intersection of
                clinical sexology, psychology, behavioural neuroscience and
                psychoneuroendocrine perspectives. The objective is to translate a complex
                personal or relational problem into a structured, understandable care plan.
              </p>
              <p>
                Care may involve the individual, the couple or coordinated professional
                support depending on the case. The clinician and scope of practice are
                confirmed before treatment begins according to jurisdiction and professional eligibility.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <div key={area} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/62">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-gold/22 bg-gold/6 p-5 text-xs leading-6 text-white/48">
              Casa Bernocchi follows a verification-first credential policy: academic affiliations,
              publications, honours and professional registrations are not used as public claims unless
              the underlying documentation is available for verification.
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Why Bernocchi</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">A clinical relationship should feel safe before it feels sophisticated.</h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {whyBernocchi.map((pillar, i) => {
              const Icon = pillarIcons[i % pillarIcons.length]
              return (
                <article key={pillar.title} className="rounded-3xl border border-[#07131f]/10 bg-white/55 p-7">
                  <Icon className="size-5 text-[#a3823e]" />
                  <h3 className="mt-7 font-serif text-2xl">{pillar.title}{pillar.flag ? <span className="ml-2">{pillar.flag}</span> : null}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#07131f]/58">{pillar.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 border-y border-border bg-[#f7f3ea] text-[#07131f]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">How care begins</p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Clear steps. No mystery.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#07131f]/60 lg:justify-self-end">
              The first consultation is an assessment, not a sales pitch. A treatment pathway is proposed only after the case has been understood.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {patientJourney.map((stage, i) => {
              const Icon = journeyIcons[i % journeyIcons.length]
              return (
                <li key={stage.step} className="rounded-3xl border border-[#07131f]/10 bg-white/55 p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm text-[#a3823e]">{stage.step}</span>
                    <Icon className="size-5 text-[#a3823e]" />
                  </div>
                  <h3 className="mt-8 font-serif text-2xl">{stage.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#07131f]/58">{stage.body}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section id="fees" className="scroll-mt-24 bg-[#0a1927] text-[#f7f1e6]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold">Consultations & fees</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Know the fee before you decide.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/56">
              Indicative consultation fees are displayed transparently. The exact professional,
              modality, availability and payment route are confirmed before the appointment.
            </p>

            <ul className="mt-10 grid gap-3">
              {healthServices.map((service) => (
                <li key={service.id} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-serif text-2xl">{service.name}</h3>
                      <p className="mt-2 text-sm text-white/40">{service.duration} · Online or in person</p>
                    </div>
                    <span className="whitespace-nowrap font-serif text-3xl text-[#e4cf9d]">{formatPrice(service.priceInCents, service.currency)}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/52">{service.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
              <Image
                src="/images/health-calm.png"
                alt="Calm, private consultation setting"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <ComplianceNote className="mt-4">
              Bernocchi Health does not provide emergency care. If this is a medical emergency,
              contact your local emergency number immediately. Do not enter clinical details in any form on this site.
            </ComplianceNote>
          </div>
        </div>
      </section>

      <section id="book" className="scroll-mt-24 border-t border-white/10 bg-[#07131f] py-20 text-ivory lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold">First consultation</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light sm:text-5xl">You do not need to explain everything in a form.</h2>
            <p className="mt-5 leading-8 text-white/56">
              Choose the type of consultation, your preferred mode and basic contact details.
              Clinical history belongs in the private consultation, not on a public booking page.
            </p>
          </div>
          <div className="mt-10"><BookingFlow /></div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-6 text-white/42">
            Prefer to speak with the Segreteria first? Contact us on{' '}
            <a href={whatsappUrl} className="text-gold underline-offset-4 hover:underline">WhatsApp</a>{' '}
            or email <a href={`mailto:${site.email}`} className="text-gold underline-offset-4 hover:underline">{site.email}</a>.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-[#f7f3ea] text-[#07131f]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
          <div className="text-center">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Frequently asked questions</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light sm:text-5xl">What you should know before booking.</h2>
          </div>
          <div className="mt-12 divide-y divide-[#07131f]/10 border-y border-[#07131f]/10">
            {healthFaqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left">
                  <span className="font-serif text-xl">{faq.question}</span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#07131f]/15 text-[#07131f]/50 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl pr-10 text-sm leading-7 text-[#07131f]/58">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0a1927] text-[#f7f1e6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold">Confidential care starts with one conversation</p>
            <p className="mt-4 max-w-3xl text-balance font-serif text-3xl font-light leading-tight sm:text-4xl">
              If the case is not suitable for our scope, we would rather tell you clearly than sell you the wrong pathway.
            </p>
          </div>
          <Link href="#book" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-[#dfc47f]">
            Request consultation <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
