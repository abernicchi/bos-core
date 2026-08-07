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
        Mandatory rights under applicable law prevail over any conflicting term.
        For questions or to exercise a right, contact the Segreteria Generale
        through the official details published on this site.
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
