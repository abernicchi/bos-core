import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  LockKeyhole,
  Mail,
} from 'lucide-react'
import { PaymentCheckout } from '@/components/payments/payment-checkout'
import { PaymentStatusRefresh } from '@/components/payments/payment-status-refresh'
import { AnalyticsMarker } from '@/components/analytics-marker'
import { site } from '@/lib/content'
import { formatMoney, getPaymentConfig } from '@/lib/payments/config'
import { getPaymentOrderByToken, paymentIsExpired } from '@/lib/payments/orders'

export const metadata: Metadata = {
  title: 'Pago seguro',
  description: 'Enlace privado de pago de Casa Bernocchi.',
  robots: { index: false, follow: false },
}

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ result?: string }>
}) {
  const [{ token }, { result }] = await Promise.all([params, searchParams])
  const order = await getPaymentOrderByToken(token)
  if (!order) notFound()

  const config = getPaymentConfig(order.service_code)
  const expired = paymentIsExpired(order)
  const completed = order.status === 'completed'
  const partiallyRefunded = order.status === 'partially_refunded'
  const refunded = order.status === 'refunded'
  const localAmount = config.onvoQuote
    ? formatMoney(config.onvoQuote.amountMinor, config.onvoQuote.currency)
    : undefined

  return (
    <section className="min-h-[78svh] border-t border-white/10 bg-[#07131f] py-16 text-[#f7f1e6] md:py-24">
      {completed && order.provider ? (
        <AnalyticsMarker
          event="payment_complete"
          provider={order.provider}
          serviceCode={order.service_code}
        />
      ) : null}
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/health"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.17em] text-white/42 transition hover:text-[#c9a85f]"
        >
          <ArrowLeft className="size-4" /> Bernocchi Health
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.27em] text-[#c9a85f]">
              Enlace privado · pago seguro
            </p>
            <h1 className="mt-5 text-balance font-serif text-5xl font-light leading-tight sm:text-6xl">
              Complete su reserva.
            </h1>
            <p className="mt-6 max-w-xl leading-8 text-white/56">
              El importe proviene del catálogo institucional y está asociado a
              una única reserva. Ningún valor puede modificarse desde esta página.
            </p>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.032] p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/34">
                    Concepto
                  </p>
                  <h2 className="mt-3 font-serif text-2xl">{order.description}</h2>
                </div>
                <CreditCard className="size-5 shrink-0 text-[#c9a85f]" />
              </div>
              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/34">
                  Importe PayPal
                </p>
                <p className="mt-2 font-serif text-4xl text-[#e4cf9d]">
                  {formatMoney(order.amount_minor, order.currency)}
                </p>
                {localAmount ? (
                  <p className="mt-3 text-xs text-white/42">
                    Checkout local: {localAmount}. La moneda y el importe se
                    muestran antes de abandonar esta página.
                  </p>
                ) : null}
              </div>
              <div className="mt-7 flex items-start gap-3 border-t border-white/10 pt-6 text-xs leading-6 text-white/38">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-[#c9a85f]" />
                <p>
                  Válido hasta{' '}
                  {new Intl.DateTimeFormat('es-CR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'America/Costa_Rica',
                  }).format(new Date(order.expires_at))}{' '}
                  (Costa Rica).
                </p>
              </div>
            </div>
          </div>

          <aside className="self-start rounded-[2rem] border border-[#c9a85f]/25 bg-[#091724] p-7 shadow-[0_28px_90px_rgba(0,0,0,.28)] sm:p-9">
            {completed || partiallyRefunded || refunded ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto size-12 text-emerald-300" />
                <h2 className="mt-6 font-serif text-3xl">
                  {refunded
                    ? 'Pago reembolsado'
                    : partiallyRefunded
                      ? 'Reembolso parcial registrado'
                      : 'Pago confirmado'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/54">
                  {refunded || partiallyRefunded
                    ? 'La operación fue conciliada y la Segreteria remitirá el detalle por correo.'
                    : 'La conciliación fue registrada. Recibirá los detalles de la cita por correo.'}
                </p>
              </div>
            ) : expired ? (
              <div className="text-center">
                <Clock3 className="mx-auto size-10 text-[#c9a85f]" />
                <h2 className="mt-6 font-serif text-3xl">Enlace expirado</h2>
                <p className="mt-4 text-sm leading-7 text-white/54">
                  Solicite a la Segreteria la revisión de disponibilidad y un nuevo enlace.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#c9a85f] px-6 py-3 text-sm font-semibold text-[#07131f]"
                >
                  <Mail className="size-4" /> Contactar la Segreteria
                </a>
              </div>
            ) : config.enabled ? (
              <>
                <div className="mb-7 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-[#c9a85f]/30 text-[#c9a85f]">
                    <LockKeyhole className="size-4" />
                  </span>
                  <div>
                    <p className="font-serif text-xl">Elegir método</p>
                    <p className="mt-1 text-xs text-white/36">Procesamiento externo verificado</p>
                  </div>
                </div>
                {result === 'processing' ? (
                  <>
                    <PaymentStatusRefresh />
                    <p className="mb-6 rounded-2xl border border-[#c9a85f]/24 bg-[#c9a85f]/7 p-4 text-sm leading-6 text-white/58">
                      El proveedor está conciliando el pago. Esta página se actualizará cuando llegue la confirmación.
                    </p>
                  </>
                ) : null}
                <PaymentCheckout
                  paymentToken={order.public_token}
                  paypalClientId={config.paypal ? process.env.PAYPAL_CLIENT_ID : undefined}
                  paypalCurrency={order.currency}
                  onvoEnabled={config.onvo}
                  onvoLabel={localAmount ? `Pagar ${localAmount} en Costa Rica` : undefined}
                />
              </>
            ) : (
              <div className="text-center">
                <LockKeyhole className="mx-auto size-10 text-[#c9a85f]" />
                <h2 className="mt-6 font-serif text-3xl">Método en asignación</h2>
                <p className="mt-4 text-sm leading-7 text-white/54">
                  La Segreteria confirmará el canal aplicable antes de realizar cualquier cobro.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#c9a85f]/45 px-6 py-3 text-sm font-semibold text-[#e4cf9d]"
                >
                  <Mail className="size-4" /> Escribir a la Segreteria
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
