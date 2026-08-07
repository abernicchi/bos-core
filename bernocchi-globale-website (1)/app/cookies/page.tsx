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
    <LegalLayout title="Cookie Policy" updated="7 August 2026">
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
          With consent, the site creates a random browser identifier and sends a
          limited set of journey events to our first-party analytics endpoint.
          The identifier is pseudonymised before storage. Optional tools such as
          Google Analytics, Google Tag Manager or Meta Pixel are loaded only when
          configured and only after consent. Where none are configured, no
          advertising tracker is installed.
        </p>
      </LegalSection>

      <LegalSection heading="Managing your preferences">
        <p>
          You can manage or withdraw consent through the banner shown on your
          first visit. You may reset the decision by deleting the site data named
          <code> cb-cookie-consent</code> in your browser, or block and delete
          storage through your browser settings.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
