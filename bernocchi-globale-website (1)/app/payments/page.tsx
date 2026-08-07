import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CreditCard, Link2, ShieldCheck, WalletCards } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pagos institucionales',
  description:
    'Arquitectura de pagos de Casa Bernocchi: enlaces privados, conciliación y proveedores externos verificados.',
  alternates: { canonical: '/payments' },
}

export default function PaymentsPage() {
  return (
    <div className="bg-[#07131f] text-[#f7f1e6]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">
            Tesorería digital
          </p>
          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-light leading-[.98] sm:text-6xl lg:text-7xl">
            Pagar con claridad, control y trazabilidad.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
            Casa Bernocchi emite enlaces privados vinculados a una reserva o
            concepto concreto. El importe se fija en el servidor y cada cobro
            se concilia antes de modificar el estado de la operación.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#091724]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [Link2, 'Enlace propio', 'Una URL privada de bernocchiglobale.it identifica la orden sin exponer datos personales.'],
              [CreditCard, 'Proveedor externo', 'PayPal o el adquirente local recibe los datos financieros; la Casa no almacena tarjetas.'],
              [ShieldCheck, 'Conciliación', 'Importe, moneda, firma e idempotencia deben coincidir antes de confirmar el pago.'],
            ].map(([Icon, title, body]) => {
              const PaymentIcon = Icon as typeof Link2
              return (
                <article key={title as string} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                  <PaymentIcon className="size-5 text-[#c9a85f]" />
                  <h2 className="mt-8 font-serif text-2xl">{title as string}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/50">{body as string}</p>
                </article>
              )
            })}
          </div>

          <div className="mt-12 grid gap-8 rounded-3xl border border-[#c9a85f]/22 bg-[#c9a85f]/6 p-7 lg:grid-cols-[.75fr_1.25fr] lg:p-10">
            <div>
              <WalletCards className="size-7 text-[#c9a85f]" />
              <h2 className="mt-6 font-serif text-3xl">Métodos y wallets</h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-white/56">
              <p>
                PayPal está previsto como canal internacional. Para Costa Rica,
                la arquitectura admite un checkout local con tarjeta y métodos
                bancarios habilitados por el adquirente.
              </p>
              <p>
                Apple Pay y Google Pay solo se anuncian cuando el contrato del
                comercio, el país, el dispositivo y el procesador confirman su
                elegibilidad. La interfaz nunca muestra un wallet que no pueda completar el cobro.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 py-16 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <p className="text-[0.64rem] uppercase tracking-[0.22em] text-[#927331]">Bernocchi Health</p>
            <h2 className="mt-3 font-serif text-3xl font-light">El pago comienza después de crear una reserva.</h2>
          </div>
          <Link href="/health#book" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#07131f] px-7 py-3.5 text-sm font-semibold text-[#f3eee3]">
            Solicitar una cita <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
