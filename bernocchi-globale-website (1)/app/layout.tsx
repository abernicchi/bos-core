import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { site, healthServices } from '@/lib/content'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CookieConsent } from '@/components/cookie-consent'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { Analytics } from '@/components/analytics'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const searchConsole = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Italian excellence, built to endure`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'Casa Bernocchi',
    'Bernocchi Globale Holdings',
    'Bernocchi Health',
    'Ordo Medicinae',
    'Ordo Iuris',
    'Ordo Scientia',
    'Ordo Innovatio',
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
    locale: 'es_CR',
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

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#07131f',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
      availableLanguage: ['es', 'en', 'it', 'fr', 'de', 'ca', 'zh', 'pl', 'ru', 'ja'],
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
      lang="es"
      className={`${inter.variable} ${cormorant.variable} bg-background`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  )
}
