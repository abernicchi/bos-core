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

const labels: Record<LocaleCode, {
  skip: string
  home: string
  menu: string
  close: string
  book: string
  navigation: { label: string; href: string }[]
}> = {
  es: {
    skip: 'Saltar al contenido', home: 'inicio', menu: 'Abrir menú', close: 'Cerrar menú', book: 'Solicitar cita',
    navigation: [
      { label: 'La Casa', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Fundador', href: '/founder' }, { label: 'Salud', href: '/health' },
      { label: 'Journal', href: '/journal' }, { label: 'Gobernanza', href: '/governance' },
      { label: 'Contacto', href: '/contact' },
    ],
  },
  en: {
    skip: 'Skip to content', home: 'home', menu: 'Open menu', close: 'Close menu', book: 'Request appointment',
    navigation: [
      { label: 'The House', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Founder', href: '/founder' }, { label: 'Health', href: '/health' },
      { label: 'Journal', href: '/journal' }, { label: 'Governance', href: '/governance' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  it: {
    skip: 'Vai al contenuto', home: 'home', menu: 'Apri menu', close: 'Chiudi menu', book: 'Richiedi appuntamento',
    navigation: [
      { label: 'La Casa', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Fondatore', href: '/founder' }, { label: 'Salute', href: '/health' },
      { label: 'Journal', href: '/journal' }, { label: 'Governance', href: '/governance' },
      { label: 'Contatti', href: '/contact' },
    ],
  },
  fr: {
    skip: 'Aller au contenu', home: 'accueil', menu: 'Ouvrir le menu', close: 'Fermer le menu', book: 'Demander un rendez-vous',
    navigation: [
      { label: 'La Maison', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Fondateur', href: '/founder' }, { label: 'Santé', href: '/health' },
      { label: 'Journal', href: '/journal' }, { label: 'Gouvernance', href: '/governance' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  de: {
    skip: 'Zum Inhalt', home: 'Startseite', menu: 'Menü öffnen', close: 'Menü schließen', book: 'Termin anfragen',
    navigation: [
      { label: 'Das Haus', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Gründer', href: '/founder' }, { label: 'Gesundheit', href: '/health' },
      { label: 'Journal', href: '/journal' }, { label: 'Governance', href: '/governance' },
      { label: 'Kontakt', href: '/contact' },
    ],
  },
  ca: {
    skip: 'Vés al contingut', home: 'inici', menu: 'Obre el menú', close: 'Tanca el menú', book: 'Sol·licitar cita',
    navigation: [
      { label: 'La Casa', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Fundador', href: '/founder' }, { label: 'Salut', href: '/health' },
      { label: 'Journal', href: '/journal' }, { label: 'Governança', href: '/governance' },
      { label: 'Contacte', href: '/contact' },
    ],
  },
  zh: {
    skip: '跳到内容', home: '主页', menu: '打开菜单', close: '关闭菜单', book: '申请预约',
    navigation: [
      { label: '家族机构', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: '创始人', href: '/founder' }, { label: '健康', href: '/health' },
      { label: '期刊', href: '/journal' }, { label: '治理', href: '/governance' },
      { label: '联系', href: '/contact' },
    ],
  },
  pl: {
    skip: 'Przejdź do treści', home: 'strona główna', menu: 'Otwórz menu', close: 'Zamknij menu', book: 'Poproś o wizytę',
    navigation: [
      { label: 'Dom', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Założyciel', href: '/founder' }, { label: 'Zdrowie', href: '/health' },
      { label: 'Journal', href: '/journal' }, { label: 'Ład', href: '/governance' },
      { label: 'Kontakt', href: '/contact' },
    ],
  },
  ru: {
    skip: 'Перейти к содержанию', home: 'главная', menu: 'Открыть меню', close: 'Закрыть меню', book: 'Запросить приём',
    navigation: [
      { label: 'Дом', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: 'Основатель', href: '/founder' }, { label: 'Здоровье', href: '/health' },
      { label: 'Журнал', href: '/journal' }, { label: 'Управление', href: '/governance' },
      { label: 'Контакты', href: '/contact' },
    ],
  },
  ja: {
    skip: 'コンテンツへ移動', home: 'ホーム', menu: 'メニューを開く', close: 'メニューを閉じる', book: '予約を申し込む',
    navigation: [
      { label: 'カーサ', href: '/casa' }, { label: 'Ordines', href: '/institutions' },
      { label: '創設者', href: '/founder' }, { label: 'ヘルス', href: '/health' },
      { label: 'ジャーナル', href: '/journal' }, { label: 'ガバナンス', href: '/governance' },
      { label: 'お問い合わせ', href: '/contact' },
    ],
  },
}

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [openForPath, setOpenForPath] = useState<string | null>(null)
  const { locale } = useCasaLocale()
  const copy = labels[locale]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const mobileOpen = openForPath === pathname

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-500',
        scrolled
          ? 'border-white/10 bg-[#06111c]/92 shadow-[0_12px_40px_rgba(0,0,0,.18)] backdrop-blur-2xl'
          : 'border-transparent bg-[#06111c]',
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-navy">
        {copy.skip}
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5 lg:px-10">
        <Link href="/" className="group flex items-center gap-3 focus-visible:outline-none" aria-label={`${site.name}, ${copy.home}`}>
          <Monogram className="size-10 rounded-full border border-gold/35 bg-white/5 text-gold shadow-[0_0_32px_rgba(185,151,82,.13)] transition group-hover:border-gold/70" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg tracking-[0.04em] text-[#f8f3e9]">{site.name}</span>
            <span className="mt-1 text-[0.56rem] uppercase tracking-[0.27em] text-white/45">Roma · 1893</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
          {copy.navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={cn('text-[0.76rem] font-medium tracking-wide transition hover:text-gold', active ? 'text-gold' : 'text-white/72')}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector className="hidden sm:block" />
          <Link href="/health#book" className="hidden rounded-full border border-gold/50 bg-gold px-5 py-2.5 text-xs font-semibold tracking-wide text-[#06111c] shadow-[0_8px_30px_rgba(185,151,82,.18)] transition hover:-translate-y-0.5 hover:bg-[#d8bd7a] md:inline-flex">
            {copy.book}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-gold/60 hover:text-gold xl:hidden"
            onClick={() => setOpenForPath((value) => value === pathname ? null : pathname)}
            aria-label={mobileOpen ? copy.close : copy.menu}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#06111c]/98 xl:hidden">
          <nav className="mx-auto max-w-7xl px-5 py-5" aria-label="Mobile navigation">
            <div className="grid gap-1 sm:grid-cols-2">
              {copy.navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpenForPath(null)} className="rounded-xl border border-transparent px-4 py-3 text-sm text-white/82 transition hover:border-gold/25 hover:bg-white/5 hover:text-gold">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <LanguageSelector />
              <Link href="/health#book" className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-[#06111c]">{copy.book}</Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
