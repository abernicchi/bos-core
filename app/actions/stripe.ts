'use server'

import { stripe } from '@/lib/stripe'
import { getProduct } from '@/lib/products'

export type BookingDetails = {
  serviceId: string
  professional?: string
  date?: string
  time?: string
  language?: string
  mode?: string
  patientName?: string
  patientEmail?: string
}

/**
 * Creates an embedded Checkout session for a Bernocchi Health consultation.
 * The price is looked up server-side from the product catalogue so it can
 * never be tampered with by the client.
 */
export async function startBookingCheckout(booking: BookingDetails) {
  const product = getProduct(booking.serviceId)
  if (!product) {
    throw new Error(`Service "${booking.serviceId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    mode: 'payment',
    customer_email: booking.patientEmail || undefined,
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      serviceId: booking.serviceId,
      professional: booking.professional ?? '',
      date: booking.date ?? '',
      time: booking.time ?? '',
      language: booking.language ?? '',
      mode: booking.mode ?? '',
      patientName: booking.patientName ?? '',
    },
  })

  return session.client_secret
}
