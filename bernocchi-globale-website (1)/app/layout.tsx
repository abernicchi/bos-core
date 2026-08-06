import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next'
import { cookies, headers } from 'next/headers'
import { detectLocale, dictionaries } from '@/lib/i18n'
import { site, healthServices } from '@/lib/content'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CookieConsent } from '@/components/cookie-consent'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { Analytics, GtmNoScript } from '@/components/analytics'
import './globals.css'

const searchConsole = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Italian excellence, built to endure`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  generator: 'v0.app',
  keywords: [
    'Casa Bernocchi',
    'Bernocchi Globale Holdings',
    'Bernocchi Health',
    'clinical psychology',
    'couples therapy',
    'sexology',
    'online consultation',
    'Milano',
    'Costa Rica',
  ],
  authors: [{ name: site.legalName }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Italian excellence, built to endure`,
    description: site.description,
    images: [
      {
        url: '/images/hero-architecture.png',
        width: 1200,
        height: 630,
        alt: 'Casa Bernocchi — institutional architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Italian excellence, built to endure`,
    description: site.description,
    images: ['/images/hero-architecture.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: searchConsole ? { google: searchConsole } : undefined,
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}


export async function generateMetadata(): Promise<Metadata> {
  const locale = detectLocale((await cookies()).get('cb-lang')?.value, (await headers()).get('accept-language'))
  const copy = dictionaries[locale]
  return { ...baseMetadata, title: { default: `${site.name} — ${copy.metaTitle}`, template: `%s — ${site.name}` }, description: copy.metaDescription, openGraph: { ...baseMetadata.openGraph, locale: locale === 'es' ? 'es_CR' : locale === 'it' ? 'it_IT' : 'en_GB', title: `${site.name} — ${copy.metaTitle}`, description: copy.metaDescription } }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#07131f',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = detectLocale((await cookies()).get('cb-lang')?.value, (await headers()).get('accept-language'))

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    slogan: 'Scientia · Integritas · Posteritas',
    description: site.description,
    email: site.email,
    telephone: site.phoneDisplay,
    foundingDate: '2026',
    foundingLocation: {
      '@type': 'Country',
      name: 'Italy',
    },
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Milano',
        addressCountry: 'IT',
      },
      {
        '@type': 'PostalAddress',
        addressCountry: 'CR',
      },
    ],
    subOrganization: {
      '@type': 'MedicalOrganization',
      name: 'Bernocchi Health',
      url: `${site.url}/health`,
      email: site.email,
      telephone: site.phoneDisplay,
      areaServed: ['IT', 'CR', 'Worldwide'],
      availableLanguage: ['en', 'it', 'es'],
      makesOffer: healthServices.map((s) => ({
        '@type': 'Offer',
        name: s.name,
        description: s.description,
        price: (s.priceInCents / 100).toFixed(0),
        priceCurrency: s.currency.toUpperCase(),
      })),
    },
  }

  return (
    <html
      lang={locale}
      className="bg-background"
    >
      <body>
        <GtmNoScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <SiteHeader locale={locale} />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
        <CookieConsent />
        <Analytics />
        {process.env.NODE_ENV === 'production' && <VercelAnalytics />}
      </body>
      <GoogleAnalytics gaId="G-64BSR9K9LW" />
    </html>
  )
}
