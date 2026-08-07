'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
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

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CASA_LOCALE_EVENT, onStoreChange)
  return () => window.removeEventListener(CASA_LOCALE_EVENT, onStoreChange)
}

function clientSnapshot() {
  const stored = window.localStorage.getItem(CASA_LOCALE_STORAGE_KEY)
  return normalizeLocale(stored ?? window.navigator.language)
}

function serverSnapshot(): LocaleCode {
  return DEFAULT_LOCALE
}

export function useCasaLocale() {
  const locale = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const changeLocale = useCallback((nextValue: string) => {
    const next = normalizeLocale(nextValue)
    window.localStorage.setItem(CASA_LOCALE_STORAGE_KEY, next)
    applyDocumentLocale(next)
    window.dispatchEvent(
      new CustomEvent(CASA_LOCALE_EVENT, { detail: { locale: next } }),
    )
  }, [])

  return { locale, changeLocale }
}
