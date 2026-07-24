import type { Metadata } from 'next'
import { LegalLayout, LegalSection } from '@/components/legal-layout'
import { site } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Terms of Service — Casa Bernocchi',
  description:
    'The terms governing the use of the Casa Bernocchi website and the booking of Bernocchi Health consultations.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: false },
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="2026">
      <LegalSection heading="Who we are">
        <p>
          This website is operated by {site.legalName} ({site.name}),
          headquartered in Milano, Italy, with regional operations in Costa Rica.
          By using this site or booking a consultation, you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="Bookings and payments">
        <p>
          Consultation fees are displayed in full before payment. Payments are
          processed securely by Stripe. A booking is a request for an
          appointment; the Segreteria Generale confirms the final date and time.
          If a requested time cannot be honoured, we will offer an alternative or
          a refund.
        </p>
      </LegalSection>

      <LegalSection heading="Cancellations and refunds">
        <p>
          You may request to reschedule or cancel by contacting the Segreteria at{' '}
          <a
            href={`mailto:${site.email}`}
            className="text-foreground underline underline-offset-4"
          >
            {site.email}
          </a>
          . Refund eligibility depends on notice given and is confirmed in
          writing. Specific cancellation windows will be published here before
          launch.
        </p>
      </LegalSection>

      <LegalSection heading="Nature of services">
        <p>
          Bernocchi Health provides professional consultations delivered by
          licensed practitioners. It does not provide emergency care. Please read
          the{' '}
          <a
            href="/medical-disclaimer"
            className="text-foreground underline underline-offset-4"
          >
            Medical Disclaimer
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          The names Casa Bernocchi and Bernocchi Globale, the marks, texts and
          visual identity on this site are the property of the group and may not
          be used without written permission.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These terms are governed by the applicable laws of the relevant
          jurisdictions in which the group operates. The definitive governing law
          and venue will be confirmed by counsel before launch.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
