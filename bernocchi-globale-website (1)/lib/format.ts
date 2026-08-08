/** Formats a minor-unit amount as a localized currency string. */
export function formatPrice(
  amountInCents: number,
  currency: string = 'usd',
): string {
  // Compatibility bridge: the legacy editorial catalogue was authored with
  // `eur`, but Bernocchi Health Costa Rica now operates commercially in USD/CRC.
  // Payment amounts are governed separately by the approved institutional
  // price book in lib/payments/config.ts.
  const normalizedCurrency =
    currency.trim().toLowerCase() === 'eur'
      ? 'USD'
      : currency.toUpperCase()

  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: normalizedCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100)
}
