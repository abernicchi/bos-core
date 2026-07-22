import { healthServices, type HealthService } from './content'

export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  currency: 'eur'
}

/**
 * Source of truth for checkout pricing. Derived from the Bernocchi Health
 * service catalogue so prices never diverge between display and payment.
 * The server validates prices from this array — the client can never set them.
 */
export const PRODUCTS: Product[] = healthServices.map((s: HealthService) => ({
  id: s.id,
  name: `Bernocchi Health — ${s.name}`,
  description: `${s.duration} consultation. ${s.description}`,
  priceInCents: s.priceInCents,
  currency: s.currency,
}))

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
