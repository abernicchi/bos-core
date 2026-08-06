export const casaLocales = [
  { value: 'es', label: 'Español', nativeLabel: 'Español', flag: '🇪🇸' },
  { value: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { value: 'it', label: 'Italiano', nativeLabel: 'Italiano', flag: '🇮🇹' },
  { value: 'fr', label: 'Français', nativeLabel: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { value: 'ca', label: 'Català', nativeLabel: 'Català', flag: '🇦🇩' },
  { value: 'zh', label: 'Mandarín', nativeLabel: '中文', flag: '🇨🇳' },
  { value: 'pl', label: 'Polski', nativeLabel: 'Polski', flag: '🇵🇱' },
  { value: 'ru', label: 'Русский', nativeLabel: 'Русский', flag: '🇷🇺' },
  { value: 'ja', label: 'Japonés', nativeLabel: '日本語', flag: '🇯🇵' },
] as const

export type LocaleCode = (typeof casaLocales)[number]['value']

export const DEFAULT_LOCALE: LocaleCode = 'es'
export const CASA_LOCALE_STORAGE_KEY = 'cb-lang'
export const CASA_LOCALE_EVENT = 'casa:language'

const localeValues = new Set<string>(casaLocales.map((locale) => locale.value))

export function normalizeLocale(value: unknown): LocaleCode {
  if (typeof value !== 'string') return DEFAULT_LOCALE
  const normalized = value.toLowerCase().split('-')[0]
  return localeValues.has(normalized)
    ? (normalized as LocaleCode)
    : DEFAULT_LOCALE
}
