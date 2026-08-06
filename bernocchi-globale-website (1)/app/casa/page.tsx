import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, Globe2, Landmark, ShieldCheck } from 'lucide-react'
import { InstitutionsList } from '@/components/institutions-list'
import { principles, site } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Casa Bernocchi — Roma 1893 · Historia y arquitectura institucional',
  description:
    'Historia institucional de Casa Bernocchi: origen en Roma en 1893, apertura regional en Costa Rica en 2024 y desarrollo internacional con estatus declarado.',
  alternates: { canonical: '/casa' },
}

const timeline = [
  {
    year: '1893',
    place: 'Roma, Italia',
    flag: '🇮🇹',
    title: 'Fundación histórica',
    body: 'Casa Bernocchi sitúa su origen institucional en Roma, Italia, en 1893. Esta fecha constituye el punto de partida de su memoria, su tradición y su vocación de permanencia.',
  },
  {
    year: '2024',
    place: 'Costa Rica',
    flag: '🇨🇷',
    title: 'Apertura regional',
    body: 'En 2024 se abre la operación regional en Costa Rica, desde la cual comienza la etapa contemporánea de desarrollo institucional y prestación profesional.',
  },
  {
    year: 'Presente',
    place: 'Europa y mercados internacionales',
    flag: '🇪🇺',
    title: 'Construcción internacional',
    body: 'La Casa desarrolla centros de coordinación y mercados estratégicos con estatus público y verificable, sin confundir proyección comercial con oficinas físicas aún no abiertas.',
  },
]

export default function CasaPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <Image
          src="/images/library.png"
          alt="Biblioteca institucional de Casa Bernocchi"
          fill
          priority
          className="object-cover opacity-28"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07131f_5%,rgba(7,19,31,.94)_52%,rgba(7,19,31,.68))]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">
            La Casa · Roma 1893
          </p>
          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-light leading-[.98] sm:text-6xl lg:text-7xl">
            Una institución italiana construida para trascender generaciones.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
            {site.positioning} La memoria histórica, la gobernanza contemporánea
            y la ejecución internacional se integran bajo un mismo sistema de
            conocimiento, honor, disciplina y legado.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-[0.66rem] uppercase tracking-[0.2em] text-white/48">
            <span className="rounded-full border border-white/15 px-4 py-2">🇮🇹 Roma · 1893</span>
            <span className="rounded-full border border-white/15 px-4 py-2">🇨🇷 Costa Rica · 2024</span>
            <span className="rounded-full border border-[#c9a85f]/35 px-4 py-2 text-[#d8bd7a]">🇪🇺 Orientación europea</span>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#f3eee3]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Historia institucional</p>
          <h2 className="mt-5 max-w-3xl text-balance font-serif text-4xl font-light leading-tight text-[#07131f] sm:text-5xl">
            El origen se conserva. La estructura evoluciona.
          </h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {timeline.map((item) => (
              <article key={item.year} className="rounded-3xl border border-[#07131f]/10 bg-white/55 p-7 shadow-[0_20px_70px_rgba(7,19,31,.05)]">
                <div className="flex items-center justify-between">
                  <Landmark className="size-5 text-[#a3823e]" />
                  <span className="text-2xl" aria-hidden="true">{item.flag}</span>
                </div>
                <p className="mt-8 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#a3823e]">{item.place}</p>
                <h3 className="mt-2 font-serif text-3xl text-[#07131f]">{item.year}</h3>
                <p className="mt-3 font-serif text-xl text-[#07131f]">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-[#07131f]/58">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex gap-3 rounded-2xl border border-[#a3823e]/20 bg-[#a3823e]/6 p-5 text-xs leading-6 text-[#07131f]/58">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#a3823e]" />
            <p>
              La fecha de 1893 se presenta como historia institucional declarada por Casa Bernocchi. Su archivo probatorio y genealogía documental deberán preservarse para respaldar públicamente esta afirmación cuando sea requerido.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Misión y visión</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Gobernar instituciones, no improvisar marcas.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
              <h3 className="font-serif text-2xl">Misión</h3>
              <p className="mt-4 text-sm leading-7 text-white/56">{site.mission}</p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
              <h3 className="font-serif text-2xl">Visión</h3>
              <p className="mt-4 text-sm leading-7 text-white/56">{site.vision}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#f7f3ea]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Principios fundacionales</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[#07131f]/10 bg-[#07131f]/10 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="bg-[#f7f3ea] p-8">
                <h3 className="font-serif text-3xl text-[#07131f]">{principle.title}</h3>
                <p className="mt-2 text-[0.64rem] uppercase tracking-[0.2em] text-[#a3823e]">{principle.subtitle}</p>
                <p className="mt-5 text-sm leading-7 text-[#07131f]/58">{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0a1927] text-[#f7f1e6]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Instituciones</p>
              <h2 className="mt-5 max-w-3xl text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Una Casa. Varias órdenes. Un solo estándar.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/52">
              Cada institución especializada mantiene un estado operativo declarado. La expansión se comunica con precisión, no mediante afirmaciones anticipadas.
            </p>
          </div>
          <div className="mt-12 rounded-3xl border border-white/10 bg-[#f7f3ea] p-2 text-[#07131f]">
            <InstitutionsList />
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-24">
          <div>
            <div className="flex items-center gap-3"><Globe2 className="size-5 text-[#a3823e]" /><p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Vocación internacional</p></div>
            <h2 className="mt-5 max-w-3xl text-balance font-serif text-4xl font-light leading-tight">Roma como origen. Costa Rica como operación. El mundo como horizonte.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/health#book" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#07131f] px-7 py-3.5 text-sm font-semibold text-[#f3eee3] transition hover:-translate-y-1">Solicitar cita<ArrowRight className="size-4" /></Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#07131f]/20 px-7 py-3.5 text-sm font-medium transition hover:border-[#a3823e] hover:text-[#8b6d31]">Contactar la Segreteria<Building2 className="size-4" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
