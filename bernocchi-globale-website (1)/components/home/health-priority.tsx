import { ArrowRight } from 'lucide-react'
import { healthServices, whatsappUrl } from '@/lib/content'
import { CtaLink } from '@/components/cta-link'
import { StatusBadge } from '@/components/status-badge'
import { ParallaxImage } from '@/components/parallax-image'
import { Reveal } from '@/components/reveal'
import { formatPrice } from '@/lib/format'

export function HealthPriority() {
  return (
    <section className="border-b border-border bg-card">
      {/* Editorial banner */}
      <div className="relative">
        <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
          <ParallaxImage
            src="/images/health-calm.png"
            alt="A calm, professional space for Bernocchi Health consultations"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>
        <div className="mx-auto -mt-24 max-w-7xl px-6 lg:px-10">
          <Reveal className="relative max-w-3xl">
            <div className="flex items-center gap-3">
              <p className="eyebrow text-gold">Bernocchi Health</p>
              <StatusBadge status="operating" />
            </div>
            <h2 className="mt-4 text-balance font-serif text-4xl leading-[1.05] text-card-foreground md:text-5xl">
              Professional care with institutional standards.
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              The first operating institution of the group. Care delivered by
              licensed professionals, with the discipline, confidentiality and
              continuity of an institution.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Service catalogue */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-14 lg:px-10 lg:pb-28">
        <Reveal className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {healthServices.map((service) => (
            <article
              key={service.id}
              className="flex flex-col gap-5 bg-card p-7"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-xl text-card-foreground">
                  {service.name}
                </h3>
                <span className="whitespace-nowrap text-sm font-medium text-gold">
                  {formatPrice(service.priceInCents, service.currency)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {service.duration}
              </p>
            </article>
          ))}
        </Reveal>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <CtaLink href="/health#book" variant="gold">
            Book a Consultation
            <ArrowRight className="size-4" />
          </CtaLink>
          <CtaLink href="/health" variant="outline">
            Explore Bernocchi Health
          </CtaLink>
          <CtaLink href={whatsappUrl} variant="quiet" external>
            Or message us on WhatsApp
          </CtaLink>
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Compliance note: clinical services are delivered exclusively by
          licensed professionals, in accordance with applicable regulations and
          jurisdictional eligibility. Consultations are confidential.
        </p>
      </div>
    </section>
  )
}
