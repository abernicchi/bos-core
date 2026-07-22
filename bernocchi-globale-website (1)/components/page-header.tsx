import { cn } from '@/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow?: string
  title: string
  intro?: string
  className?: string
}) {
  return (
    <section className={cn('on-navy border-b border-border', className)}>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        {eyebrow ? (
          <p className="eyebrow reveal text-gold">{eyebrow}</p>
        ) : null}
        <h1 className="reveal mt-4 max-w-4xl text-balance font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="reveal mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  )
}
