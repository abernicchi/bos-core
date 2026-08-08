'use client'

import { FormEvent, useState } from 'react'
import { Copy, Link2, Loader2 } from 'lucide-react'

export function PaymentLinkForm({
  bookingReservationId,
  defaultDescription,
}: {
  bookingReservationId: string
  defaultDescription: string
}) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState(defaultDescription)
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setLink('')
    try {
      const response = await fetch('/api/office/payment-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingReservationId,
          amountUsd: amount,
          description,
        }),
      })
      const data = (await response.json()) as { url?: string; error?: string }
      if (response.status === 401) {
        window.location.assign('/api/office/refresh?next=/office')
        return
      }
      if (!response.ok || !data.url) throw new Error(data.error ?? 'No fue posible crear el enlace.')
      setLink(data.url)
      setMessage('Enlace creado y auditado. Puede enviarlo al paciente.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible crear el enlace.')
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setMessage('Enlace copiado.')
  }

  return (
    <form onSubmit={submit} className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-[130px_1fr_auto]">
      <label className="text-xs text-white/48">
        Monto USD
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          placeholder="150.00"
          required
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#07131f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a85f]/70"
        />
      </label>
      <label className="text-xs text-white/48">
        Concepto
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          maxLength={240}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#07131f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a85f]/70"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#c9a85f] px-4 text-xs font-semibold text-[#07131f] disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />}
        Generar enlace
      </button>

      {link ? (
        <div className="sm:col-span-3 flex flex-col gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-3 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 truncate text-xs text-emerald-100/80">{link}</code>
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 text-xs text-[#e4cf9d]">
            <Copy className="size-3.5" /> Copiar
          </button>
        </div>
      ) : null}
      {message ? <p className="sm:col-span-3 text-xs leading-5 text-white/52">{message}</p> : null}
    </form>
  )
}
