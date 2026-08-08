'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { CheckCircle2, ExternalLink, Loader2, ShieldCheck } from 'lucide-react'
import { trackEvent } from '@/lib/analytics-events'

type PayPalButtonsOptions = {
  style?: Record<string, string | number | boolean>
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }) => Promise<void>
  onCancel?: () => void
  onError?: (error: unknown) => void
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: PayPalButtonsOptions) => {
        render: (container: HTMLElement) => Promise<void>
      }
    }
  }
}

type Props = {
  paymentToken: string
  paypalClientId?: string
  paypalCurrency: string
  onvoEnabled: boolean
  onvoLabel?: string
}

export function PaymentCheckout({
  paymentToken,
  paypalClientId,
  paypalCurrency,
  onvoEnabled,
  onvoLabel,
}: Props) {
  const paypalContainer = useRef<HTMLDivElement>(null)
  const rendered = useRef(false)
  const [paypalReady, setPaypalReady] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    if (
      !paypalReady ||
      !paypalContainer.current ||
      !window.paypal ||
      rendered.current
    ) {
      return
    }
    rendered.current = true

    window.paypal
      .Buttons({
        style: {
          layout: 'vertical',
          shape: 'pill',
          color: 'gold',
          label: 'paypal',
          height: 48,
        },
        createOrder: async () => {
          setMessage(undefined)
          trackEvent('payment_start', { provider: 'paypal' })
          const response = await fetch('/api/payments/paypal/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentToken }),
          })
          const data = (await response.json()) as { id?: string; error?: string }
          if (!response.ok || !data.id) {
            throw new Error(data.error ?? 'No fue posible iniciar PayPal.')
          }
          return data.id
        },
        onApprove: async ({ orderID }) => {
          const response = await fetch(
            `/api/payments/paypal/orders/${encodeURIComponent(orderID)}/capture`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentToken }),
            },
          )
          const data = (await response.json()) as {
            status?: string
            confirmation?: 'sent' | 'already_sent' | 'email_failed' | 'unavailable'
            error?: string
          }
          if (!response.ok || data.status !== 'COMPLETED') {
            throw new Error(data.error ?? 'No fue posible confirmar el pago.')
          }
          setCompleted(true)
          trackEvent('payment_complete', { provider: 'paypal' })
          setMessage(
            data.confirmation === 'sent' || data.confirmation === 'already_sent'
              ? 'Pago confirmado. Su cita quedó confirmada y la comunicación definitiva fue enviada a su correo.'
              : 'Pago confirmado y reserva conciliada. Si el correo definitivo no aparece en unos minutos, contacte a la Segreteria Generale indicando su referencia.',
          )
        },
        onCancel: () => setMessage('El pago fue cancelado. La orden sigue disponible.'),
        onError: (error) => {
          console.error('[Casa Bernocchi] PayPal checkout error:', error)
          setMessage('PayPal no pudo completar la operación. Inténtelo nuevamente.')
        },
      })
      .render(paypalContainer.current)
      .catch((error) => {
        console.error('[Casa Bernocchi] PayPal render error:', error)
        setMessage('No fue posible cargar PayPal en este momento.')
      })
  }, [paypalReady, paymentToken])

  async function startOnvo() {
    setLocalLoading(true)
    setMessage(undefined)
    trackEvent('payment_start', { provider: 'onvo' })
    try {
      const response = await fetch('/api/payments/onvo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentToken }),
      })
      const data = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? 'No fue posible crear el enlace local.')
      }
      window.location.assign(data.url)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible iniciar el pago.')
      setLocalLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="rounded-3xl border border-emerald-400/25 bg-emerald-400/8 p-7 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-300" />
        <h2 className="mt-5 font-serif text-3xl text-white">Pago confirmado</h2>
        <p className="mt-3 text-sm leading-7 text-white/58">
          {message ?? 'La reserva fue conciliada correctamente.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {paypalClientId ? (
        <>
          <Script
            id="paypal-sdk"
            src={`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=${encodeURIComponent(paypalCurrency)}&intent=capture&components=buttons`}
            strategy="afterInteractive"
            onLoad={() => setPaypalReady(true)}
            onError={() => setMessage('No fue posible cargar PayPal.')}
          />
          <div ref={paypalContainer} className="min-h-12" aria-label="Pagar con PayPal" />
        </>
      ) : null}

      {paypalClientId && onvoEnabled ? (
        <div className="my-5 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-white/30">
          <span className="h-px flex-1 bg-white/10" /> o <span className="h-px flex-1 bg-white/10" />
        </div>
      ) : null}

      {onvoEnabled ? (
        <button
          type="button"
          onClick={startOnvo}
          disabled={localLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#c9a85f]/55 bg-[#c9a85f]/10 px-6 py-3.5 text-sm font-semibold text-[#e4cf9d] transition hover:bg-[#c9a85f]/18 disabled:cursor-wait disabled:opacity-60"
        >
          {localLoading ? <Loader2 className="size-4 animate-spin" /> : <ExternalLink className="size-4" />}
          {onvoLabel ?? 'Pagar en checkout local seguro'}
        </button>
      ) : null}

      {message ? (
        <p role="status" className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/62">
          {message}
        </p>
      ) : null}

      <div className="mt-6 flex items-start gap-3 text-xs leading-6 text-white/38">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#c9a85f]" />
        <p>
          Casa Bernocchi no recibe ni almacena números de tarjeta. El cobro se
          procesa en la infraestructura certificada del proveedor seleccionado.
        </p>
      </div>
    </div>
  )
}
