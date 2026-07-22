import type { Metadata } from 'next'
import { LegalLayout, LegalSection } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Cookie Policy — Casa Bernocchi',
  description:
    'Information on the cookies and tracking technologies used by the Casa Bernocchi website.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: false },
}

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="2026">
      <LegalSection heading="What cookies are">
        <p>
          Cookies are small text files that websites store on your device for
          technical, statistical or personalisation purposes.
        </p>
      </LegalSection>

      <LegalSection heading="Essential cookies">
        <p>
          This site uses cookies and technical storage strictly necessary for its
          operation, including those that remember your cookie-consent
          preference. These do not require prior consent.
        </p>
      </LegalSection>

      <LegalSection heading="Analytics and third-party cookies">
        <p>
          Analytics and marketing tools (such as Google Analytics, Google Tag
          Manager or Meta Pixel) are loaded only when the corresponding
          configuration is enabled, and only after you have given consent where
          required. Where none are configured, no profiling or advertising
          trackers are installed.
        </p>
      </LegalSection>

      <LegalSection heading="Managing your preferences">
        <p>
          You can manage or withdraw consent through the banner shown on your
          first visit and, at any time, through your browser settings, which
          allow you to block or delete cookies already stored.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
