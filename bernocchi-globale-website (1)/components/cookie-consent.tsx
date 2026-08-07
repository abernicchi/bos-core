'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cb-cookie-consent'
const CONSENT_EVENT = 'cb-consent-changed'

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange)
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange)
}

function clientSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? 'undecided'
}

function serverSnapshot() {
  return 'hidden-on-server'
}

export function CookieConsent() {
  const decision = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)

  function decide(value: 'accepted' | 'essential') {
    window.localStorage.setItem(STORAGE_KEY, value)
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }

  if (decision !== 'undecided') return null

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-[#c9a85f]/30 bg-[#091724]/98 p-5 text-[#f7f1e6] shadow-2xl backdrop-blur-xl md:inset-x-auto md:right-6 md:bottom-24"
    >
      <p className="text-sm leading-7 text-white/62">
        Usamos almacenamiento esencial para operar el sitio. Con su autorización,
        registramos estadísticas seudónimas para mejorar el recorrido; no incluyen
        datos clínicos ni financieros. Consulte nuestra{' '}
        <Link href="/cookies" className="text-[#d8bd7a] underline underline-offset-4">
          Política de cookies
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => decide('accepted')} className="rounded-full bg-[#c9a85f] px-4 py-2 text-sm font-semibold text-[#07131f]">
          Aceptar estadísticas
        </button>
        <button type="button" onClick={() => decide('essential')} className="rounded-full border border-white/18 px-4 py-2 text-sm font-medium text-white/72">
          Solo esenciales
        </button>
      </div>
    </div>
  )
}
