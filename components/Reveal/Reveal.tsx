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
  /**
   * Any other props (href, id, aria-*, …) are forwarded to the rendered
   * element, so Reveal can stand in for a real <section id>, <Link href>, etc.
   */
  [prop: string]: unknown
}

// Lightweight scroll-reveal wrapper: fades/rises its children in the first time
// they enter the viewport (reveal-once), then stops observing. Honors
// prefers-reduced-motion via CSS. Works under SmoothScroll because the
// IntersectionObserver re-evaluates as the scroll position changes.
export default function Reveal({ children, as, className, delay, ...rest }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let done = false
    let teardown = () => {}
    const reveal = () => {
      if (done) return
      done = true
      teardown()
      setShown(true)
    }

    if (typeof IntersectionObserver === 'undefined') {
      // Very old/SSR environments: reveal immediately (deferred to avoid a
      // synchronous setState in the effect body).
      const id = requestAnimationFrame(reveal)
      return () => cancelAnimationFrame(id)
    }

    // Manual rect check, used both for the initial in-view case and as a
    // scroll/resize backstop. Reveals once any part of the element clears the
    // bottom-8% trigger line — mirrors the observer's rootMargin.
    const inView = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return r.top < vh * 0.92 && r.bottom > 0
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal()
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)

    // Backstop: if the observer never reports an intersection (it can miss in
    // some browsers when scrolling is driven programmatically, when a scroll
    // position is restored, or under certain zoom levels), a passive scroll +
    // resize listener guarantees the content still appears. Whichever fires
    // first wins; `reveal()` is idempotent.
    const onScroll = () => { if (inView()) reveal() }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    teardown = () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }

    // Cover the case where the element is already on/above the fold at mount.
    if (inView()) reveal()

    return teardown
  }, [])

  const style = delay ? ({ transitionDelay: `${delay}s` } as CSSProperties) : undefined

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal}${shown ? ` ${styles.in}` : ''}${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
