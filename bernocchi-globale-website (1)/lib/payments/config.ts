import 'server-only'

import { consultationTypes } from '@/lib/content'

export type PaymentProvider = 'paypal' | 'onvo'
export type PaymentCurrency = 'EUR' | 'USD' | 'CRC'

type InstitutionalPrice = {
  usdMinor: number
  crcMinor: number
}

type LocalPrice = {
  amountMinor: number
  currency: 'CRC'
}

/**
 * BERNOCCHI HEALTH — APPROVED INSTITUTIONAL PRICE BOOK
 * ---------------------------------------------------
 * Fixed institutional prices. These are NOT FX conversions.
 * PayPal charges in USD. Costa Rica local checkout uses CRC.
 */
const INSTITUTIONAL_PRICES: Record<string, InstitutionalPrice> = {
  'clinical-sexology': { usdMinor: 13000, crcMinor: 6500000 },
  'couples-therapy': { usdMinor: 15000, crcMinor: 7500000 },
  'mens-sexual-health': { usdMinor: 13000, crcMinor: 6500000 },
  'womens-sexual-health': { usdMinor: 13000, crcMinor: 6500000 },
  'online-consultation': { usdMinor: 11000, crcMinor: 5500000 },
  'executive-consultation': { usdMinor: 24000, crcMinor: 12000000 },
}

export function getInstitutionalPrice(serviceId: string) {
  return INSTITUTIONAL_PRICES[serviceId]
}

export function getLocalServicePrice(serviceId: string): LocalPrice | undefined {
  const price = getInstitutionalPrice(serviceId)
  if (!price) return undefined
  return { amountMinor: price.crcMinor, currency: 'CRC' }
}

export function getPaymentConfig(serviceId?: string) {
  const paypal = Boolean(
    process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET,
  )
  const onvoQuote = serviceId ? getLocalServicePrice(serviceId) : undefined
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
  const price = getInstitutionalPrice(serviceId)
  if (!service || !price) return undefined
  return {
    service,
    amountMinor: price.usdMinor,
    currency: 'USD' as const,
  }
}

export function formatMoney(amountMinor: number, currency: PaymentCurrency) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'CRC' ? 0 : 2,
  }).format(amountMinor / 100)
}
