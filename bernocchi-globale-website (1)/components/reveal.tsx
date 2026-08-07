'use client'

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

type RevealTag = 'div' | 'section' | 'span' | 'li' | 'ul' | 'p' | 'h2' | 'h3'

type RevealProps = {
  as?: RevealTag
  className?: string
  /** Stagger delay in seconds. */
  delay?: number
  /** 'up' = gentle upward fade (default); 'line' = horizontal expand. */
  variant?: 'up' | 'line'
  children?: ReactNode
}

/**
 * Scroll-triggered reveal. Adds `.is-visible` when the element enters the
 * viewport. Under prefers-reduced-motion (or without IntersectionObserver),
 * the element is shown immediately — content is never left hidden.
 */
export function Reveal({
  as = 'div',
  className,
  delay = 0,
  variant = 'up',
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn(variant === 'line' ? 'reveal-line' : 'reveal-up', className)}
      style={
        delay
          ? ({ '--reveal-delay': `${delay}s` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  )
}
