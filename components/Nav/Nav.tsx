'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { nav, contact } from '@/content/home'
import { galleryPage } from '@/content/gallery'
import { siteNavLinks } from '@/lib/nav-links'
import { NAV_BRANDS, resolveNavBrand, type NavBrand } from '@/components/Nav/brandConfig'
import { selectMenuPhotos } from '@/components/Nav/selectMenuPhotos'
import {
  useDesktopMenuMotion,
  type MenuMotionState,
} from '@/components/Nav/useDesktopMenuMotion'
import styles from './Nav.module.css'

type NavProps = {
  variant?: 'overlay' | 'horizontal'
  brand?: NavBrand
}

const photos = selectMenuPhotos(galleryPage.photos)

const contactLink = {
  zh: contact.email,
  en: 'Contact',
  href: `mailto:${contact.email}`,
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Nav({ variant = 'overlay', brand = 'default' }: NavProps) {
  // Legacy mobile overlay state (Nav is display:none ≤1023; BubbleMenu owns mobile).
  const [open, setOpen] = useState(false)

  const [menuState, setMenuState] = useState<MenuMotionState>('closed')
  const [desktopEnabled, setDesktopEnabled] = useState(false)

  const pathname = usePathname() ?? '/'
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const desktopToggleRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => {
      const matches = mq.matches
      setDesktopEnabled(matches)
      if (!matches) {
        setMenuState('closed')
        const overlay = overlayRef.current
        if (overlay) {
          overlay.hidden = true
          overlay.classList.remove(styles.isOpen)
        }
        document.body.style.overflow = ''
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useDesktopMenuMotion({
    overlayRef,
    panelRef,
    state: menuState,
    setState: setMenuState,
    enabled: desktopEnabled,
    isOpenClass: styles.isOpen,
    onClosed: () => {
      if (restoreFocusRef.current) {
        restoreFocusRef.current = false
        desktopToggleRef.current?.focus()
      }
    },
  })

  // Legacy mobile overlay scroll lock (inert on desktop; kept for markup parity).
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Desktop menu scroll lock + Escape.
  useEffect(() => {
    if (!desktopEnabled) return
    if (menuState === 'closed') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        // Close from open or mid-open; reverse() picks up from current progress.
        if (menuState === 'open' || menuState === 'opening') {
          restoreFocusRef.current = true
          setMenuState('closing')
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [menuState, desktopEnabled])

  // Focus trap while desktop menu is open/opening.
  useEffect(() => {
    if (!desktopEnabled) return
    if (menuState !== 'open' && menuState !== 'opening') return
    const overlay = overlayRef.current
    const toggle = desktopToggleRef.current
    if (!overlay || !toggle) return

    const getFocusable = () => {
      const nodes = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      return [toggle, ...Array.from(nodes)]
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (active === first || !overlay.contains(active) && active !== toggle) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuState, desktopEnabled])

  const handleDesktopToggle = useCallback(() => {
    if (!desktopEnabled) return
    // Allow interrupt mid-transition — motion hook reverses from current progress.
    if (menuState === 'open' || menuState === 'opening') {
      restoreFocusRef.current = true
      setMenuState('closing')
    } else {
      setMenuState('opening')
    }
  }, [desktopEnabled, menuState])

  const closeDesktopMenu = useCallback(() => {
    // Links only dismiss once fully open so a mid-open click cannot abort the curtain.
    if (menuState === 'open') {
      restoreFocusRef.current = true
      setMenuState('closing')
    }
  }, [menuState])

  const close = () => setOpen(false)
  const resolved = resolveNavBrand(pathname)
  const brandConfig = resolved.brand === 'special' ? resolved.config : NAV_BRANDS[brand]
  const wideLogo = resolved.wideLogo
  const logoClass = wideLogo ? `${styles.logo} ${styles.anniversaryLogo}` : styles.logo

  const navClassName = [
    styles.nav,
    variant === 'horizontal' ? styles.horizontal : '',
    wideLogo ? '' : styles.compact,
    menuState !== 'closed' ? styles.menuActive : '',
  ]
    .filter(Boolean)
    .join(' ')

  const toggleOpen = menuState === 'open' || menuState === 'opening' || menuState === 'closing'

  return (
    <header className={navClassName}>
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

      {/* Desktop toggle — visible ≥1024px */}
      <button
        ref={desktopToggleRef}
        type="button"
        id="desktop-nav-toggle"
        className={`${styles.desktopToggle}${toggleOpen ? ` ${styles.desktopToggleOpen}` : ''}`}
        aria-label={toggleOpen ? '关闭菜单 · Close menu' : '打开菜单 · Open menu'}
        aria-expanded={menuState === 'open' || menuState === 'opening'}
        aria-controls="desktop-nav-overlay"
        onClick={handleDesktopToggle}
      >
        <span className={styles.desktopToggleIcon} aria-hidden="true">
          <span className={styles.line1} />
          <span className={styles.line2} />
          <span className={styles.line3} />
        </span>
      </button>

      {/* Desktop full-screen overlay — ≥1024px only via CSS + matchMedia */}
      <div
        id="desktop-nav-overlay"
        ref={overlayRef}
        className={styles.desktopOverlay}
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单 · Navigation"
        hidden
      >
        <div ref={panelRef} className={styles.desktopPanel}>
          <div className={styles.desktopGrid}>
            <div
              className={styles.desktopMedia}
              data-count={photos.length}
              aria-hidden={photos.length === 0}
            >
              {photos.map((photo) => (
                <div key={photo.image} className={styles.mediaCell}>
                  <div className={styles.mediaMask} data-menu-media-mask>
                    <Image
                      src={photo.image}
                      alt={photo.title || photo.description || '剧照'}
                      fill
                      sizes="(min-width: 1024px) 25vw, 0px"
                      className={styles.mediaImg}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.desktopNavCol}>
              <nav aria-label="主导航 · Primary">
                <ul className={styles.desktopLinkList}>
                  {siteNavLinks.map((item) => {
                    const active = isActivePath(pathname, item.href)
                    return (
                      <li key={item.en} className={styles.desktopLinkItem}>
                        <div className={styles.linkMask} data-menu-link-mask>
                          <Link
                            href={item.href}
                            className={styles.desktopLink}
                            aria-current={active ? 'page' : undefined}
                            onClick={closeDesktopMenu}
                          >
                            <span className={styles.desktopLinkZh}>{item.zh}</span>
                            <span className={styles.desktopLinkEn}>{item.en}</span>
                            {active ? (
                              <span
                                className={styles.activeMark}
                                data-menu-active-mark
                                aria-hidden="true"
                              />
                            ) : null}
                          </Link>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <div className={styles.desktopSupport} data-menu-support>
                <a href={contactLink.href} className={styles.contactLink}>
                  <span>留书 · Contact</span>
                  <span>{contactLink.zh}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legacy mobile overlay markup retained but inert: Nav is display:none
          ≤1023px and BubbleMenu owns mobile. Hidden from AT on desktop. */}
      <button
        type="button"
        className={styles.menuTrigger}
        onClick={() => setOpen(true)}
        aria-label="打开菜单 · Open menu"
        aria-expanded={open}
        tabIndex={-1}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div
        className={`${styles.overlay}${open ? ` ${styles.overlayOpen}` : ''}`}
        role="presentation"
        aria-hidden="true"
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
            {siteNavLinks.map((item, i) => (
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
    </header>
  )
}
