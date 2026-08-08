import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ordines } from '@/lib/ordines'
import { StatusBadge } from '@/components/status-badge'

export function InstitutionsList() {
  return (
    <ul className="divide-y divide-border rounded-sm border border-border">
      {ordines.map((ordo) => (
        <li key={ordo.slug} className="transition-colors hover:bg-muted/40">
          <Link href={`/ordines/${ordo.slug}`} className="block">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-serif text-xl text-foreground">{ordo.institution}</h3>
                  <StatusBadge status={ordo.status} label={ordo.statusLabel} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ordo.summary}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground/70">{ordo.order}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gold">
                Entrar <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
