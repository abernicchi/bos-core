import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { institutions } from '@/lib/content'
import { StatusBadge } from '@/components/status-badge'

export function InstitutionsList() {
  return (
    <ul className="divide-y divide-border rounded-sm border border-border">
      {institutions.map((inst) => {
        const content = (
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-serif text-xl text-foreground">
                  {inst.name}
                </h3>
                <StatusBadge status={inst.status} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {inst.summary}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground/70">
                {inst.order}
              </p>
            </div>
            {inst.href ? (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gold">
                Explore
                <ArrowUpRight className="size-4" />
              </span>
            ) : null}
          </div>
        )

        return (
          <li key={inst.slug} className="transition-colors hover:bg-muted/40">
            {inst.href ? (
              <Link href={inst.href} className="block">
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ul>
  )
}
