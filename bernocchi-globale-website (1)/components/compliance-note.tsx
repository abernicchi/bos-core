import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComplianceNote({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-2.5 rounded-sm border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground',
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
