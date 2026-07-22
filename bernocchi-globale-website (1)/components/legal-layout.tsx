import type { ReactNode } from 'react'

type Props = {
  title: string
  updated: string
  children: ReactNode
}

export function LegalLayout({ title, updated, children }: Props) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <header className="border-b border-border/60 pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
          Legal document
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: {updated}
        </p>
      </header>

      <div className="legal-body mt-10 space-y-8">{children}</div>

      <p className="mt-12 rounded-sm border border-border/60 bg-secondary p-5 text-sm leading-relaxed text-muted-foreground">
        Note: this text is a template provided for informational purposes and
        must be reviewed and adapted by a qualified legal professional before
        final publication, according to the applicable jurisdictions (Italy and
        Costa Rica).
      </p>
    </article>
  )
}

type SectionProps = { heading: string; children: ReactNode }

export function LegalSection({ heading, children }: SectionProps) {
  return (
    <section>
      <h2 className="font-serif text-xl text-foreground">{heading}</h2>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}
