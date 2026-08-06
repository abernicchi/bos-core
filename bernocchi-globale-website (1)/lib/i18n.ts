export const locales = ['es', 'en', 'it'] as const
export type Locale = typeof locales[number]
export function detectLocale(cookieValue?: string | null, acceptLanguage?: string | null): Locale {
  if (locales.includes(cookieValue as Locale)) return cookieValue as Locale
  for (const item of acceptLanguage?.split(',') ?? []) {
    const code = item.trim().split(';')[0].split('-')[0].toLowerCase()
    if (locales.includes(code as Locale)) return code as Locale
  }
  return 'en'
}
export const dictionaries = {
  es: { unavailable: 'No disponible', loading: 'Consultando disponibilidad…', timezone: 'Hora de Costa Rica' },
  en: { unavailable: 'Unavailable', loading: 'Checking availability…', timezone: 'Costa Rica time' },
  it: { unavailable: 'Non disponibile', loading: 'Verifica della disponibilità…', timezone: 'Ora della Costa Rica' },
} as const satisfies Record<Locale, Record<string, string>>
