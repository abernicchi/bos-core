import 'server-only'

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  // Surfaced clearly during development so the missing key is obvious.
  console.warn('[v0] STRIPE_SECRET_KEY is not set. Checkout will fail.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
