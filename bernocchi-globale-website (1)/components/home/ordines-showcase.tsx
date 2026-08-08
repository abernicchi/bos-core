'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useCasaLocale } from '@/components/use-casa-locale'
import { ordines } from '@/lib/ordines'
import type { LocaleCode } from '@/lib/i18n'

const copy: Record<LocaleCode, { eyebrow: string; title: string; body: string; all: string; enter: string }> = {
  es: { eyebrow: 'Las seis Ordines', title: 'Una Casa. Seis disciplinas. Un mismo gobierno.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis y Capitalis operan como unidades de una arquitectura común. Cada una declara su mandato, capacidad y límites.', all: 'Explorar las seis Ordines', enter: 'Entrar' },
  en: { eyebrow: 'The six Ordines', title: 'One House. Six disciplines. One system of governance.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis and Capitalis operate as units within one architecture. Each declares its mandate, capability and limits.', all: 'Explore the six Ordines', enter: 'Enter' },
  it: { eyebrow: 'Le sei Ordines', title: 'Una Casa. Sei discipline. Un unico governo.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis e Capitalis operano come unità di una sola architettura. Ognuna dichiara mandato, capacità e limiti.', all: 'Esplorare le sei Ordines', enter: 'Entrare' },
  fr: { eyebrow: 'Les six Ordines', title: 'Une Maison. Six disciplines. Une gouvernance commune.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis et Capitalis fonctionnent comme unités d’une architecture commune.', all: 'Explorer les six Ordines', enter: 'Entrer' },
  de: { eyebrow: 'Die sechs Ordines', title: 'Ein Haus. Sechs Disziplinen. Eine gemeinsame Governance.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis und Capitalis arbeiten als Einheiten einer gemeinsamen Architektur.', all: 'Die sechs Ordines erkunden', enter: 'Öffnen' },
  ca: { eyebrow: 'Les sis Ordines', title: 'Una Casa. Sis disciplines. Un mateix govern.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis i Capitalis operen com a unitats d’una arquitectura comuna.', all: 'Explorar les sis Ordines', enter: 'Entrar' },
  zh: { eyebrow: '六大 Ordines', title: '同一机构，六大领域，同一治理体系。', body: 'Medicinae、Iuris、Scientia、Innovatio、Humanitatis 与 Capitalis 作为同一机构架构下的六个运作单元。', all: '查看六大 Ordines', enter: '进入' },
  pl: { eyebrow: 'Sześć Ordines', title: 'Jeden Dom. Sześć dyscyplin. Jeden system zarządzania.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis i Capitalis działają jako jednostki jednej architektury.', all: 'Poznaj sześć Ordines', enter: 'Wejdź' },
  ru: { eyebrow: 'Шесть Ordines', title: 'Один Дом. Шесть дисциплин. Единая система управления.', body: 'Medicinae, Iuris, Scientia, Innovatio, Humanitatis и Capitalis действуют как подразделения единой архитектуры.', all: 'Изучить шесть Ordines', enter: 'Войти' },
  ja: { eyebrow: '六つの Ordines', title: '一つのカーサ。六つの分野。一つのガバナンス。', body: 'Medicinae、Iuris、Scientia、Innovatio、Humanitatis、Capitalis は共通の制度設計のもとで運営されます。', all: '六つの Ordines を見る', enter: '開く' },
}

export function OrdinesShowcase() {
  const { locale } = useCasaLocale()
  const t = copy[locale]

  return (
    <section className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#c9a85f]">{t.eyebrow}</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">{t.title}</h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-base leading-8 text-white/56">{t.body}</p>
            <Link href="/institutions" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#d8bd7a] transition hover:gap-3 hover:text-[#ead49f]">
              {t.all} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ordines.map((ordo, index) => (
            <Link key={ordo.slug} href={`/ordines/${ordo.slug}`} className="group rounded-3xl border border-white/10 bg-white/[0.028] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a85f]/50 hover:bg-white/[0.05]">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[0.58rem] tracking-[0.2em] text-white/26">0{index + 1}</span>
                <span className="rounded-full border border-[#c9a85f]/28 bg-[#c9a85f]/7 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.12em] text-[#d8bd7a]">Activa</span>
              </div>
              <p className="mt-10 text-[0.6rem] uppercase tracking-[0.2em] text-[#c9a85f]">{ordo.order}</p>
              <h3 className="mt-3 font-serif text-2xl font-light">{ordo.institution}</h3>
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/45">{ordo.summary}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-xs text-white/42 transition group-hover:text-[#d8bd7a]">
                {t.enter} <ArrowUpRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
