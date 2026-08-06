/** Formats a minor-unit amount (cents) as a localized currency string. */
export function formatPrice(
  amountInCents: number,
  currency: string = 'usd',
): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100)
}
