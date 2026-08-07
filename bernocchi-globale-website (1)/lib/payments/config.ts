import 'server-only'

import { consultationTypes } from '@/lib/content'

export type PaymentProvider = 'paypal' | 'onvo'
export type PaymentCurrency = 'EUR' | 'USD' | 'CRC'

type LocalPrice = {
  amountMinor: number
  currency: 'USD' | 'CRC'
}

function parseLocalPrices(): Record<string, LocalPrice> {
  const raw = process.env.ONVO_PRICE_MAP_JSON
  if (!raw) return {}

  try {
    const value = JSON.parse(raw) as Record<string, Partial<LocalPrice>>
    return Object.fromEntries(
      Object.entries(value).flatMap(([serviceId, quote]) => {
        const amountMinor = Number(quote.amountMinor)
        const currency = quote.currency
        if (
          !Number.isSafeInteger(amountMinor) ||
          amountMinor <= 0 ||
          (currency !== 'USD' && currency !== 'CRC')
        ) {
          return []
        }
        return [[serviceId, { amountMinor, currency }]]
      }),
    )
  } catch {
    console.error('[Casa Bernocchi] ONVO_PRICE_MAP_JSON is invalid JSON.')
    return {}
  }
}

export function getPaymentConfig(serviceId?: string) {
  const paypal = Boolean(
    process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET,
  )
  const localPrices = parseLocalPrices()
  const onvoQuote = serviceId ? localPrices[serviceId] : undefined
  const onvo = Boolean(process.env.ONVO_SECRET_KEY && onvoQuote)

  return {
    enabled: process.env.PAYMENTS_ENABLED === 'true' && (paypal || onvo),
    paypal,
    onvo,
    onvoQuote,
    wallets: {
      applePay: process.env.PAYMENT_WALLETS?.split(',').includes('apple_pay') ?? false,
      googlePay:
        process.env.PAYMENT_WALLETS?.split(',').includes('google_pay') ?? false,
    },
  }
}

export function getServicePrice(serviceId: string) {
  const service = consultationTypes.find((item) => item.id === serviceId)
  if (!service) return undefined
  return {
    service,
    amountMinor: service.priceInCents,
    currency: service.currency.toUpperCase() as 'EUR',
  }
}

export function formatMoney(amountMinor: number, currency: PaymentCurrency) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'CRC' ? 0 : 2,
  }).format(amountMinor / 100)
}
