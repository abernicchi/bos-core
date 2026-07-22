import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const options = [
  {
    title: 'Book a health consultation',
    description: 'For patients and first contact with Bernocchi Health.',
    href: '/health#book',
  },
  {
    title: 'Institutional enquiry',
    description: 'For matters relating to the group and its governance.',
    href: '/contact',
  },
  {
    title: 'Professional collaboration',
    description: 'For professionals and collaboration interests.',
    href: '/contact',
  },
]

export function FinalCta() {
  return (
    <section className="on-navy border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-gold">Segreteria Generale</p>
          <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-foreground md:text-5xl">
            Begin a confidential conversation.
          </h2>
        </Reveal>
        <Reveal
          delay={0.1}
          className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3"
        >
          {options.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              className="group flex flex-col justify-between gap-8 bg-background p-8 transition-colors hover:bg-secondary"
            >
              <ArrowUpRight className="size-5 text-gold transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <div>
                <h3 className="font-serif text-xl text-foreground">
                  {option.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
