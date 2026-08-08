import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { ordines } from '@/lib/ordines'

export const metadata: Metadata = {
  title: 'Las seis Ordines — Casa Bernocchi',
  description:
    'Casa Bernocchi articula seis Ordines activas: Medicinae, Iuris, Scientia, Innovatio, Humanitatis y Capitalis, cada una con mandato, capacidades y límites declarados.',
  alternates: { canonical: '/institutions' },
}

export default function InstitutionsPage() {
  return (
    <div className="bg-[#07131f] text-[#f7f1e6]">
      <section className="relative isolate min-h-[70svh] overflow-hidden border-b border-white/10">
        <Image src="/images/ordines-relief.webp" alt="Arquitectura simbólica de las seis Ordines de Casa Bernocchi" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#06111c_0%,rgba(6,17,28,.97)_30%,rgba(6,17,28,.70)_66%,rgba(6,17,28,.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#07131f_0%,transparent_38%)]" />
        <div className="relative mx-auto flex min-h-[70svh] max-w-7xl items-end px-6 py-16 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Arquitectura institucional</p>
            <h1 className="mt-5 text-balance font-serif text-5xl font-light leading-[0.95] sm:text-6xl lg:text-8xl">
              Seis Ordines. Una sola Casa.
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-white/62 sm:text-lg">
              Casa Bernocchi no es una colección de marcas ni la extensión de una persona. Es una arquitectura de instituciones coordinadas bajo un mismo sistema de gobierno, evidencia, disciplina y continuidad.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#c9a85f]">Ordinamento</p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Cada disciplina tiene autonomía operativa. La Casa conserva el gobierno común.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/52 lg:justify-self-end">
              Todas las Ordines están institucionalmente activas. Cuando una actividad está regulada —clínica, jurídica, financiera o académica— la capacidad institucional no sustituye licencias, habilitaciones ni requisitos de jurisdicción.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ordines.map((ordo, index) => (
              <article key={ordo.slug} className="group flex min-h-[30rem] flex-col rounded-[2rem] border border-white/10 bg-white/[0.028] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c9a85f]/45 hover:bg-white/[0.045]">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[0.62rem] tracking-[0.2em] text-white/26">0{index + 1}</span>
                  <StatusBadge status={ordo.status} label={ordo.statusLabel} />
                </div>
                <p className="mt-10 text-[0.62rem] uppercase tracking-[0.22em] text-[#c9a85f]">{ordo.order}</p>
                <h3 className="mt-3 font-serif text-3xl font-light">{ordo.institution}</h3>
                <p className="mt-5 text-sm leading-7 text-white/52">{ordo.summary}</p>
                <div className="mt-7 space-y-3">
                  {ordo.capabilities.slice(0, 3).map((capability) => (
                    <div key={capability} className="flex gap-3 text-xs leading-6 text-white/40">
                      <ShieldCheck className="mt-1 size-3.5 shrink-0 text-[#c9a85f]" />
                      <span>{capability}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-8">
                  <Link href={`/ordines/${ordo.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#d8bd7a] transition group-hover:gap-3 group-hover:text-[#ead49f]">
                    Entrar en la Ordo <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#07131f]/10 bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#927331]">Gobierno de la Casa</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Un imperio institucional necesita reglas antes que ornamentación.</h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-[#07131f]/64">
              Las Ordines comparten identidad, archivo, tecnología, Segreteria Generale, control de riesgos y trazabilidad. Cada una desarrolla su propio conocimiento, operaciones, proyectos, activos, personas y métricas sin perder la coherencia del conjunto.
            </p>
            <Link href="/governance" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#07131f] px-7 py-3.5 text-sm font-semibold text-[#f3eee3] transition hover:-translate-y-0.5">
              Ver gobierno común <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
