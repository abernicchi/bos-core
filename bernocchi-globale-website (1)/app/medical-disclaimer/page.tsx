import type { Metadata } from 'next'
import { LegalLayout, LegalSection } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Medical Disclaimer — Bernocchi Health',
  description:
    'Important information about the nature and limits of consultations provided by Bernocchi Health.',
  alternates: { canonical: '/medical-disclaimer' },
  robots: { index: true, follow: false },
}

export default function MedicalDisclaimerPage() {
  return (
    <LegalLayout title="Medical Disclaimer" updated="2026">
      <LegalSection heading="Not for emergencies">
        <p>
          Bernocchi Health does not provide emergency services. If you are
          experiencing a medical or psychological emergency, or believe you may
          harm yourself or others, contact your local emergency number or
          nearest emergency department immediately.
        </p>
      </LegalSection>

      <LegalSection heading="Professional consultations">
        <p>
          Consultations are delivered by licensed professionals within their
          areas of competence and in accordance with applicable regulations and
          jurisdictional eligibility. A consultation does not necessarily
          establish an ongoing clinical relationship and may result in a referral
          to another practitioner or service.
        </p>
      </LegalSection>

      <LegalSection heading="No guarantee of outcome">
        <p>
          Health and psychological care is inherently individual. No specific
          result or outcome is promised or guaranteed. Information provided on
          this website is general in nature and is not a substitute for
          personalised professional advice.
        </p>
      </LegalSection>

      <LegalSection heading="Confidentiality">
        <p>
          Consultations are treated as confidential in accordance with applicable
          professional and data-protection obligations. Please do not submit
          clinical details through the website forms; sensitive information is
          collected securely only within the appropriate professional setting.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
