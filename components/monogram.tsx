import { cn } from '@/lib/utils'

/**
 * TEMPORARY geometric "B" monogram.
 * This is a placeholder wordmark symbol — keep replaceable.
 * The definitive institutional symbol will be added later.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border border-current',
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="size-[62%]"
        role="presentation"
      >
        <path
          d="M9 5h9c3.3 0 6 2.2 6 5.2 0 2.1-1.3 3.9-3.3 4.8 2.4.7 4.1 2.7 4.1 5.3 0 3.4-3 6-6.8 6H9V5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 16h9" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  )
}
