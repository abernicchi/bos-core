import type { Metadata } from 'next'
import { LegalLayout, LegalSection } from '@/components/legal-layout'
import { site } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Privacy Policy — Casa Bernocchi',
  description:
    'How Casa Bernocchi (Bernocchi Globale Holdings) processes personal data, in line with the GDPR and applicable law.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: false },
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="7 August 2026">
      <LegalSection heading="Data controller">
        <p>
          The data controller is {site.legalName} ({site.name}), headquartered
          in Milano, Italy. For any request concerning personal data, write to{' '}
          <a
            href={`mailto:${site.email}`}
            className="text-foreground underline underline-offset-4"
          >
            {site.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Data we process">
        <p>
          We process the data you voluntarily provide through our forms: name,
          email, optional telephone, country, preferred language, the nature of
          your enquiry and the message text. When you book a consultation we also
          process the appointment details and a payment confirmation. We do not
          request, and do not wish to receive, special categories of data (such
          as health data) through the forms on this site.
        </p>
      </LegalSection>

      <LegalSection heading="Purpose and legal basis">
        <p>
          Data is processed to respond to enquiries, to route them to the
          relevant institution, to arrange and confirm consultations, and to
          manage subsequent correspondence. The legal basis is consent and the
          performance of pre-contractual measures requested by the data subject.
        </p>
      </LegalSection>

      <LegalSection heading="Payments">
        <p>
          Online payments may be processed by PayPal or by an expressly
          identified local checkout provider such as ONVO. We store the payment
          order, provider reference, status, currency and amount required for
          reconciliation. Card and wallet credentials are collected by the
          provider and are never sent to or stored on our servers. Each provider
          also processes data under its own privacy notice and terms.
        </p>
      </LegalSection>

      <LegalSection heading="Service providers">
        <p>
          We use infrastructure and communications providers to host the site,
          store operational records and deliver confirmations. Access is limited
          to what is necessary for the relevant function and is protected by
          contractual and technical safeguards. Providers may include Netlify,
          Supabase, Resend, PayPal and ONVO when their corresponding function is
          enabled.
        </p>
      </LegalSection>

      <LegalSection heading="Pseudonymous statistics">
        <p>
          With consent, we record a limited set of journey events such as page
          views, enquiry completion and payment completion. The browser identifier
          is transformed with a secret one-way hash before storage. These events
          contain no clinical information, payment credentials or message text.
        </p>
      </LegalSection>

      <LegalSection heading="Retention">
        <p>
          Data is retained for as long as necessary to handle the enquiry and any
          related obligations, and is subsequently deleted or anonymised, save
          where retention is required by law.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          Within the limits of applicable law, you have the right to access your
          data, request its rectification or erasure, object to processing and
          withdraw consent at any time, by writing to the controller&apos;s
          address.
        </p>
      </LegalSection>

      <LegalSection heading="International transfers">
        <p>
          As the group operates between Italy and Costa Rica, some data may be
          processed internationally, under appropriate safeguards consistent with
          applicable law.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
