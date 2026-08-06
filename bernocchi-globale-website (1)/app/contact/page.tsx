import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, Globe2, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { InquiryForm } from '@/components/inquiry-form'
import { site, whatsappUrl } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contacto — Segreteria Generale · Casa Bernocchi',
  description:
    'Canal oficial de Casa Bernocchi para consultas institucionales y solicitudes de Bernocchi Health.',
  alternates: { canonical: '/contact' },
}

const locations = [
  { city: 'Roma', country: 'Italia', flag: '🇮🇹', status: 'Origen histórico', detail: 'Memoria fundacional · 1893' },
  { city: 'San José', country: 'Costa Rica', flag: '🇨🇷', status: 'Operación regional', detail: 'Atención y coordinación · desde 2024' },
  { city: 'Milano', country: 'Italia', flag: '🇮🇹', status: 'Coordinación europea', detail: 'Desarrollo institucional y comercial' },
  { city: 'Madrid · Barcelona · Sevilla', country: 'España', flag: '🇪🇸', status: 'Mercados estratégicos', detail: 'Proyección profesional y comercial' },
  { city: 'Andorra la Vella · Zürich · Genève', country: 'Andorra y Suiza', flag: '🇦🇩 🇨🇭', status: 'Mercados estratégicos', detail: 'Proyección europea' },
  { city: 'Paris · Frankfurt · Warszawa · Moskva', country: 'Europa', flag: '🇫🇷 🇩🇪 🇵🇱 🇷🇺', status: 'Mercados estratégicos', detail: 'Desarrollo internacional' },
  { city: 'New York · Hong Kong', country: 'Estados Unidos y China', flag: '🇺🇸 🇭🇰', status: 'Mercados estratégicos', detail: 'Proyección transatlántica y asiática' },
]

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Segreteria Generale</p>
          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-light leading-[.98] sm:text-6xl lg:text-7xl">El canal oficial de la Casa.</h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Toda comunicación institucional, profesional o de Bernocchi Health se recibe, registra y dirige desde la Segreteria Generale.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Canales directos</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight">Comunicación centralizada, respuesta trazable.</h2>
            <div className="mt-8 space-y-3">
              <a href={`mailto:${site.email}`} className="flex items-center gap-4 rounded-2xl border border-[#07131f]/10 bg-white/55 p-5 transition hover:-translate-y-0.5 hover:border-[#a3823e]/45">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#07131f] text-[#d5b66d]"><Mail className="size-5" /></span>
                <span><span className="block text-[0.62rem] uppercase tracking-[0.18em] text-[#07131f]/42">Correo institucional</span><span className="mt-1 block text-sm font-medium">{site.email}</span></span>
              </a>
              <a href={`tel:${site.phoneDisplay.replace(/\s/g, '')}`} className="flex items-center gap-4 rounded-2xl border border-[#07131f]/10 bg-white/55 p-5 transition hover:-translate-y-0.5 hover:border-[#a3823e]/45">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#07131f] text-[#d5b66d]"><Phone className="size-5" /></span>
                <span><span className="block text-[0.62rem] uppercase tracking-[0.18em] text-[#07131f]/42">Teléfono</span><span className="mt-1 block text-sm font-medium">{site.phoneDisplay}</span></span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-[#07131f]/10 bg-white/55 p-5 transition hover:-translate-y-0.5 hover:border-[#a3823e]/45">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#07131f] text-[#d5b66d]"><MessageCircle className="size-5" /></span>
                <span><span className="block text-[0.62rem] uppercase tracking-[0.18em] text-[#07131f]/42">WhatsApp</span><span className="mt-1 block text-sm font-medium">Contactar la Segreteria</span></span>
              </a>
            </div>
            <Link href="/health#book" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#07131f] px-6 py-3 text-sm font-semibold text-[#f3eee3] transition hover:-translate-y-1">
              Solicitar cita en Bernocchi Health <Building2 className="size-4" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#07131f]/10 bg-white/62 p-6 shadow-[0_24px_80px_rgba(7,19,31,.06)] sm:p-8">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Solicitud institucional</p>
            <h2 className="mt-4 font-serif text-3xl">Escribir a la Casa</h2>
            <p className="mt-3 text-sm leading-7 text-[#07131f]/54">
              La Segreteria dirigirá el mensaje al órgano correspondiente. No incluya información clínica, financiera o sensible en este formulario general.
            </p>
            <div className="mt-7"><InquiryForm /></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3"><Globe2 className="size-5 text-[#c9a85f]" /><p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Presencia y proyección</p></div>
              <h2 className="mt-5 max-w-4xl text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Cada ubicación muestra su condición real.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/48">
              La Casa diferencia memoria histórica, operación activa, coordinación y mercado estratégico. La proyección internacional no se presenta como una oficina física antes de su apertura efectiva.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <article key={`${location.city}-${location.status}`} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#c9a85f]/45">
                <div className="flex items-start justify-between gap-4"><MapPin className="size-5 text-[#c9a85f]" /><span className="text-xl">{location.flag}</span></div>
                <h3 className="mt-7 font-serif text-2xl">{location.city}</h3>
                <p className="mt-1 text-sm text-white/42">{location.country}</p>
                <p className="mt-5 inline-flex rounded-full border border-[#c9a85f]/25 bg-[#c9a85f]/6 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.17em] text-[#d8bd7a]">{location.status}</p>
                <p className="mt-4 text-xs leading-6 text-white/42">{location.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex gap-3 rounded-2xl border border-[#c9a85f]/22 bg-[#c9a85f]/6 p-5 text-xs leading-6 text-white/48">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#c9a85f]" />
            <p>Las reuniones presenciales fuera de la operación activa requieren confirmación expresa de la Segreteria Generale. Ninguna ubicación estratégica constituye por sí sola atención abierta al público.</p>
          </div>
        </div>
      </section>
    </>
  )
}
