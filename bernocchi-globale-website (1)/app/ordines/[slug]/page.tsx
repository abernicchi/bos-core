import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  CircuitBoard,
  Landmark,
  Scale,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { getOrdo, ordines, type OrdoSlug } from '@/lib/ordines'
import { site } from '@/lib/content'
import { AnalyticsMarker } from '@/components/analytics-marker'

type Props = { params: Promise<{ slug: string }> }

const icons = {
  medicinae: Stethoscope,
  iuris: Scale,
  scientia: Atom,
  innovatio: CircuitBoard,
  humanitatis: BookOpen,
  capitalis: Landmark,
} satisfies Record<OrdoSlug, typeof Stethoscope>

export function generateStaticParams() {
  return ordines.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ordo = getOrdo(slug)
  if (!ordo) return {}

  return {
    title: `${ordo.order} — ${ordo.institution}`,
    description: ordo.summary,
    alternates: { canonical: `/ordines/${ordo.slug}` },
    openGraph: {
      title: `${ordo.order} — ${ordo.institution}`,
      description: ordo.summary,
      images: ['/images/ordines-relief.webp'],
    },
  }
}

export default async function OrdoPage({ params }: Props) {
  const { slug } = await params
  const ordo = getOrdo(slug)
  if (!ordo) notFound()

  const Icon = icons[ordo.slug]
  const schema = {
    '@context': 'https://schema.org',
    '@type': ordo.slug === 'medicinae' ? 'ProfessionalService' : 'Organization',
    name: ordo.institution,
    alternateName: ordo.order,
    url: `${site.url}/ordines/${ordo.slug}`,
    description: ordo.summary,
    parentOrganization: {
      '@type': 'Organization',
      name: site.legalName,
      url: site.url,
    },
  }

  return (
    <div className="bg-[#07131f] text-[#f7f1e6]">
      <AnalyticsMarker event="ordo_view" ordoCode={ordo.code} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="relative isolate min-h-[68svh] overflow-hidden border-b border-white/10">
        <Image
          src="/images/ordines-relief.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-72"
          style={{ objectPosition: ordo.imagePosition }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#06111c_0%,rgba(6,17,28,.96)_34%,rgba(6,17,28,.58)_68%,rgba(6,17,28,.24)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#07131f_0%,transparent_42%)]" />

        <div className="relative mx-auto flex min-h-[68svh] max-w-7xl flex-col justify-between px-6 py-10 lg:px-10 lg:py-14">
          <Link href="/institutions" className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/48 transition hover:text-[#d8bd7a]">
            <ArrowLeft className="size-4" /> Las seis Ordines
          </Link>

          <div className="max-w-3xl pb-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-[#c9a85f]/40 bg-[#c9a85f]/9 text-[#d8bd7a] backdrop-blur-sm">
                <Icon className="size-5" />
              </span>
              <StatusBadge status={ordo.status} label={ordo.statusLabel} />
            </div>
            <p className="mt-8 text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[#c9a85f]">{ordo.order}</p>
            <h1 className="mt-4 text-balance font-serif text-5xl font-light leading-[0.98] sm:text-6xl lg:text-8xl">{ordo.institution}</h1>
            <p className="mt-6 max-w-2xl text-balance font-serif text-2xl font-light leading-snug text-[#e4cf9d] sm:text-3xl">{ordo.promise}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.85fr_1.15fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.64rem] uppercase tracking-[0.24em] text-[#c9a85f]">Mandato operativo</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">{ordo.discipline}</h2>
          </div>
          <div>
            <p className="text-xl font-light leading-9 text-white/72">{ordo.mandate}</p>
            <p className="mt-6 leading-8 text-white/50">{ordo.summary}</p>
            {ordo.regulatoryNote ? (
              <div className="mt-8 flex gap-3 rounded-2xl border border-[#c9a85f]/22 bg-[#c9a85f]/6 p-5 text-xs leading-6 text-white/52">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#c9a85f]" />
                <p>{ordo.regulatoryNote}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#091724]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[0.64rem] uppercase tracking-[0.24em] text-[#c9a85f]">Capacidad activa</p>
              <div className="mt-7 grid gap-3">
                {ordo.capabilities.map((capability, index) => (
                  <div key={capability} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <span className="mt-0.5 font-mono text-[0.62rem] text-[#c9a85f]">0{index + 1}</span>
                    <p className="text-sm leading-6 text-white/68">{capability}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.64rem] uppercase tracking-[0.24em] text-[#c9a85f]">Controles de gobierno</p>
              <div className="mt-7 rounded-3xl border border-[#c9a85f]/24 bg-[#c9a85f]/6 p-7">
                <ul className="space-y-5">
                  {ordo.controls.map((control) => (
                    <li key={control} className="flex items-start gap-3 text-sm leading-7 text-white/64">
                      <ShieldCheck className="mt-1 size-4 shrink-0 text-[#c9a85f]" />
                      <span>{control}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/34">Próximo hito</p>
                  <p className="mt-3 font-serif text-xl text-[#e4cf9d]">{ordo.nextMilestone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="text-[0.64rem] uppercase tracking-[0.24em] text-[#927331]">Segreteria Generale</p>
            <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl font-light sm:text-4xl">Cada Ordo opera bajo un mandato, un alcance y un sistema de control común.</h2>
          </div>
          <Link href={ordo.primaryHref} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#07131f] px-7 py-3.5 text-sm font-semibold text-[#f3eee3] transition hover:-translate-y-0.5">
            {ordo.primaryLabel} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
