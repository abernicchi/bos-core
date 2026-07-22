import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { InstitutionsList } from '@/components/institutions-list'
import { site, principles, offices } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Casa Bernocchi — The institution behind Bernocchi Globale',
  description:
    'Casa Bernocchi is the institutional identity of Bernocchi Globale Holdings: an Italian group building professional excellence across health, law, science and innovation.',
  alternates: { canonical: '/casa' },
}

export default function CasaPage() {
  return (
    <>
      <PageHeader
        eyebrow="La Casa"
        title="An Italian house of institutions, built to endure."
        intro={site.positioning}
      />

      {/* Vision & mission */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
          <div className="rounded-sm border border-border bg-card p-8">
            <h2 className="font-serif text-2xl text-card-foreground">Mission</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {site.mission}
            </p>
          </div>
          <div className="rounded-sm border border-border bg-card p-8">
            <h2 className="font-serif text-2xl text-card-foreground">Vision</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {site.vision}
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-border bg-stone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="eyebrow text-gold">Founding principles</p>
          <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl text-foreground md:text-4xl">
            Three principles anchor every institution.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="bg-stone p-8">
                <h3 className="font-serif text-2xl text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gold">
                  {p.subtitle}
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/images/library.png"
              alt="A quiet institutional library, a place of study and continuity"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div>
            <p className="eyebrow text-gold">The Founder</p>
            <blockquote className="mt-4 text-balance font-serif text-2xl leading-relaxed text-foreground md:text-3xl">
              &ldquo;An institution is a promise kept across generations. We are
              building it one decision at a time, and writing each one
              down.&rdquo;
            </blockquote>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Casa Bernocchi was founded in Italy in 2026 as the institutional
              identity of Bernocchi Globale Holdings. Its work begins with
              Bernocchi Health and extends, over time, into law, science,
              technology, education and capital — each governed by the same
              system of ethics, verified knowledge and documented decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section className="border-b border-border bg-stone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="eyebrow text-gold">The institutions</p>
          <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl text-foreground md:text-4xl">
            One house, several orders.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Each institution belongs to an &ldquo;order&rdquo; — a discipline
            with its own standards. Only Bernocchi Health is operating today;
            the others are honestly marked as in development or planned.
          </p>
          <div className="mt-10">
            <InstitutionsList />
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            {offices.map((office) => (
              <div key={office.detail}>
                <p className="text-xs uppercase tracking-[0.16em] text-gold">
                  {office.label}
                </p>
                <p className="mt-2 font-serif text-xl text-foreground">
                  {office.city}
                  {office.country ? `, ${office.country}` : ''}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 self-start rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            Contact the Segreteria
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
