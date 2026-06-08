'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import styles from './Reveal.module.css'

type RevealProps = {
  children: ReactNode
  /** Element to render as (default 'div'). */
  as?: ElementType
  /** Extra class names placed alongside the reveal classes. */
  className?: string
  /** Stagger delay in seconds (→ transition-delay). */
  delay?: number
}

// Lightweight scroll-reveal wrapper: fades/rises its children in the first time
// they enter the viewport (reveal-once), then stops observing. Honors
// prefers-reduced-motion via CSS. Works under SmoothScroll because the
// IntersectionObserver re-evaluates as the scroll position changes.
export default function Reveal({ children, as, className, delay }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      // Very old/SSR environments: reveal immediately (deferred to avoid a
      // synchronous setState in the effect body).
      const id = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(id)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style = delay ? ({ transitionDelay: `${delay}s` } as CSSProperties) : undefined

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal}${shown ? ` ${styles.in}` : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </Tag>
  )
}
