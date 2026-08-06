'use client'

import { useEffect, useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { languages } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * Language selector for Italian, English and Spanish.
 *
 * Currently persists the preference locally and updates the label; genuine
 * locale routing (/it, /en, /es) with full translation is the dedicated
 * follow-up. The dropdown uses explicit high-contrast colours (dark navy text
 * on an ivory/white surface) so it is always readable regardless of the
 * surrounding light/dark section, shows a discreet checkmark on the active
 * language, and is positioned so it never clips off-screen on mobile.
 */
export function LanguageSelector({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('en')

  useEffect(() => {
    const stored = window.localStorage.getItem('cb-lang')
    if (stored) setCurrent(stored)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function choose(value: string) {
    setCurrent(value)
    window.localStorage.setItem('cb-lang', value)
    document.cookie = `cb-lang=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
    setOpen(false)
    window.location.reload()
  }

  const active = languages.find((l) => l.value === current) ?? languages[1]

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
      >
        <Globe className="size-4" />
        <span aria-hidden="true">{active.flag}</span>
        <span className="uppercase">{active.value}</span>
      </button>
      {open ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Language"
            className="absolute right-0 z-50 mt-2 min-w-44 max-w-[calc(100vw-2rem)] overflow-hidden rounded-sm border border-[#d9d2c2] bg-white py-1 text-[#07131f] shadow-xl"
          >
            {languages.map((lang) => {
              const selected = current === lang.value
              return (
                <li key={lang.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => choose(lang.value)}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 px-3.5 py-2.5 text-left text-sm text-[#07131f] transition-colors hover:bg-[#f3efe5]',
                      selected && 'bg-[#f3efe5]',
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="text-base leading-none">
                        {lang.flag}
                      </span>
                      <span>{lang.label}</span>
                    </span>
                    {selected ? (
                      <Check className="size-4 text-[#b9964a]" />
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      ) : null}
    </div>
  )
}
