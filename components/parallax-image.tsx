'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type ParallaxImageProps = {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
  /** Maximum vertical travel in px (kept within the -inset bleed). */
  strength?: number
}

/**
 * Very subtle transform-based parallax for editorial banners.
 * The image sits in an over-sized (-inset-6 = 24px bleed) layer so the gentle
 * translate never reveals an edge and never causes layout shift. Disabled
 * under prefers-reduced-motion.
 */
export function ParallaxImage({
  src,
  alt,
  sizes = '100vw',
  priority = false,
  className,
  strength = 14,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh
        const clamped = Math.max(-1, Math.min(1, progress))
        el.style.transform = `translate3d(0, ${clamped * strength}px, 0)`
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength])

  return (
    <div ref={ref} className="parallax-soft absolute -inset-6">
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', className)}
      />
    </div>
  )
}
