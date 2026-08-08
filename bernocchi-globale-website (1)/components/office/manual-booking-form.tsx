'use client'

import { FormEvent, useState } from 'react'
import { CalendarPlus, Loader2 } from 'lucide-react'

const services = [
  ['clinical-sexology', 'Sexología Clínica'],
  ['mens-sexual-health', 'Salud Sexual Masculina'],
  ['womens-sexual-health', 'Salud Sexual Femenina'],
  ['couples-therapy', 'Terapia de Pareja'],
  ['online-consultation', 'Consulta Online'],
  ['executive-consultation', 'Executive / Priority'],
] as const

export function ManualBookingForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const response = await fetch('/api/office/manual-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { referenceCode?: string; error?: string }
      if (response.status === 401) {
        window.location.assign('/api/office/refresh?next=/office')
        return
      }
      if (!response.ok) throw new Error(data.error ?? 'No fue posible crear la cita.')
      setMessage(`Cita creada: ${data.referenceCode}. El horario quedó bloqueado en Calendar.`)
      event.currentTarget.reset()
      window.setTimeout(() => window.location.reload(), 900)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible crear la cita.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'mt-1.5 w-full rounded-xl border border-white/10 bg-[#07131f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a85f]/70'

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-3xl border border-[#c9a85f]/20 bg-[#c9a85f]/[0.035] p-6 sm:grid-cols-2 lg:grid-cols-3">
      <label className="text-xs text-white/48">Nombre del paciente<input name="patientName" required className={inputClass} /></label>
      <label className="text-xs text-white/48">Correo<input name="patientEmail" type="email" required className={inputClass} /></label>
      <label className="text-xs text-white/48">WhatsApp<input name="patientWhatsapp" required placeholder="+506..." className={inputClass} /></label>
      <label className="text-xs text-white/48">Servicio
        <select name="consultationId" required className={inputClass} defaultValue="clinical-sexology">
          {services.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="text-xs text-white/48">Modalidad
        <select name="mode" required className={inputClass} defaultValue="in-person">
          <option value="in-person">Presencial</option>
          <option value="online">Online</option>
        </select>
      </label>
      <label className="text-xs text-white/48">Fecha y hora (Costa Rica)<input name="localStart" type="datetime-local" required className={inputClass} /></label>
      <label className="text-xs text-white/48">Idioma
        <select name="language" className={inputClass} defaultValue="es">
          <option value="es">Español</option><option value="it">Italiano</option><option value="en">English</option>
        </select>
      </label>
      <label className="text-xs text-white/48">País<input name="country" defaultValue="Costa Rica" className={inputClass} /></label>
      <div className="flex items-end">
        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c9a85f] px-5 py-3 text-sm font-semibold text-[#07131f] disabled:opacity-60">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <CalendarPlus className="size-4" />}
          Crear y bloquear cita
        </button>
      </div>
      {message ? <p className="sm:col-span-2 lg:col-span-3 text-sm leading-6 text-[#e4cf9d]">{message}</p> : null}
    </form>
  )
}
