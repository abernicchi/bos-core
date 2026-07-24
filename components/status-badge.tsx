import { cn } from '@/lib/utils'
import { statusLabels, type InstitutionStatus } from '@/lib/content'

const styles: Record<InstitutionStatus, string> = {
  operating: 'border-gold/50 text-gold',
  development: 'border-border text-muted-foreground',
  planned: 'border-border text-muted-foreground',
  future: 'border-border text-muted-foreground',
}

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: InstitutionStatus
  label?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.14em]',
        styles[status],
        className,
      )}
    >
      {status === 'operating' ? (
        <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
      ) : null}
      {label ?? statusLabels[status]}
    </span>
  )
}
