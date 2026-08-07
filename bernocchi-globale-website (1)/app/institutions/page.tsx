import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { ordines } from '@/lib/ordines'

export const metadata: Metadata = {
  title: 'Las seis Ordines',
  description:
    'La arquitectura institucional de Casa Bernocchi: Medicinae, Iuris, Scientia, Innovatio, Humanitatis y Capitalis, con estado y mandato declarados.',
  alternates: { canonical: '/institutions' },
}

export default function InstitutionsPage() {
  return (
    <div className="bg-[#07131f] text-[#f7f1e6]">
      <section className="relative isolate min-h-[72svh] overflow-hidden border-b border-white/10">
        <Image
          src="/images/ordines-relief.webp"
          alt="Relieve alegórico de las seis disciplinas de Casa Bernocchi"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#06111c_0%,rgba(6,17,28,.97)_23%,rgba(6,17,28,.76)_53%,rgba(6,17,28,.14)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#07131f_0%,transparent_36%)]" />

        <div className="relative mx-auto flex min-h-[72svh] max-w-7xl items-end px-6 py-16 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">
              Arquitectura de la Casa
            </p>
            <h1 className="mt-5 text-balance font-serif text-5xl font-light leading-[0.95] sm:text-6xl lg:text-8xl">
              Seis disciplinas.
              <span className="mt-2 block text-[#d8bd7a]">Un solo estándar.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
              Las Ordines organizan el conocimiento, la responsabilidad y la
              continuidad de Casa Bernocchi. Cada una declara qué hace, en qué
              estado se encuentra y qué controles preceden a su crecimiento.
            </p>
            <a
              href="#ordines"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#c9a85f] px-7 py-3.5 text-sm font-semibold text-[#07131f] transition hover:-translate-y-0.5 hover:bg-[#dfc47f]"
            >
              Conocer las Ordines <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="ordines" className="scroll-mt-24 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#c9a85f]">
                Portfolio institucional
              </p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">
                La ambición queda subordinada a la verdad operativa.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/56 lg:justify-self-end">
              Medicinae opera hoy. Iuris, Scientia e Innovatio están en
              desarrollo. Humanitatis y Capitalis permanecen planificadas. La
              Casa no presenta una intención futura como si ya fuese una
              capacidad disponible.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ordines.map((ordo, index) => (
              <article
                key={ordo.slug}
                className="group relative flex min-h-[25rem] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.032] p-7 transition duration-500 hover:-translate-y-1 hover:border-[#c9a85f]/55 hover:bg-white/[0.055]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[0.62rem] tracking-[0.2em] text-white/28">
                    0{index + 1}
                  </span>
                  <StatusBadge status={ordo.status} label={ordo.statusLabel} />
                </div>
                <p className="mt-12 text-[0.62rem] uppercase tracking-[0.22em] text-[#c9a85f]">
                  {ordo.order}
                </p>
                <h3 className="mt-4 font-serif text-3xl font-light text-white">
                  {ordo.institution}
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/52">
                  {ordo.summary}
                </p>
                <div className="mt-auto pt-8">
                  <Link
                    href={`/ordines/${ordo.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#d8bd7a] transition group-hover:gap-3 group-hover:text-[#ead49f]"
                  >
                    Ver mandato y alcance <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#9a7938]">
                Gobierno común
              </p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">
                Cada Ordo responde ante la Casa.
              </h2>
              <p className="mt-6 max-w-xl leading-8 text-[#07131f]/64">
                Identidad compartida no significa autonomía sin control. Toda
                iniciativa debe declarar autoridad, competencia, riesgos,
                fuentes y un criterio verificable de avance.
              </p>
              <Link
                href="/governance"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#07131f] px-6 py-3 text-sm font-semibold text-[#f3eee3] transition hover:-translate-y-0.5"
              >
                Ver gobernanza <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Scientia', 'Evidencia antes de afirmar.'],
                ['Integritas', 'Responsabilidad antes de crecer.'],
                ['Posteritas', 'Continuidad antes del ciclo corto.'],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#07131f]/10 bg-white/55 p-6"
                >
                  <ShieldCheck className="size-5 text-[#9a7938]" />
                  <h3 className="mt-8 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#07131f]/58">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
