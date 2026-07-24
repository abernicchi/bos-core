'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { navigation, site } from '@/lib/content'
import { Monogram } from '@/components/monogram'
import { LanguageSelector } from '@/components/language-selector'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'border-border bg-background/90 backdrop-blur-md'
          : 'border-transparent bg-background',
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none"
          aria-label={`${site.name}, home`}
        >
          <Monogram className="size-9 rounded-sm text-gold" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg tracking-wide text-foreground">
              {site.name}
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
              {site.legalName}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm transition-colors hover:text-gold',
                  active ? 'text-gold' : 'text-foreground/80',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSelector className="hidden sm:block" />
          <Link
            href="/health#book"
            className="hidden rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-gold/90 md:inline-flex"
          >
            Book a Consultation
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-sm border border-border text-foreground lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col px-6 py-4"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-border/60 py-3 text-base text-foreground last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4">
              <LanguageSelector />
              <Link
                href="/health#book"
                className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy"
              >
                Book a Consultation
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
