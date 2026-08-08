import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { ordines } from '@/lib/ordines'

export const metadata: Metadata = {
  title: 'Arquitectura institucional de Casa Bernocchi',
  description:
    'Bernocchi Health opera hoy. Las demás Ordines permanecen en desarrollo o planificación y se presentan como hoja de ruta institucional, no como servicios activos.',
  alternates: { canonical: '/institutions' },
}

export default function InstitutionsPage() {
  const operating = ordines.find((ordo) => ordo.status === 'operating')
  const roadmap = ordines.filter((ordo) => ordo.status !== 'operating')

  return (
    <div className="bg-[#07131f] text-[#f7f1e6]">
      <section className="relative isolate min-h-[66svh] overflow-hidden border-b border-white/10">
        <Image
          src="/images/ordines-relief.webp"
          alt="Arquitectura simbólica de las disciplinas de Casa Bernocchi"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#06111c_0%,rgba(6,17,28,.97)_34%,rgba(6,17,28,.72)_67%,rgba(6,17,28,.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#07131f_0%,transparent_36%)]" />
        <div className="relative mx-auto flex min-h-[66svh] max-w-7xl items-end px-6 py-16 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Arquitectura institucional</p>
            <h1 className="mt-5 text-balance font-serif text-5xl font-light leading-[0.95] sm:text-6xl lg:text-7xl">
              Una institución operativa. Una hoja de ruta disciplinada.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Casa Bernocchi distingue con claridad entre lo que ya presta servicios y lo que aún está en construcción. La ambición no se presenta como capacidad disponible.
            </p>
          </div>
        </div>
      </section>

      {operating ? (
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#c9a85f]">Operación actual</p>
                <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Primero demostrar. Después expandir.</h2>
                <p className="mt-6 text-base leading-8 text-white/54">
                  El foco público y comercial de la Casa se concentra en la institución que hoy puede ofrecer una experiencia real y medible.
                </p>
              </div>

              <article className="rounded-[2rem] border border-[#c9a85f]/28 bg-[#c9a85f]/7 p-8 shadow-[0_30px_100px_rgba(0,0,0,.2)] sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#c9a85f]">{operating.order}</p>
                    <h3 className="mt-3 font-serif text-4xl font-light">{operating.institution}</h3>
                  </div>
                  <StatusBadge status={operating.status} label={operating.statusLabel} />
                </div>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/62">{operating.summary}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/health" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a85f] px-7 py-3.5 text-sm font-semibold text-[#07131f] transition hover:-translate-y-0.5 hover:bg-[#dfc47f]">
                    Entrar a Bernocchi Health <ArrowRight className="size-4" />
                  </Link>
                  <Link href="/health#book" className="inline-flex items-center justify-center rounded-full border border-white/18 px-7 py-3.5 text-sm font-medium text-white/78 transition hover:border-[#c9a85f]/55 hover:text-[#d8bd7a]">
                    Solicitar consulta
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-white/10 bg-[#091724]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#c9a85f]">Roadmap institucional</p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Lo futuro permanece futuro hasta superar sus controles de entrada.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/52 lg:justify-self-end">
              Estas Ordines expresan la arquitectura prevista de la Casa. No se presentan como unidades abiertas al público ni como capacidades comerciales activas.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10">
            {roadmap.map((ordo, index) => (
              <div key={ordo.slug} className="grid gap-4 border-b border-white/10 bg-white/[0.025] p-6 last:border-b-0 sm:grid-cols-[auto_1fr_auto] sm:items-center lg:px-8">
                <span className="font-mono text-[0.62rem] tracking-[0.2em] text-white/24">0{index + 2}</span>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#c9a85f]">{ordo.order}</p>
                  <h3 className="mt-2 font-serif text-2xl">{ordo.institution}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">{ordo.summary}</p>
                </div>
                <StatusBadge status={ordo.status} label={ordo.statusLabel} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3 rounded-2xl border border-[#c9a85f]/20 bg-[#c9a85f]/6 p-5 text-xs leading-6 text-white/46">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#c9a85f]" />
            <p>
              La publicación de una nueva Ordo como servicio operativo exige alcance definido, responsable identificado, controles regulatorios aplicables, capacidad real de prestación y una ruta de atención verificable.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-24">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#9a7938]">Gobierno común</p>
            <h2 className="mt-5 max-w-3xl text-balance font-serif text-4xl font-light leading-tight">Cada expansión responde primero ante la Casa.</h2>
          </div>
          <Link href="/governance" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#07131f] px-7 py-3.5 text-sm font-semibold text-[#f3eee3] transition hover:-translate-y-0.5">
            Ver gobernanza <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
