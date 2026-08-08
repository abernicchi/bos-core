import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { site, healthServices } from '@/lib/content'
import { ordines } from '@/lib/ordines'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CookieConsent } from '@/components/cookie-consent'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { Analytics } from '@/components/analytics'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
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
    'Casa Bernocchi', 'Bernocchi Globale Holdings',
    'Ordo Medicinae', 'Ordo Iuris', 'Ordo Scientia', 'Ordo Innovatio', 'Ordo Humanitatis', 'Ordo Capitalis',
    'Bernocchi Health', 'Bernocchi Legal', 'Bernocchi Research Institute', 'Bernocchi Digital', 'Bernocchi Academy', 'Bernocchi Capital',
    'governance', 'research', 'science', 'technology', 'education', 'capital', 'sexology', 'Costa Rica', 'Italy',
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
    images: [{ url: '/images/hero-architecture.png', width: 1200, height: 630, alt: 'Casa Bernocchi — institutional architecture' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Italian excellence, built to endure`,
    description: site.description,
    images: ['/images/hero-architecture.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  verification: searchConsole ? { google: searchConsole } : undefined,
  icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }] },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#07131f' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    slogan: 'Conocimiento · Honor · Disciplina · Legado',
    description: site.description,
    email: site.email,
    telephone: site.phoneDisplay,
    subOrganization: ordines.map((ordo) => ({
      '@type': ordo.slug === 'medicinae' ? 'ProfessionalService' : 'Organization',
      name: ordo.institution,
      alternateName: ordo.order,
      url: `${site.url}/ordines/${ordo.slug}`,
      description: ordo.summary,
      ...(ordo.slug === 'medicinae'
        ? {
            availableLanguage: ['es', 'en', 'it'],
            makesOffer: healthServices.map((service) => ({
              '@type': 'Offer',
              name: service.name,
              description: service.description,
              price: (service.priceInCents / 100).toFixed(0),
              priceCurrency: 'USD',
            })),
          }
        : {}),
    })),
  }

  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable} bg-background`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
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
