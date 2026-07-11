'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { nav } from '@/content/home'
import styles from './LandingMenu.module.css'

/** Landing-page-only menu trigger (left). Open panel is unstyled for now. */
export default function LandingMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="打开菜单 · Open menu"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width={24} height={24}>
          <path
            d="M3 6h18M3 12h18M3 18h18"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <nav aria-label="导航菜单 · Navigation">
          <ul>
            {nav.links.map((item) => (
              <li key={item.en}>
                <Link href={item.href} onClick={close}>
                  {item.zh} {item.en}
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" onClick={close}>
            Close
          </button>
        </nav>
      ) : null}
    </div>
  )
}
