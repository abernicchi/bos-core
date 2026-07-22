import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'gold' | 'quiet'

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90',
  gold: 'bg-gold text-navy hover:bg-gold/90',
  outline:
    'border border-border text-foreground hover:border-gold hover:text-gold',
  quiet:
    'text-foreground underline-offset-4 hover:text-gold',
}

type Props = {
  href: string
  variant?: Variant
  className?: string
  children: React.ReactNode
  external?: boolean
}

export function CtaLink({
  href,
  variant = 'primary',
  className,
  children,
  external,
}: Props) {
  const classes = cn(base, variants[variant], className)
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
