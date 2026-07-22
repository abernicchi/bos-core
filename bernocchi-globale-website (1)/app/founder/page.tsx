import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { principles, site } from '@/lib/content'

export const metadata: Metadata = {
  title: 'The Founder — Casa Bernocchi',
  description:
    'The vision behind Casa Bernocchi: institutions built on verified knowledge, integrity and generational continuity.',
  alternates: { canonical: '/founder' },
}

export default function FounderPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Founder"
        title="A house built one documented decision at a time."
        intro="Casa Bernocchi begins with a conviction: that institutions, unlike companies, are built to outlive those who found them."
      />

      {/* Portrait & biography */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[0.8fr_1fr] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border">
            <Image
              src="/images/founder-portrait.png"
              alt="An editorial study interior representing the founder of Casa Bernocchi"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <span className="absolute bottom-4 left-4 rounded-full border border-gold/40 bg-navy/70 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
              Portrait to follow
            </span>
          </div>
          <div>
            <p className="eyebrow text-gold">Biography</p>
            <blockquote className="mt-6 text-balance font-serif text-2xl leading-relaxed text-foreground md:text-3xl">
              &ldquo;I did not want to build a company that chased cycles. I
              wanted to build a house of institutions — bound by ethics, held to
              evidence, and accountable across generations.&rdquo;
            </blockquote>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Founded in Italy in 2026, Casa Bernocchi is the institutional
              identity of Bernocchi Globale Holdings. Its purpose is to build and
              govern specialised institutions that share one system of standards.
              The work begins with Bernocchi Health and extends, deliberately and
              without haste, into law, science, technology and education.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The method is simple to state and demanding to keep: verify before
              deciding, write down what is decided, and measure value in decades
              rather than quarters.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional philosophy */}
      <section className="border-b border-border bg-stone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.6fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow text-gold">Institutional philosophy</p>
              <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-foreground md:text-4xl">
                Permanence is a design choice.
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                A company is organised around an opportunity; an institution is
                organised around a duty. Casa Bernocchi is built on the second
                idea — that what endures does so because knowledge is encoded
                into rules, documents and practice, and not left to the memory of
                any single person.
              </p>
              <p>
                Every institution of the house answers to the same standards:
                verified knowledge before action, integrity in every decision,
                and stewardship measured across generations. Growth is
                deliberate. Nothing is claimed before it is real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-none px-0 md:grid-cols-2">
          <div className="border-b border-border px-6 py-14 md:border-b-0 md:border-r md:px-10 lg:py-20">
            <p className="eyebrow text-gold">Vision</p>
            <p className="mt-5 text-pretty font-serif text-2xl leading-relaxed text-foreground">
              {site.vision}
            </p>
          </div>
          <div className="px-6 py-14 md:px-10 lg:py-20">
            <p className="eyebrow text-gold">Mission</p>
            <p className="mt-5 text-pretty font-serif text-2xl leading-relaxed text-foreground">
              {site.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border bg-stone">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="eyebrow text-gold">Values</p>
          <h2 className="mt-4 max-w-2xl text-balance font-serif text-3xl leading-tight text-foreground md:text-4xl">
            Three principles that govern every institution of the house.
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

      {/* Long-term vision */}
      <section className="on-navy border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <p className="eyebrow text-gold">The long view</p>
          <p className="mx-auto mt-6 max-w-3xl text-balance font-serif text-3xl leading-snug text-foreground md:text-4xl">
            To leave behind institutions that are stronger for the passage of
            time — trusted, documented and worthy of the generations that inherit
            them.
          </p>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">
            The horizon is not the next cycle. It is the century. Each decision
            is made so that those who come later inherit clarity rather than
            correction.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-pretty font-serif text-2xl text-foreground">
            Read how the house is governed.
          </p>
          <Link
            href="/governance"
            className="inline-flex items-center gap-2 self-start rounded-sm border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            Governance
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
