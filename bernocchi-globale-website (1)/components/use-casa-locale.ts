'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  CASA_LOCALE_EVENT,
  CASA_LOCALE_STORAGE_KEY,
  DEFAULT_LOCALE,
  normalizeLocale,
  type LocaleCode,
} from '@/lib/i18n'

function applyDocumentLocale(locale: LocaleCode) {
  document.documentElement.lang = locale
  document.documentElement.dir = 'ltr'
}

export function useCasaLocale() {
  const [locale, setLocale] = useState<LocaleCode>(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = window.localStorage.getItem(CASA_LOCALE_STORAGE_KEY)
    const browserLocale = window.navigator.language
    const initial = normalizeLocale(stored ?? browserLocale)
    setLocale(initial)
    applyDocumentLocale(initial)

    function onLocaleChange(event: Event) {
      const detail = (event as CustomEvent<{ locale?: string }>).detail
      const next = normalizeLocale(detail?.locale)
      setLocale(next)
      applyDocumentLocale(next)
    }

    window.addEventListener(CASA_LOCALE_EVENT, onLocaleChange)
    return () => window.removeEventListener(CASA_LOCALE_EVENT, onLocaleChange)
  }, [])

  const changeLocale = useCallback((nextValue: string) => {
    const next = normalizeLocale(nextValue)
    window.localStorage.setItem(CASA_LOCALE_STORAGE_KEY, next)
    applyDocumentLocale(next)
    setLocale(next)
    window.dispatchEvent(
      new CustomEvent(CASA_LOCALE_EVENT, { detail: { locale: next } }),
    )
  }, [])

  return { locale, changeLocale }
}
