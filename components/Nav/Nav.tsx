'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { nav } from '@/content/home'
import { NAV_BRANDS, type NavBrand } from '@/components/Nav/brandConfig'
import styles from './Nav.module.css'

type NavProps = {
  variant?: 'overlay' | 'horizontal'
  brand?: NavBrand
}

export default function Nav({ variant = 'overlay', brand = 'default' }: NavProps) {
  const [open, setOpen] = useState(false)

  // Lock body scroll while the overlay menu is open; restore on close/unmount.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)
  const brandConfig = NAV_BRANDS[brand]
  const logoClass = brand === 'anniversary'
    ? `${styles.logo} ${styles.anniversaryLogo}`
    : styles.logo

  const navClassName = [
    styles.nav,
    variant === 'horizontal' ? styles.horizontal : '',
    brand !== 'anniversary' ? styles.compact : '',
  ].filter(Boolean).join(' ')

  return (
    <nav className={navClassName}>
      <Link href={brandConfig.href} className={styles.brand} aria-label={brandConfig.ariaLabel}>
        <Image
          src={brandConfig.src}
          alt="加拿大孟伟越剧艺术传习所"
          width={brandConfig.width}
          height={brandConfig.height}
          className={logoClass}
          priority
        />
      </Link>

      {/* Desktop inline menu (≥1024px) */}
      <div className={styles.menu}>
        {nav.links.map((item) => (
          <Link key={item.en} href={item.href} className={styles.menuItem}>
            {item.zh}<span className={styles.en}>{item.en}</span>
          </Link>
        ))}
      </div>

      {/* Mobile/tablet trigger (≤1023px) */}
      <button
        type="button"
        className={styles.menuTrigger}
        onClick={() => setOpen(true)}
        aria-label="打开菜单 · Open menu"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Mobile/tablet overlay menu (≤1023px) */}
      <div
        className={`${styles.overlay}${open ? ` ${styles.overlayOpen}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单 · Navigation"
      >
        <div className={styles.overlayBackdrop} onClick={close} />
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelSeal}>{nav.brand.seal}</span>
            <button
              type="button"
              className={styles.panelClose}
              onClick={close}
              aria-label="关闭菜单 · Close menu"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className={styles.olList}>
            {nav.links.map((item, i) => (
              <li key={item.en}>
                <Link
                  href={item.href}
                  className={`${styles.olItem}${i === 0 ? ` ${styles.olItemAccent}` : ''}`}
                  onClick={close}
                >
                  <span className={styles.olZh}>{item.zh}</span>
                  <span className={styles.olEn}>{item.en}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
