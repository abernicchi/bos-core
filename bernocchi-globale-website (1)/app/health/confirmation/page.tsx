import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, MessageCircle, Mail, ArrowRight } from 'lucide-react'
import { site, bookingWhatsappUrl } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Appointment Request Received — Bernocchi Health',
  description:
    'Your appointment request has been received. Confirm availability with the Bernocchi Health Segreteria on WhatsApp.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/health/confirmation' },
}

const steps = [
  {
    title: 'We have received your request',
    body: 'The Segreteria Generale will review your preferred consultation, date and time.',
  },
  {
    title: 'We confirm availability',
    body: 'You will receive a reply by email or WhatsApp with confirmed details.',
  },
  {
    title: 'Your consultation is scheduled',
    body: 'Once confirmed, you will receive everything needed to attend online or in person.',
  },
]

export default function AppointmentConfirmationPage() {
  return (
    <section className="border-t border-border bg-navy py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-gold text-navy">
          <Check className="size-7" aria-hidden="true" />
        </span>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gold">
          Bernocchi Health
        </p>
        <h1 className="mt-3 text-balance font-serif text-4xl leading-tight md:text-5xl">
          Your appointment request has been received
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ivory/70">
          Thank you. Our Segreteria Generale will review your request and
          respond to confirm availability. To speed things up, you can confirm
          directly with us on WhatsApp now.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={bookingWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-gold/90"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Confirm availability on WhatsApp
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-sm border border-ivory/25 px-6 py-3 text-sm font-medium text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            <Mail className="size-4" aria-hidden="true" />
            Email the Segreteria
          </a>
        </div>

        {/* What happens next */}
        <ol className="mx-auto mt-14 grid max-w-2xl gap-px overflow-hidden rounded-sm border border-ivory/10 bg-ivory/10 text-left sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="bg-navy p-6">
              <span className="font-serif text-2xl text-gold">{i + 1}</span>
              <h2 className="mt-2 font-serif text-lg text-ivory">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <Link
            href="/health"
            className="inline-flex items-center gap-2 text-sm text-ivory/70 transition-colors hover:text-gold"
          >
            Return to Bernocchi Health
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
