'use client'

import { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  startBookingCheckout,
  type BookingDetails,
} from '@/app/actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
)

export function BookingCheckout({ booking }: { booking: BookingDetails }) {
  const fetchClientSecret = useCallback(
    () => startBookingCheckout(booking),
    [booking],
  )

  return (
    <div id="checkout" className="[&_iframe]:min-h-[500px]">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
