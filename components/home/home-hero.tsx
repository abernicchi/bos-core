import type { CSSProperties } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CtaLink } from '@/components/cta-link'

export function HomeHero() {
  return (
    <section className="on-navy relative overflow-hidden border-b border-border">
      {/* Architectural marble accent — material, not stock photography */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Image
          src="/images/marble-detail.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-transparent" />
      </div>

      {/* Geometric hairlines */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-10">
          <div className="grid h-full grid-cols-3">
            <div className="border-l border-border/30" />
            <div className="border-l border-border/30" />
            <div className="border-x border-border/30" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-36">
        <div className="flex flex-col justify-center">
          <p
            className="eyebrow hero-eyebrow text-gold"
            style={{ '--delay': '0.05s' } as CSSProperties}
          >
            Founded in Italy
            <span
              aria-hidden="true"
              className="ml-1.5 inline-block align-baseline tracking-normal"
            >
              🇮🇹
            </span>
          </p>
          <h1 className="mt-6 max-w-3xl text-balance font-serif text-5xl font-light leading-[1.03] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span
              className="hero-item block"
              style={{ '--delay': '0.25s' } as CSSProperties}
            >
              Italian excellence,
            </span>
            <span
              className="hero-item block"
              style={{ '--delay': '0.4s' } as CSSProperties}
            >
              built to endure.
            </span>
          </h1>
          <p
            className="hero-item mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            style={{ '--delay': '0.6s' } as CSSProperties}
          >
            Casa Bernocchi is the institutional identity of Bernocchi Globale
            Holdings, developing professional excellence across health, law,
            science and innovation.
          </p>
          <div
            className="hero-item mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ '--delay': '0.75s' } as CSSProperties}
          >
            <CtaLink href="/health#book" variant="gold">
              Book a Consultation
              <ArrowRight className="size-4" />
            </CtaLink>
            <CtaLink href="/casa" variant="outline">
              Discover Casa Bernocchi
            </CtaLink>
          </div>
          <p
            className="hero-item mt-12 text-xs uppercase tracking-[0.24em] text-muted-foreground"
            style={{ '--delay': '0.9s' } as CSSProperties}
          >
            Milano{' '}
            <span aria-hidden="true" className="tracking-normal">
              🇮🇹
            </span>{' '}
            · San José{' '}
            <span aria-hidden="true" className="tracking-normal">
              🇨🇷
            </span>
          </p>
        </div>

        <div className="relative hidden items-end lg:flex">
          <div className="ml-auto space-y-2 border-l border-gold/40 pl-6">
            <p
              className="hero-item text-xs uppercase tracking-[0.24em] text-gold"
              style={{ '--delay': '1s' } as CSSProperties}
            >
              Scientia
            </p>
            <p
              className="hero-item text-xs uppercase tracking-[0.24em] text-gold"
              style={{ '--delay': '1.12s' } as CSSProperties}
            >
              Integritas
            </p>
            <p
              className="hero-item text-xs uppercase tracking-[0.24em] text-gold"
              style={{ '--delay': '1.24s' } as CSSProperties}
            >
              Posteritas
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
