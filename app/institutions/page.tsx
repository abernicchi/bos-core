import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { institutions, type InstitutionStatus } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Our Institutions — Casa Bernocchi',
  description:
    'One House, several institutions. Bernocchi Health, Legal, Research Institute, Digital and Academy — each bound by a shared system of standards.',
  alternates: { canonical: '/institutions' },
}

// Curated order and labels for the five institutions of the House.
const displayOrder = ['health', 'legal', 'research', 'digital', 'academy']

const statusCopy: Record<InstitutionStatus, string> = {
  operating: 'Operational',
  development: 'In Development',
  planned: 'Planned',
  future: 'Planned',
}

export default function InstitutionsPage() {
  const houses = displayOrder
    .map((slug) => institutions.find((i) => i.slug === slug))
    .filter((i): i is (typeof institutions)[number] => Boolean(i))

  return (
    <>
      <PageHeader
        eyebrow="Our Institutions"
        title="One House. Several institutions."
        intro="Casa Bernocchi develops specialised institutions that share a single system of ethics, verified knowledge and long-term stewardship. Each is built deliberately, and nothing is claimed before it is real."
      />

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            {houses.map((inst) => (
              <article
                key={inst.slug}
                className="flex flex-col justify-between rounded-sm border border-border bg-card p-8 transition-colors hover:border-gold/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground/70">
                      {inst.order}
                    </p>
                    <StatusBadge
                      status={inst.status}
                      label={statusCopy[inst.status]}
                    />
                  </div>
                  <h2 className="mt-5 font-serif text-2xl text-foreground">
                    {inst.name}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {inst.summary}
                  </p>
                </div>
                {inst.href ? (
                  <Link
                    href={inst.href}
                    className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-gold underline-offset-4 hover:underline"
                  >
                    Enter {inst.name}
                    <ArrowUpRight className="size-4" />
                  </Link>
                ) : (
                  <p className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground/70">
                    Details to follow
                  </p>
                )}
              </article>
            ))}
          </div>

          <p className="mx-auto mt-14 max-w-2xl text-balance text-center text-sm leading-relaxed text-muted-foreground">
            Every institution answers to the same standards — Scientia,
            Integritas, Posteritas — under the governance of Bernocchi Globale
            Holdings.
          </p>
        </div>
      </section>
    </>
  )
}
