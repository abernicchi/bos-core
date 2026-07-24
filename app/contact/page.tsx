import type { Metadata } from 'next'
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { InquiryForm } from '@/components/inquiry-form'
import { site, offices, whatsappUrl } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact — Segreteria Generale',
  description:
    'Reach the Segreteria Generale of Casa Bernocchi. Book a Bernocchi Health consultation or send an institutional enquiry by email, phone or WhatsApp.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  const channels = [
    {
      icon: Mail,
      label: 'Email',
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: Phone,
      label: 'Telephone',
      value: site.phoneDisplay,
      href: `tel:${site.phoneDisplay.replace(/\s/g, '')}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Message the Segreteria',
      href: whatsappUrl,
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Speak with the Segreteria Generale."
        intro="The Segreteria Generale is the official channel of Casa Bernocchi. For health consultations, you can also book directly on the Bernocchi Health page."
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-serif text-2xl text-foreground">
              Direct channels
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="flex items-center gap-4 rounded-sm border border-border bg-card p-4 transition-colors hover:border-gold"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-secondary text-gold">
                      <c.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {c.label}
                      </span>
                      <span className="block text-foreground">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-serif text-2xl text-foreground">
              Offices
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {offices.map((office) => (
                <li key={office.detail} className="flex items-start gap-4">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-gold"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {office.label}
                    </span>
                    <span className="block text-foreground">
                      {office.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-card-foreground">
              Send an enquiry
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The Segreteria will direct your message to the appropriate office.
              Please do not include clinical or sensitive information.
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
