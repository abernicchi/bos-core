import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CalendarDays, CreditCard, ShieldCheck } from 'lucide-react'
import { PaymentLinkForm } from '@/components/office/payment-link-form'
import { OFFICE_ACCESS_COOKIE, requireSchedulingIdentity } from '@/lib/office-auth'
import { supabaseRequest } from '@/lib/supabase-rest'

export const metadata: Metadata = {
  title: 'Segreteria Console — Casa Bernocchi',
  robots: { index: false, follow: false },
}

type BookingRow = {
  id: string
  reference_code: string
  patient_name: string
  patient_email: string
  consultation: string
  status: string
  payment_status: string
  start_at: string
  mode: string
}

export default async function OfficePage() {
  const store = await cookies()
  const accessToken = store.get(OFFICE_ACCESS_COOKIE)?.value
  if (!accessToken) redirect('/office/login')

  let identity
  try {
    identity = await requireSchedulingIdentity(accessToken)
  } catch {
    redirect('/api/office/refresh?next=/office')
  }

  const { data: bookings } = await supabaseRequest<BookingRow[]>(
    'booking_reservations?select=id,reference_code,patient_name,patient_email,consultation,status,payment_status,start_at,mode&order=created_at.desc&limit=30',
  )

  return (
    <main className="min-h-screen bg-[#07131f] text-[#f7f1e6]">
      <header className="border-b border-white/10 bg-[#081725]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Casa Bernocchi · Segreteria Generale</p>
            <h1 className="mt-2 font-serif text-3xl font-light">Console Operativa</h1>
          </div>
          <form action="/api/office/logout" method="post">
            <button className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/60 hover:border-[#c9a85f]/50 hover:text-[#e4cf9d]">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <ShieldCheck className="size-5 text-[#c9a85f]" />
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">Operador</p>
            <p className="mt-2 font-serif text-2xl">{identity.profile.display_name}</p>
            <p className="mt-2 text-xs text-white/42">Rol: {identity.profile.role}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <CalendarDays className="size-5 text-[#c9a85f]" />
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/35">Reservas recientes</p>
            <p className="mt-2 font-serif text-3xl">{bookings.length}</p>
            <p className="mt-2 text-xs text-white/42">Últimos registros operativos visibles</p>
          </div>
          <div className="rounded-3xl border border-[#c9a85f]/20 bg-[#c9a85f]/5 p-6">
            <CreditCard className="size-5 text-[#c9a85f]" />
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[#e4cf9d]/60">Enlaces de pago</p>
            <p className="mt-2 font-serif text-2xl">USD · PayPal</p>
            <p className="mt-2 text-xs leading-5 text-white/42">Monto definido por Segreteria, conciliación automática y trazabilidad por usuario.</p>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.25em] text-[#c9a85f]">Pacientes y cobros</p>
              <h2 className="mt-2 font-serif text-3xl font-light">Reservas</h2>
            </div>
            <p className="max-w-md text-right text-xs leading-5 text-white/35">Los montos no se toman del navegador: se validan nuevamente en servidor y quedan registrados en auditoría.</p>
          </div>

          <div className="mt-6 space-y-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
                <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-start">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#c9a85f]">{booking.reference_code}</p>
                    <h3 className="mt-2 font-serif text-2xl">{booking.patient_name}</h3>
                    <p className="mt-1 text-sm text-white/45">{booking.patient_email}</p>
                  </div>
                  <div className="text-sm leading-6 text-white/48">
                    <p>{booking.consultation}</p>
                    <p>
                      {new Intl.DateTimeFormat('es-CR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        timeZone: 'America/Costa_Rica',
                      }).format(new Date(booking.start_at))}
                    </p>
                    <p>{booking.mode === 'in-person' ? 'Presencial' : 'Online'}</p>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50">
                    {booking.payment_status}
                  </div>
                </div>
                {booking.payment_status !== 'paid' ? (
                  <PaymentLinkForm
                    bookingReservationId={booking.id}
                    defaultDescription={`Bernocchi Health — ${booking.consultation} — ${booking.reference_code}`}
                  />
                ) : (
                  <p className="mt-5 border-t border-white/10 pt-4 text-xs text-emerald-200/70">Pago conciliado. No se puede reemplazar el enlace de una reserva pagada.</p>
                )}
              </article>
            ))}
            {!bookings.length ? (
              <div className="rounded-3xl border border-white/10 p-8 text-sm text-white/42">No hay reservas registradas todavía.</div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
