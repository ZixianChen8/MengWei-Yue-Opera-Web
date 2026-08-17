'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { SpecialPillItem } from '@/content/specials'
import styles from './AnniversaryNav.module.css'

type Props = {
  items: SpecialPillItem[]
  hubHref: string
  ariaLabel: string
}

type Box = { left: number; width: number; ready: boolean }

// Use a layout effect in the browser, plain effect on the server, to avoid the
// SSR warning while still measuring before paint on the client.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function AnniversaryNav({ items, hubHref, ariaLabel }: Props) {
  const pathname = usePathname()

  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [box, setBox] = useState<Box>({ left: 0, width: 0, ready: false })
  const [transitionReady, setTransitionReady] = useState(false)

  const activeIndex = items.findIndex((it) => it.href === pathname)

  // Position the gold token over the active tab. `left`/`width` are read from
  // the active link relative to the (fixed) nav, then padded a touch so the
  // token wraps the label. The first measurement is applied without a transition
  // so the token settles in place instead of sliding from the edge.
  const measure = useCallback(() => {
    const el = itemRefs.current[activeIndex]
    if (!el) return
    setBox({ left: el.offsetLeft - 8, width: el.offsetWidth + 16, ready: true })
  }, [activeIndex])

  // Re-measure on the route change (the slide trigger) and on first mount.
  useIsoLayoutEffect(() => {
    if (activeIndex < 0) return
    measure()
  }, [measure, activeIndex])

  // Fonts (Ma Shan Zheng) load async and change tab widths; the nav can also
  // change width on rotate/resize. Re-measure on both so the token stays snug.
  useEffect(() => {
    if (activeIndex < 0) return

    let cancelled = false
    const remeasure = () => { if (!cancelled) measure() }

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(remeasure)
    }

    const nav = navRef.current
    let ro: ResizeObserver | undefined
    if (nav && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(remeasure)
      ro.observe(nav)
    }

    return () => {
      cancelled = true
      ro?.disconnect()
    }
  }, [measure, activeIndex])

  // After the very first measurement, re-enable transitions so subsequent route
  // changes animate.
  useEffect(() => {
    if (box.ready && !transitionReady) {
      const id = requestAnimationFrame(() => { setTransitionReady(true) })
      return () => cancelAnimationFrame(id)
    }
  }, [box.ready, transitionReady])

  // The shared layout renders this on every /special/[slug] route; keep it off
  // the hub itself (which *is* the menu).
  if (pathname === hubHref) return null

  const indicatorStyle: React.CSSProperties = {
    transform: `translateX(${box.left}px)`,
    width: box.width,
    ...(!transitionReady ? { transition: 'none' } : null),
  }

  return (
    <>
      <nav ref={navRef} className={styles.pill} aria-label={ariaLabel}>
        <span
          className={`${styles.indicator}${box.ready ? '' : ` ${styles.inactive}`}`}
          style={indicatorStyle}
          aria-hidden="true"
        />
        {items.map((item, i) => {
          const active = pathname === item.href
          return (
            <Fragment key={item.href}>
              {i > 0 && <span className={styles.dot} aria-hidden="true" />}
              <Link
                ref={(el) => { itemRefs.current[i] = el }}
                href={item.href}
                className={`${styles.item}${active ? ` ${styles.active}` : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className={styles.cn}>{item.zh}</span>
                <span className={styles.en}>{item.en}</span>
              </Link>
            </Fragment>
          )
        })}
      </nav>
      <div className={styles.spacer} aria-hidden="true" />
    </>
  )
}
