'use client'

import { FormEvent, useEffect, useState } from 'react'

export default function OfficeActivatePage() {
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const values = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    setAccessToken(values.get('access_token') ?? '')
    setRefreshToken(values.get('refresh_token') ?? '')
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!accessToken) {
      setMessage('El enlace de activación no contiene una sesión válida.')
      return
    }
    if (password.length < 12) {
      setMessage('Utilice una contraseña de al menos 12 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/office/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken, password }),
      })
      const data = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !data.ok) throw new Error(data.error ?? 'No fue posible activar la cuenta.')
      window.location.replace('/office')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible activar la cuenta.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#07131f] px-6 py-16 text-[#f7f1e6]">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">
          Casa Bernocchi · Prima attivazione
        </p>
        <h1 className="mt-5 font-serif text-4xl font-light">Activar Segreteria Console</h1>
        <p className="mt-4 text-sm leading-7 text-white/52">
          Defina la contraseña de la cuenta institucional. La credencial no será visible para la Oficina del Fundador ni se enviará por correo.
        </p>
        <form onSubmit={submit} className="mt-10 space-y-5 rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <label className="block text-sm">
            <span className="text-white/58">Nueva contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1b2a] px-4 py-3 text-white outline-none focus:border-[#c9a85f]/70"
            />
          </label>
          <label className="block text-sm">
            <span className="text-white/58">Confirmar contraseña</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1b2a] px-4 py-3 text-white outline-none focus:border-[#c9a85f]/70"
            />
          </label>
          {message ? <p className="text-sm leading-6 text-[#e4cf9d]">{message}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#c9a85f] px-5 py-3.5 text-sm font-semibold text-[#07131f] disabled:opacity-60"
          >
            {loading ? 'Activando…' : 'Activar acceso institucional'}
          </button>
        </form>
      </div>
    </main>
  )
}
