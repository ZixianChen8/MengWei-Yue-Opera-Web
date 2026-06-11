'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './AnniversaryNav.module.css'

// Floating bottom "pill" nav for the 10th-anniversary sub-pages (≤1023px only).
// Lets readers jump between the hub + the three sibling pages without scrolling
// back to the top hamburger menu. Labels are kept short (single line, ~2–3
// glyphs) so four items fit comfortably at ~360px; hrefs match the anniversary
// pages (the hub + the three `anniversary.menu` entries).
const ITEMS = [
  { zh: '专场', en: 'Gala', href: '/anniversary' },
  { zh: '场刊', en: 'Book', href: '/anniversary/booklet' },
  { zh: '节目单', en: 'Acts', href: '/anniversary/programme' },
  { zh: '导赏', en: 'Guide', href: '/anniversary/appreciation' },
]

const HUB = '/anniversary'

type Box = { left: number; width: number; ready: boolean }

// Use a layout effect in the browser, plain effect on the server, to avoid the
// SSR warning while still measuring before paint on the client.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function AnniversaryNav() {
  const pathname = usePathname()

  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const firstRef = useRef(true)
  const [box, setBox] = useState<Box>({ left: 0, width: 0, ready: false })

  const activeIndex = ITEMS.findIndex((it) => it.href === pathname)

  // Position the gold token over the active tab. `left`/`width` are read from
  // the active link relative to the (fixed) nav, then padded a touch so the
  // token wraps the label. The first measurement is applied without a transition
  // (firstRef) so the token settles in place instead of sliding from the edge.
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
    if (box.ready && firstRef.current) {
      const id = requestAnimationFrame(() => { firstRef.current = false })
      return () => cancelAnimationFrame(id)
    }
  }, [box.ready])

  // The shared layout renders this on every /anniversary route; keep it off the
  // hub itself (which *is* the menu), matching the original per-page behaviour.
  if (pathname === HUB) return null

  const indicatorStyle: React.CSSProperties = {
    transform: `translateX(${box.left}px)`,
    width: box.width,
    ...(firstRef.current ? { transition: 'none' } : null),
  }

  return (
    <>
      <nav ref={navRef} className={styles.pill} aria-label="十周年专场导航 · Anniversary pages">
        <span
          className={`${styles.indicator}${box.ready ? '' : ` ${styles.inactive}`}`}
          style={indicatorStyle}
          aria-hidden="true"
        />
        {ITEMS.map((item, i) => {
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
