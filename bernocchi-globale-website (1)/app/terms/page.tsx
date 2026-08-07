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
    <LegalLayout title="Terms of Service" updated="7 August 2026">
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
          processed by the provider named on the private payment page, which may
          be PayPal or an enabled local checkout. A submitted booking initially
          creates a time-limited reservation. Successful payment confirms the
          payment status; the Segreteria Generale sends the service instructions.
          If the requested service cannot be provided, the customer may choose an
          alternative time or a full refund to the original payment method.
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
          . A cancellation received at least 24 hours before the confirmed start
          time is eligible for rescheduling or a full refund. With less than 24
          hours&apos; notice, the fee may be retained to cover the reserved
          professional time, except where mandatory law or a documented emergency
          requires another outcome. Approved refunds are returned to the original
          method; the provider&apos;s settlement time may apply.
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
          The contract for a professional service is governed by the mandatory
          rules and the jurisdiction applicable to the entity and professional
          identified in the written confirmation. Nothing in these terms limits
          non-waivable consumer rights. The parties will first seek a good-faith
          resolution through the Segreteria Generale.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
