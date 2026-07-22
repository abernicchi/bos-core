import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { principles as corePrinciples } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Governance',
  description:
    'The Founder\u2019s Office, Segreteria Generale and central governance functions of Bernocchi Globale Holdings — ethics, risk and documented decisions.',
  alternates: { canonical: '/governance' },
}

const functions = [
  {
    title: 'Founder\u2019s Office',
    body: 'Guards the long-term vision, institutional coherence and strategic direction of the group. It is the origin of the principles that govern every institution.',
  },
  {
    title: 'Segreteria Generale',
    body: 'Coordinates central functions, institutional correspondence and external relations. It is the official channel of contact with Casa Bernocchi.',
  },
  {
    title: 'Central governance',
    body: 'Defines the shared structure of the institutions: common principles, support functions and consistent operating standards.',
  },
  {
    title: 'Ethics, risk & decisions',
    body: 'Every material decision is assessed for ethics and risk, then documented. What is not written is not considered decided.',
  },
]

const rules = [
  'Material decisions are documented and verifiable.',
  'Responsibility is assigned clearly and traceably.',
  'Ethics precede opportunity in every assessment.',
  'Risk is examined beforehand, not justified afterwards.',
]

export default function GovernancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="To govern is to make decisions verifiable."
        intro="The governance of Bernocchi Globale Holdings is designed for continuity: clear functions, assigned responsibility and documented decisions."
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
            {functions.map((fn) => (
              <div key={fn.title} className="bg-background p-8 lg:p-10">
                <h2 className="font-serif text-2xl text-foreground">
                  {fn.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {fn.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-10 lg:py-28">
          <div>
            <p className="eyebrow text-gold">Governance principles</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-card-foreground md:text-4xl">
              Discipline before ambition.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Three Latin principles anchor every institution:{' '}
              {corePrinciples.map((p) => p.title).join(', ')}.
            </p>
          </div>
          <ul className="space-y-5">
            {rules.map((rule, i) => (
              <li
                key={rule}
                className="flex gap-4 border-b border-border pb-5 last:border-0"
              >
                <span className="font-serif text-lg text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="leading-relaxed text-card-foreground/90">{rule}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="max-w-xl text-pretty font-serif text-2xl text-foreground">
            For institutional matters, the Segreteria Generale is the official
            channel.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 self-start rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-gold lg:self-auto"
          >
            Contact the Segreteria
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
