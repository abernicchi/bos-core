import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { journalArticles, offices, principles, site } from '@/lib/content'
import { HomeHero } from '@/components/home/home-hero'
import { HealthPriority } from '@/components/home/health-priority'
import { FinalCta } from '@/components/home/final-cta'
import { InstitutionsList } from '@/components/institutions-list'
import { JournalCard } from '@/components/journal-card'
import { CtaLink } from '@/components/cta-link'
import { Reveal } from '@/components/reveal'

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* PRIORITY: BERNOCCHI HEALTH — the revenue-generating institution */}
      <HealthPriority />

      {/* THE HOUSE */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-gold">Casa Bernocchi</p>
              <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
                We do not accumulate companies. We build institutions.
              </h2>
            </Reveal>
            <Reveal
              delay={0.12}
              className="max-w-xl space-y-5 text-pretty leading-relaxed text-muted-foreground"
            >
              <p>
                Casa Bernocchi is the public institutional identity of{' '}
                {site.legalName}, the corporate parent that defines its
                governance and strategic direction.
              </p>
              <p>
                The House holds culture, principles and continuity; the Holding
                governs and develops each institution. Every institution begins
                from a precise mandate and a shared discipline — never from a
                market opportunity alone.
              </p>
              <CtaLink href="/casa" variant="quiet" className="px-0">
                Discover our institutional purpose
                <ArrowRight className="size-4" />
              </CtaLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <Reveal as="p" className="eyebrow text-gold">
            Principles
          </Reveal>
          <Reveal
            delay={0.1}
            className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3"
          >
            {principles.map((p) => (
              <div key={p.title} className="bg-card p-8">
                <p className="font-serif text-2xl text-card-foreground">
                  {p.title}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
                  {p.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* INSTITUTIONS */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-gold">Institutions</p>
              <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-foreground md:text-4xl">
                A group in construction, with declared status.
              </h2>
            </div>
            <CtaLink href="/casa" variant="quiet" className="px-0">
              Inside Casa Bernocchi
              <ArrowRight className="size-4" />
            </CtaLink>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <InstitutionsList />
          </Reveal>
        </div>
      </section>

      {/* GOVERNANCE */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-gold">Governance</p>
              <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-card-foreground md:text-4xl">
                Documented decisions, clear accountability.
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="grid gap-8 sm:grid-cols-2">
              {[
                {
                  title: 'Founder\u2019s Office',
                  body: 'Defines the long-term vision and safeguards the institutional coherence of the group.',
                },
                {
                  title: 'Segreteria Generale',
                  body: 'Coordinates central functions, correspondence and relationships with the outside world.',
                },
                {
                  title: 'Central governance',
                  body: 'Structures the institutions through common principles and shared functions.',
                },
                {
                  title: 'Ethics, risk & decisions',
                  body: 'Every material decision is assessed, documented and made verifiable.',
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-serif text-xl text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
              <div className="sm:col-span-2">
                <CtaLink href="/governance" variant="quiet" className="px-0">
                  Read about governance
                  <ArrowRight className="size-4" />
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRESENCE */}
      <section className="on-navy border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <Reveal as="p" className="eyebrow text-gold">
            Presence
          </Reveal>
          <Reveal
            delay={0.1}
            className="mt-10 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2"
          >
            {offices.map((office) => (
              <div key={office.label} className="bg-background p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {office.label}
                </p>
                <p className="mt-3 font-serif text-3xl text-foreground">
                  {office.city}
                </p>
                {office.country ? (
                  <p className="mt-1 text-muted-foreground">{office.country}</p>
                ) : null}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-gold">Journal</p>
              <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-foreground md:text-4xl">
                Institutional thinking, in editorial form.
              </h2>
            </div>
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold"
            >
              All articles
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 grid gap-6 md:grid-cols-3">
            {journalArticles.map((article) => (
              <JournalCard key={article.slug} article={article} />
            ))}
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  )
}
