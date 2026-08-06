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
  es: { nav: ['Casa','Instituciones','Fundador','Health','Journal','Gobernanza','Contacto'], book: 'Reservar consulta', skip: 'Ir al contenido', primary: 'Navegación principal', mobile: 'Navegación móvil', open: 'Abrir menú', close: 'Cerrar menú', unavailable: 'No disponible', loading: 'Consultando disponibilidad…', timezone: 'Hora de Costa Rica', metaTitle: 'Excelencia italiana, construida para perdurar', metaDescription: 'Casa Bernocchi es la identidad institucional de Bernocchi Globale Holdings y de Bernocchi Health.' },
  en: { nav: ['Casa','Institutions','Founder','Health','Journal','Governance','Contact'], book: 'Book a consultation', skip: 'Skip to content', primary: 'Primary navigation', mobile: 'Mobile navigation', open: 'Open menu', close: 'Close menu', unavailable: 'Unavailable', loading: 'Checking availability…', timezone: 'Costa Rica time', metaTitle: 'Italian excellence, built to endure', metaDescription: 'Casa Bernocchi is the institutional identity of Bernocchi Globale Holdings and Bernocchi Health.' },
  it: { nav: ['Casa','Istituzioni','Fondatore','Health','Journal','Governance','Contatti'], book: 'Prenotare una consulenza', skip: 'Vai al contenuto', primary: 'Navigazione principale', mobile: 'Navigazione mobile', open: 'Apri menu', close: 'Chiudi menu', unavailable: 'Non disponibile', loading: 'Verifica della disponibilità…', timezone: 'Ora della Costa Rica', metaTitle: 'Eccellenza italiana, costruita per durare', metaDescription: 'Casa Bernocchi è l’identità istituzionale di Bernocchi Globale Holdings e Bernocchi Health.' },
} as const satisfies Record<Locale, { nav: readonly string[]; book: string; skip: string; primary: string; mobile: string; open: string; close: string; unavailable: string; loading: string; timezone: string; metaTitle: string; metaDescription: string }>
