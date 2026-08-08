'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { site } from '@/lib/content'
import { Monogram } from '@/components/monogram'
import { LanguageSelector } from '@/components/language-selector'
import { useCasaLocale } from '@/components/use-casa-locale'
import { cn } from '@/lib/utils'
import type { LocaleCode } from '@/lib/i18n'

type NavItem = { label: string; href: string }
type HeaderCopy = {
  skip: string
  home: string
  menu: string
  close: string
  ordines: string
  navigation: NavItem[]
  healthNavigation: NavItem[]
  book: string
}

const labels: Record<LocaleCode, HeaderCopy> = {
  es: {
    skip: 'Saltar al contenido', home: 'inicio', menu: 'Abrir menú', close: 'Cerrar menú', ordines: 'Las seis Ordines', book: 'Agendar consulta',
    navigation: [
      { label: 'La Casa', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Gobernanza', href: '/governance' },
      { label: 'Fundador', href: '/founder' }, { label: 'Contacto', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Servicios', href: '#services' }, { label: 'Profesional', href: '#professional' },
      { label: 'Proceso', href: '#process' }, { label: 'Tarifas', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  en: {
    skip: 'Skip to content', home: 'home', menu: 'Open menu', close: 'Close menu', ordines: 'The six Ordines', book: 'Book consultation',
    navigation: [
      { label: 'The House', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Governance', href: '/governance' },
      { label: 'Founder', href: '/founder' }, { label: 'Contact', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Services', href: '#services' }, { label: 'Professional', href: '#professional' },
      { label: 'Process', href: '#process' }, { label: 'Fees', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  it: {
    skip: 'Vai al contenuto', home: 'home', menu: 'Apri menu', close: 'Chiudi menu', ordines: 'Le sei Ordines', book: 'Prenota consulenza',
    navigation: [
      { label: 'La Casa', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Governance', href: '/governance' },
      { label: 'Fondatore', href: '/founder' }, { label: 'Contatti', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Servizi', href: '#services' }, { label: 'Professionista', href: '#professional' },
      { label: 'Percorso', href: '#process' }, { label: 'Tariffe', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  fr: {
    skip: 'Aller au contenu', home: 'accueil', menu: 'Ouvrir le menu', close: 'Fermer le menu', ordines: 'Les six Ordines', book: 'Réserver une consultation',
    navigation: [
      { label: 'La Maison', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Gouvernance', href: '/governance' },
      { label: 'Fondateur', href: '/founder' }, { label: 'Contact', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Services', href: '#services' }, { label: 'Professionnel', href: '#professional' },
      { label: 'Parcours', href: '#process' }, { label: 'Tarifs', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  de: {
    skip: 'Zum Inhalt', home: 'Startseite', menu: 'Menü öffnen', close: 'Menü schließen', ordines: 'Die sechs Ordines', book: 'Beratung buchen',
    navigation: [
      { label: 'Das Haus', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Governance', href: '/governance' },
      { label: 'Gründer', href: '/founder' }, { label: 'Kontakt', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Leistungen', href: '#services' }, { label: 'Behandler', href: '#professional' },
      { label: 'Ablauf', href: '#process' }, { label: 'Honorare', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  ca: {
    skip: 'Vés al contingut', home: 'inici', menu: 'Obre el menú', close: 'Tanca el menú', ordines: 'Les sis Ordines', book: 'Reservar consulta',
    navigation: [
      { label: 'La Casa', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Governança', href: '/governance' },
      { label: 'Fundador', href: '/founder' }, { label: 'Contacte', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Serveis', href: '#services' }, { label: 'Professional', href: '#professional' },
      { label: 'Procés', href: '#process' }, { label: 'Tarifes', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  zh: {
    skip: '跳到内容', home: '主页', menu: '打开菜单', close: '关闭菜单', ordines: '六大 Ordines', book: '预约咨询',
    navigation: [
      { label: '家族机构', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: '治理', href: '/governance' },
      { label: '创始人', href: '/founder' }, { label: '联系', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: '服务', href: '#services' }, { label: '专业团队', href: '#professional' },
      { label: '流程', href: '#process' }, { label: '费用', href: '#fees' }, { label: '常见问题', href: '#faq' },
    ],
  },
  pl: {
    skip: 'Przejdź do treści', home: 'strona główna', menu: 'Otwórz menu', close: 'Zamknij menu', ordines: 'Sześć Ordines', book: 'Umów konsultację',
    navigation: [
      { label: 'Dom', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Ład', href: '/governance' },
      { label: 'Założyciel', href: '/founder' }, { label: 'Kontakt', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Usługi', href: '#services' }, { label: 'Specjalista', href: '#professional' },
      { label: 'Proces', href: '#process' }, { label: 'Cennik', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  ru: {
    skip: 'Перейти к содержанию', home: 'главная', menu: 'Открыть меню', close: 'Закрыть меню', ordines: 'Шесть Ordines', book: 'Записаться на консультацию',
    navigation: [
      { label: 'Дом', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'Управление', href: '/governance' },
      { label: 'Основатель', href: '/founder' }, { label: 'Контакты', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'Услуги', href: '#services' }, { label: 'Специалист', href: '#professional' },
      { label: 'Процесс', href: '#process' }, { label: 'Стоимость', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
  ja: {
    skip: 'コンテンツへ移動', home: 'ホーム', menu: 'メニューを開く', close: '閉じる', ordines: '六つの Ordines', book: '相談を予約',
    navigation: [
      { label: 'カーサ', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Scientia · Journal', href: '/journal' }, { label: 'ガバナンス', href: '/governance' },
      { label: '創設者', href: '/founder' }, { label: 'お問い合わせ', href: '/contact' },
    ],
    healthNavigation: [
      { label: 'Casa Bernocchi', href: '/' }, { label: 'Ordo Medicinae', href: '/ordines/medicinae' },
      { label: 'サービス', href: '#services' }, { label: '専門家', href: '#professional' },
      { label: '流れ', href: '#process' }, { label: '料金', href: '#fees' }, { label: 'FAQ', href: '#faq' },
    ],
  },
}

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [openForPath, setOpenForPath] = useState<string | null>(null)
  const { locale } = useCasaLocale()
  const copy = labels[locale]
  const isHealth = pathname === '/health' || pathname.startsWith('/health/')
  const navigation = isHealth ? copy.healthNavigation : copy.navigation
  const ctaHref = isHealth ? '#book' : '/institutions'
  const ctaLabel = isHealth ? copy.book : copy.ordines
  const brandHref = isHealth ? '/health' : '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const mobileOpen = openForPath === pathname

  return (
    <header className={cn('sticky top-0 z-50 border-b transition-all duration-500', scrolled ? 'border-white/10 bg-[#06111c]/92 shadow-[0_12px_40px_rgba(0,0,0,.18)] backdrop-blur-2xl' : 'border-transparent bg-[#06111c]')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-navy">{copy.skip}</a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5 lg:px-10">
        <Link href={brandHref} className="group flex items-center gap-3 focus-visible:outline-none" aria-label={`${site.name}, ${copy.home}`}>
          <Monogram className="size-10 rounded-full border border-gold/35 bg-white/5 text-gold shadow-[0_0_32px_rgba(185,151,82,.13)] transition group-hover:border-gold/70" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg tracking-[0.04em] text-[#f8f3e9]">{isHealth ? 'Bernocchi Health' : site.name}</span>
            <span className="mt-1 text-[0.56rem] uppercase tracking-[0.27em] text-white/45">{isHealth ? 'Ordo Medicinae' : 'Scientia · Honor · Disciplina · Legato'}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const anchor = item.href.startsWith('#')
            const active = !anchor && (pathname === item.href || pathname.startsWith(`${item.href}/`))
            return <Link key={item.href} href={item.href} className={cn('text-[0.76rem] font-medium tracking-wide transition hover:text-gold', active ? 'text-gold' : 'text-white/72')}>{item.label}</Link>
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector className="hidden sm:block" />
          <Link href={ctaHref} className="hidden rounded-full border border-gold/50 bg-gold px-5 py-2.5 text-xs font-semibold tracking-wide text-[#06111c] shadow-[0_8px_30px_rgba(185,151,82,.18)] transition hover:-translate-y-0.5 hover:bg-[#d8bd7a] md:inline-flex">{ctaLabel}</Link>
          <button type="button" className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-gold/60 hover:text-gold xl:hidden" onClick={() => setOpenForPath((value) => value === pathname ? null : pathname)} aria-label={mobileOpen ? copy.close : copy.menu} aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#06111c]/98 xl:hidden">
          <nav className="mx-auto max-w-7xl px-5 py-5" aria-label="Mobile navigation">
            <div className="grid gap-1 sm:grid-cols-2">
              {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpenForPath(null)} className="rounded-xl border border-transparent px-4 py-3 text-sm text-white/82 transition hover:border-gold/25 hover:bg-white/5 hover:text-gold">{item.label}</Link>)}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <LanguageSelector />
              <Link href={ctaHref} className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-[#06111c]">{ctaLabel}</Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
