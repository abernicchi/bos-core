'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useCasaLocale } from '@/components/use-casa-locale'
import { ordines } from '@/lib/ordines'
import type { LocaleCode } from '@/lib/i18n'

const copy: Record<LocaleCode, {
  eyebrow: string
  title: string
  body: string
  active: string
  enter: string
  roadmap: string
  roadmapNote: string
  all: string
  status: Record<'operating' | 'development' | 'planned' | 'future', string>
}> = {
  es: { eyebrow: 'Arquitectura institucional', title: 'Una operación real. Una hoja de ruta clara.', body: 'La Casa da protagonismo público a lo que ya puede ejecutar. Las demás Ordines permanecen visibles como arquitectura futura, no como servicios abiertos.', active: 'Institución operativa', enter: 'Entrar a Bernocchi Health', roadmap: 'Roadmap', roadmapNote: 'Las demás Ordines están en desarrollo o planificación y no se presentan como servicios activos.', all: 'Ver arquitectura institucional', status: { operating: 'Operativa', development: 'En desarrollo', planned: 'Planificada', future: 'Futura' } },
  en: { eyebrow: 'Institutional architecture', title: 'One real operation. One clear roadmap.', body: 'The House gives public prominence to what it can already execute. The remaining Ordines stay visible as future architecture, not as open services.', active: 'Operating institution', enter: 'Enter Bernocchi Health', roadmap: 'Roadmap', roadmapNote: 'The remaining Ordines are in development or planning and are not presented as active services.', all: 'View institutional architecture', status: { operating: 'Operating', development: 'In development', planned: 'Planned', future: 'Future' } },
  it: { eyebrow: 'Architettura istituzionale', title: 'Una realtà operativa. Una roadmap chiara.', body: 'La Casa dà visibilità pubblica a ciò che può già eseguire. Le altre Ordines restano come architettura futura, non come servizi aperti.', active: 'Istituzione operativa', enter: 'Entrare in Bernocchi Health', roadmap: 'Roadmap', roadmapNote: 'Le altre Ordines sono in sviluppo o pianificazione e non vengono presentate come servizi attivi.', all: 'Vedere l’architettura istituzionale', status: { operating: 'Operativa', development: 'In sviluppo', planned: 'Pianificata', future: 'Futura' } },
  fr: { eyebrow: 'Architecture institutionnelle', title: 'Une activité réelle. Une feuille de route claire.', body: 'La Maison met en avant ce qu’elle peut déjà exécuter. Les autres Ordines restent une architecture future et non des services ouverts.', active: 'Institution opérationnelle', enter: 'Entrer dans Bernocchi Health', roadmap: 'Feuille de route', roadmapNote: 'Les autres Ordines sont en développement ou en planification et ne sont pas présentées comme des services actifs.', all: 'Voir l’architecture institutionnelle', status: { operating: 'Opérationnelle', development: 'En développement', planned: 'Planifiée', future: 'Future' } },
  de: { eyebrow: 'Institutionelle Architektur', title: 'Ein realer Betrieb. Eine klare Roadmap.', body: 'Das Haus stellt öffentlich in den Vordergrund, was es bereits ausführen kann. Die übrigen Ordines bleiben Zukunftsarchitektur und keine offenen Dienstleistungen.', active: 'Operative Institution', enter: 'Zu Bernocchi Health', roadmap: 'Roadmap', roadmapNote: 'Die übrigen Ordines befinden sich in Entwicklung oder Planung und werden nicht als aktive Leistungen dargestellt.', all: 'Institutionelle Architektur ansehen', status: { operating: 'In Betrieb', development: 'In Entwicklung', planned: 'Geplant', future: 'Zukünftig' } },
  ca: { eyebrow: 'Arquitectura institucional', title: 'Una operació real. Un full de ruta clar.', body: 'La Casa dona protagonisme públic a allò que ja pot executar. Les altres Ordines resten com a arquitectura futura, no com a serveis oberts.', active: 'Institució operativa', enter: 'Entrar a Bernocchi Health', roadmap: 'Full de ruta', roadmapNote: 'Les altres Ordines estan en desenvolupament o planificació i no es presenten com a serveis actius.', all: 'Veure l’arquitectura institucional', status: { operating: 'Operativa', development: 'En desenvolupament', planned: 'Planificada', future: 'Futura' } },
  zh: { eyebrow: '机构架构', title: '一个真实运营主体，一条清晰路线图。', body: '机构只突出已经能够真实交付的业务。其余 Ordines 作为未来架构展示，而不是对外开放的服务。', active: '运营机构', enter: '进入 Bernocchi Health', roadmap: '路线图', roadmapNote: '其余 Ordines 仍处于开发或规划阶段，不作为现行服务展示。', all: '查看机构架构', status: { operating: '运营中', development: '开发中', planned: '规划中', future: '未来' } },
  pl: { eyebrow: 'Architektura instytucjonalna', title: 'Jedna realna działalność. Jedna jasna mapa rozwoju.', body: 'Dom publicznie eksponuje to, co już potrafi realizować. Pozostałe Ordines pozostają architekturą przyszłości, a nie otwartymi usługami.', active: 'Działająca instytucja', enter: 'Wejdź do Bernocchi Health', roadmap: 'Mapa rozwoju', roadmapNote: 'Pozostałe Ordines są w rozwoju lub planowaniu i nie są przedstawiane jako aktywne usługi.', all: 'Zobacz architekturę instytucjonalną', status: { operating: 'Działa', development: 'W rozwoju', planned: 'Planowana', future: 'Przyszła' } },
  ru: { eyebrow: 'Институциональная архитектура', title: 'Одна реальная операция. Одна ясная дорожная карта.', body: 'Дом публично выделяет то, что уже может реально выполнять. Остальные Ordines остаются архитектурой будущего, а не открытыми услугами.', active: 'Действующая институция', enter: 'Перейти в Bernocchi Health', roadmap: 'Дорожная карта', roadmapNote: 'Остальные Ordines находятся в разработке или планировании и не представлены как активные услуги.', all: 'Смотреть институциональную архитектуру', status: { operating: 'Действует', development: 'В разработке', planned: 'Запланирована', future: 'Будущая' } },
  ja: { eyebrow: '組織アーキテクチャ', title: '一つの実運用。一つの明確なロードマップ。', body: 'カーサは、すでに実行できるものを公開の中心に置きます。その他の Ordines は将来設計として示し、提供中のサービスとは扱いません。', active: '運用中の機関', enter: 'Bernocchi Health へ', roadmap: 'ロードマップ', roadmapNote: 'その他の Ordines は開発・計画段階にあり、現行サービスとしては公開していません。', all: '組織アーキテクチャを見る', status: { operating: '運用中', development: '開発中', planned: '計画中', future: '将来' } },
}

