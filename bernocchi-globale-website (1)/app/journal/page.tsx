import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Atom, BookOpen, ShieldCheck } from 'lucide-react'
import { scientificArticles } from '@/lib/journal'

export const metadata: Metadata = {
  title: 'Ordo Scientia Journal — Casa Bernocchi',
  description:
    'Publicaciones científicas y revisiones de evidencia de Ordo Scientia, el instituto de investigación y conocimiento verificable de Casa Bernocchi.',
  alternates: { canonical: '/journal' },
  openGraph: {
    title: 'Ordo Scientia Journal — Casa Bernocchi',
    description: 'Revisiones científicas, notas de evidencia y conocimiento interdisciplinario de Casa Bernocchi.',
    url: '/journal',
  },
}

export default function JournalPage() {
  return (
    <div className="bg-[#07131f] text-[#f7f1e6]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex items-center gap-3 text-[#c9a85f]">
            <Atom className="size-5" />
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">Ordo Scientia · Journal</p>
          </div>
          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-light leading-[.98] sm:text-6xl lg:text-7xl">Conocimiento sometido a evidencia, método y crítica.</h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
            El Journal de Casa Bernocchi publica revisiones clínicas, notas de evidencia y trabajos interdisciplinarios. Cada contribución declara su tipo, fuentes, fecha, límites y condición editorial.
          </p>
          <div className="mt-9 flex gap-3 rounded-2xl border border-[#c9a85f]/20 bg-[#c9a85f]/6 p-5 text-xs leading-6 text-white/48">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#c9a85f]" />
            <p>Las revisiones publicadas sintetizan literatura científica; no se presentan como investigación original ni sustituyen evaluación profesional individual.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#927331]">Publicaciones 2026</p>
              <h2 className="mt-4 font-serif text-4xl font-light sm:text-5xl">Primer cuaderno de medicina sexual.</h2>
            </div>
            <Link href="/ordines/scientia" className="inline-flex items-center gap-2 text-sm font-medium text-[#775c28]">Conocer Ordo Scientia <ArrowRight className="size-4" /></Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {scientificArticles.map((article) => (
              <article key={article.slug} className="flex flex-col rounded-[2rem] border border-[#07131f]/10 bg-white/55 p-8 shadow-[0_24px_80px_rgba(7,19,31,.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#927331]"><BookOpen className="size-4" />{article.category}</span>
                  <span className="text-[0.62rem] uppercase tracking-[0.14em] text-[#07131f]/40">{article.publicationType}</span>
                </div>
                <h3 className="mt-7 text-balance font-serif text-3xl font-light leading-tight">{article.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#07131f]/60">{article.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.keywords.slice(0, 4).map((keyword) => <span key={keyword} className="rounded-full border border-[#07131f]/10 px-3 py-1 text-[0.62rem] text-[#07131f]/52">{keyword}</span>)}
                </div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <span className="text-xs text-[#07131f]/40">{article.publishedAt} · {article.readingTime}</span>
                  <Link href={`/journal/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#775c28]">Leer revisión <ArrowRight className="size-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
