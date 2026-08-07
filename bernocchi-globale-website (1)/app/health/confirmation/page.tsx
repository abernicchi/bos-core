import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Clock3, CreditCard, Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { site, bookingWhatsappUrl } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Solicitud recibida — Bernocchi Health',
  description: 'La solicitud de cita fue recibida y se encuentra en reserva provisional.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/health/confirmation' },
}

export default async function AppointmentConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; pay?: string }>
}) {
  const { ref, pay } = await searchParams

  return (
    <section className="min-h-[75svh] border-t border-white/10 bg-[#07131f] py-20 text-[#f7f1e6] md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full border border-[#c9a85f]/40 bg-[#c9a85f] text-[#07131f] shadow-[0_0_50px_rgba(185,151,82,.22)]">
          <Check className="size-8" aria-hidden="true" />
        </span>
        <p className="mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Bernocchi Health</p>
        <h1 className="mt-4 text-balance font-serif text-4xl font-light leading-tight md:text-6xl">Su solicitud ha sido recibida.</h1>
        <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/62">
          La fecha seleccionada quedó registrada como reserva provisional. La Segreteria Generale verificará disponibilidad y remitirá la confirmación definitiva por correo electrónico o WhatsApp.
        </p>
        {ref ? (
          <div className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5">
            <ShieldCheck className="size-4 text-[#c9a85f]" />
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-white/42">Referencia</span>
            <strong className="font-mono text-sm tracking-wider text-[#e2c77f]">{ref}</strong>
          </div>
        ) : null}

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-left md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"><Clock3 className="size-5 text-[#c9a85f]" /><h2 className="mt-6 font-serif text-xl">Reserva provisional</h2><p className="mt-3 text-sm leading-6 text-white/48">La selección todavía no constituye una cita confirmada.</p></article>
          <article className="rounded-2xl border border-[#c9a85f]/28 bg-[#c9a85f]/7 p-6"><CreditCard className="size-5 text-[#c9a85f]" /><h2 className="mt-6 font-serif text-xl">{pay ? 'Pago disponible' : 'Pago pendiente'}</h2><p className="mt-3 text-sm leading-6 text-white/48">{pay ? 'No se realizó ningún cobro. Puede completar el pago en el enlace privado.' : 'No se realizó ningún cobro. La Segreteria asignará el método aplicable.'}</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"><Mail className="size-5 text-[#c9a85f]" /><h2 className="mt-6 font-serif text-xl">Confirmación directa</h2><p className="mt-3 text-sm leading-6 text-white/48">Recibirá una comunicación con los detalles definitivos y las condiciones.</p></article>
        </div>

        {pay ? (
          <div className="mt-10">
            <Link href={`/pay/${pay}`} className="inline-flex items-center gap-2 rounded-full bg-[#c9a85f] px-7 py-3.5 text-sm font-semibold text-[#07131f] transition hover:bg-[#dfc47f]"><CreditCard className="size-4" />Abrir pago seguro<ArrowRight className="size-4" /></Link>
          </div>
        ) : null}
        <div className={`${pay ? 'mt-5' : 'mt-10'} flex flex-col items-center justify-center gap-3 sm:flex-row`}>
          <a href={bookingWhatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#c9a85f] px-6 py-3 text-sm font-semibold text-[#07131f] transition hover:bg-[#dfc47f]"><MessageCircle className="size-4" />Contactar por WhatsApp</a>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-[#c9a85f] hover:text-[#e2c77f]"><Mail className="size-4" />Escribir a la Segreteria</a>
        </div>
        <div className="mt-12"><Link href="/health" className="inline-flex items-center gap-2 text-sm text-white/52 transition hover:text-[#c9a85f]">Volver a Bernocchi Health<ArrowRight className="size-4" /></Link></div>
      </div>
    </section>
  )
}
