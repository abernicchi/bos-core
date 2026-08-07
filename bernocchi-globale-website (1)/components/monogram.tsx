import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Official Casa Bernocchi seal, cropped directly from the approved
 * institutional artwork. The source artwork itself is not reinterpreted.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-current bg-[#050e17]',
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/images/casa-bernocchi-seal.webp"
        alt=""
        fill
        sizes="48px"
        className="object-cover"
      />
    </span>
  )
}
