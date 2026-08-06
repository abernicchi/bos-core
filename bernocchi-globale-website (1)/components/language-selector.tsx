'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe2 } from 'lucide-react'
import { casaLocales } from '@/lib/i18n'
import { useCasaLocale } from '@/components/use-casa-locale'
import { cn } from '@/lib/utils'

const copy = {
  es: 'Idioma', en: 'Language', it: 'Lingua', fr: 'Langue', de: 'Sprache',
  ca: 'Idioma', zh: '语言', pl: 'Język', ru: 'Язык', ja: '言語',
} as const

export function LanguageSelector({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { locale, changeLocale } = useCasaLocale()
  const active = casaLocales.find((item) => item.value === locale) ?? casaLocales[0]

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div ref={menuRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={copy[locale]}
        className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-xl transition hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
      >
        <Globe2 className="size-3.5" />
        <span aria-hidden="true">{active.flag}</span>
        <span className="uppercase tracking-[0.14em]">{active.value}</span>
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <div className="absolute right-0 z-[90] mt-3 w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#b99752]/35 bg-[#07131f]/98 p-2 text-[#f8f3e9] shadow-[0_24px_80px_rgba(0,0,0,.5)] backdrop-blur-2xl">
          <div className="border-b border-white/10 px-3 py-3">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[#d7bb79]">{copy[locale]}</p>
            <p className="mt-1 text-xs text-white/55">Casa Bernocchi · International interface</p>
          </div>
          <ul role="listbox" className="grid grid-cols-1 gap-1 p-1 sm:grid-cols-2">
            {casaLocales.map((item) => {
              const selected = item.value === locale
              return (
                <li key={item.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      changeLocale(item.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition',
                      selected
                        ? 'bg-[#b99752]/18 text-[#f1d99d]'
                        : 'text-white/78 hover:bg-white/7 hover:text-white',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg" aria-hidden="true">{item.flag}</span>
                      <span>
                        <span className="block font-medium">{item.nativeLabel}</span>
                        <span className="mt-0.5 block text-[0.64rem] uppercase tracking-[0.14em] text-white/38">{item.value}</span>
                      </span>
                    </span>
                    {selected ? <Check className="size-4 text-[#d7bb79]" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
