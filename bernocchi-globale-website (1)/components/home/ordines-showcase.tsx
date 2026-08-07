'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useCasaLocale } from '@/components/use-casa-locale'
import { ordines } from '@/lib/ordines'
import type { LocaleCode } from '@/lib/i18n'

const copy: Record<LocaleCode, {
  eyebrow: string
  title: string
  body: string
  all: string
  enter: string
  status: Record<'operating' | 'development' | 'planned' | 'future', string>
}> = {
  es: { eyebrow: 'Las seis Ordines', title: 'Una Casa. Seis disciplinas. Estados declarados.', body: 'Cada Ordo tiene mandato, controles y un grado de desarrollo visible. Solo Medicinae presenta hoy un recorrido de servicio operativo.', all: 'Explorar la arquitectura completa', enter: 'Conocer', status: { operating: 'Operativa', development: 'En desarrollo', planned: 'Planificada', future: 'Futura' } },
  en: { eyebrow: 'The six Ordines', title: 'One House. Six disciplines. Declared status.', body: 'Each Ordo has a mandate, controls and a visible stage of development. Only Medicinae currently presents an operating service path.', all: 'Explore the complete architecture', enter: 'Discover', status: { operating: 'Operating', development: 'In development', planned: 'Planned', future: 'Future' } },
  it: { eyebrow: 'Le sei Ordines', title: 'Una Casa. Sei discipline. Stati dichiarati.', body: 'Ogni Ordo ha un mandato, controlli e uno stadio di sviluppo visibile. Oggi solo Medicinae presenta un percorso operativo.', all: 'Esplorare l’architettura completa', enter: 'Conoscere', status: { operating: 'Operativa', development: 'In sviluppo', planned: 'Pianificata', future: 'Futura' } },
  fr: { eyebrow: 'Les six Ordines', title: 'Une Maison. Six disciplines. Des statuts déclarés.', body: 'Chaque Ordo possède un mandat, des contrôles et un stade visible. Seule Medicinae offre actuellement un parcours opérationnel.', all: 'Explorer l’architecture complète', enter: 'Découvrir', status: { operating: 'Opérationnelle', development: 'En développement', planned: 'Planifiée', future: 'Future' } },
  de: { eyebrow: 'Die sechs Ordines', title: 'Ein Haus. Sechs Disziplinen. Klare Statusangaben.', body: 'Jede Ordo hat Auftrag, Kontrollen und eine sichtbare Entwicklungsstufe. Nur Medicinae bietet derzeit einen operativen Weg.', all: 'Gesamte Architektur ansehen', enter: 'Entdecken', status: { operating: 'In Betrieb', development: 'In Entwicklung', planned: 'Geplant', future: 'Zukünftig' } },
  ca: { eyebrow: 'Les sis Ordines', title: 'Una Casa. Sis disciplines. Estats declarats.', body: 'Cada Ordo té mandat, controls i una fase visible. Només Medicinae presenta avui un recorregut operatiu.', all: 'Explorar l’arquitectura completa', enter: 'Conèixer', status: { operating: 'Operativa', development: 'En desenvolupament', planned: 'Planificada', future: 'Futura' } },
  zh: { eyebrow: '六大 Ordines', title: '同一机构，六门学科，状态透明。', body: '每个 Ordo 均公开使命、控制机制与发展阶段。目前仅 Medicinae 提供实际服务路径。', all: '查看完整架构', enter: '了解', status: { operating: '运营中', development: '开发中', planned: '规划中', future: '未来' } },
  pl: { eyebrow: 'Sześć Ordines', title: 'Jeden Dom. Sześć dyscyplin. Jawny status.', body: 'Każda Ordo ma mandat, kontrole i widoczny etap rozwoju. Tylko Medicinae oferuje dziś działającą ścieżkę usług.', all: 'Zobacz pełną architekturę', enter: 'Poznaj', status: { operating: 'Działa', development: 'W rozwoju', planned: 'Planowana', future: 'Przyszła' } },
  ru: { eyebrow: 'Шесть Ordines', title: 'Один Дом. Шесть дисциплин. Прозрачный статус.', body: 'Каждая Ordo имеет мандат, контроль и открытый этап развития. Сегодня только Medicinae предлагает действующий путь услуг.', all: 'Изучить полную архитектуру', enter: 'Узнать', status: { operating: 'Действует', development: 'В разработке', planned: 'Запланирована', future: 'Будущая' } },
  ja: { eyebrow: '六つの Ordines', title: '一つのカーサ。六つの分野。明確な進捗。', body: '各 Ordo は使命、統制、開発段階を公開します。現在、運用サービスを提供するのは Medicinae のみです。', all: '全体構造を見る', enter: '詳しく見る', status: { operating: '運用中', development: '開発中', planned: '計画中', future: '将来' } },
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
            <Link
              key={ordo.slug}
              href={`/ordines/${ordo.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.028] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a85f]/50 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[0.58rem] tracking-[0.2em] text-white/26">0{index + 1}</span>
                <span className="rounded-full border border-[#c9a85f]/24 bg-[#c9a85f]/6 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.14em] text-[#d8bd7a]">{t.status[ordo.status]}</span>
              </div>
              <p className="mt-10 text-[0.6rem] uppercase tracking-[0.2em] text-[#c9a85f]">{ordo.order}</p>
              <h3 className="mt-3 font-serif text-2xl font-light">{ordo.institution}</h3>
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