export function OrdinesShowcase() {
  const { locale } = useCasaLocale()
  const t = copy[locale]
  const operating = ordines.find((ordo) => ordo.status === 'operating')
  const roadmap = ordines.filter((ordo) => ordo.status !== 'operating')

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

        {operating ? (
          <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <article className="rounded-[2rem] border border-[#c9a85f]/28 bg-[#c9a85f]/7 p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#c9a85f]">{t.active}</p>
                <span className="rounded-full border border-[#c9a85f]/24 bg-[#c9a85f]/6 px-3 py-1 text-[0.56rem] uppercase tracking-[0.14em] text-[#d8bd7a]">{t.status[operating.status]}</span>
              </div>
              <p className="mt-9 text-[0.62rem] uppercase tracking-[0.2em] text-[#c9a85f]">{operating.order}</p>
              <h3 className="mt-3 font-serif text-4xl font-light">{operating.institution}</h3>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/52">{operating.summary}</p>
              <Link href="/health" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c9a85f] px-6 py-3 text-sm font-semibold text-[#07131f] transition hover:-translate-y-0.5 hover:bg-[#dfc47f]">
                {t.enter} <ArrowRight className="size-4" />
              </Link>
            </article>

            <aside className="rounded-[2rem] border border-white/10 bg-white/[0.028] p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-[#c9a85f]" />
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#c9a85f]">{t.roadmap}</p>
              </div>
              <p className="mt-5 text-sm leading-7 text-white/48">{t.roadmapNote}</p>
              <div className="mt-7 space-y-3">
                {roadmap.map((ordo) => (
                  <div key={ordo.slug} className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                    <div>
                      <p className="font-serif text-lg">{ordo.order}</p>
                      <p className="mt-1 text-[0.58rem] uppercase tracking-[0.16em] text-white/28">{ordo.institution}</p>
                    </div>
                    <span className="text-[0.56rem] uppercase tracking-[0.12em] text-[#d8bd7a]">{t.status[ordo.status]}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </section>
  )
}
