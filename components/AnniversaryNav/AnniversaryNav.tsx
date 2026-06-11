'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
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

export default function AnniversaryNav() {
  const pathname = usePathname()

  return (
    <>
      <nav className={styles.pill} aria-label="十周年专场导航 · Anniversary pages">
        {ITEMS.map((item, i) => {
          const active = pathname === item.href
          return (
            <Fragment key={item.href}>
              {i > 0 && <span className={styles.dot} aria-hidden="true" />}
              <Link
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
