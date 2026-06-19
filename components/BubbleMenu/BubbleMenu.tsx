'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { nav } from '@/content/home'
import styles from './BubbleMenu.module.css'

// Floating "bubble" mobile navigation (≤1023px), rendered site-wide. A persistent
// logo bubble + hamburger toggle that expands a full-screen menu of ink lozenge
// links, scaled in with a springy GSAP stagger. Adapted from the React Bits
// BubbleMenu to the studio's ink-on-paper palette and bilingual link labels;
// the desktop horizontal <Nav> takes over from 1024px up.
export default function BubbleMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  // Skip the close animation on the initial mount (the menu starts closed).
  const hasOpened = useRef(false)

  const items = nav.links

  const handleToggle = useCallback(() => setOpen((prev) => !prev), [])
  const close = useCallback(() => setOpen(false), [])

  // Lock body scroll + Escape-to-close while the menu is open.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Springy scale-in / quick scale-out of the lozenges.
  useEffect(() => {
    const overlay = overlayRef.current
    const links = linkRefs.current.filter(Boolean) as HTMLAnchorElement[]
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[]
    if (!overlay || links.length === 0) return

    const showInstantly = () => {
      gsap.set(links, { scale: 1, clearProps: 'transform' })
      gsap.set(labels, { y: 0, autoAlpha: 1 })
    }

    // requestAnimationFrame is suspended while the document is hidden
    // (background tab, headless preview), so a scale-from-0 entrance would never
    // advance and the menu would be stuck invisible. Skip the animation in that
    // case, and respect reduced-motion.
    const instant =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden

    let safety: number | undefined

    if (open) {
      hasOpened.current = true
      gsap.set(overlay, { display: 'flex' })
      if (instant) {
        showInstantly()
      } else {
        gsap.killTweensOf([...links, ...labels])
        gsap.set(links, { scale: 0, transformOrigin: '50% 50%' })
        gsap.set(labels, { y: 18, autoAlpha: 0 })
        links.forEach((link, i) => {
          const tl = gsap.timeline({ delay: i * 0.09 + gsap.utils.random(-0.04, 0.04) })
          tl.to(link, { scale: 1, duration: 0.5, ease: 'back.out(1.6)' })
          if (labels[i]) {
            tl.to(labels[i], { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, '-=0.45')
          }
        })
        // Belt-and-suspenders: force the resting state once the stagger would
        // have finished, so the menu is never left invisible if RAF stalls.
        safety = window.setTimeout(showInstantly, 1200)
      }
    } else if (hasOpened.current) {
      if (instant) {
        gsap.set(overlay, { display: 'none' })
      } else {
        gsap.killTweensOf([...links, ...labels])
        gsap.to(labels, { y: 18, autoAlpha: 0, duration: 0.18, ease: 'power3.in' })
        gsap.to(links, {
          scale: 0,
          duration: 0.2,
          ease: 'power3.in',
          onComplete: () => gsap.set(overlay, { display: 'none' }),
        })
      }
    }

    return () => {
      if (safety) window.clearTimeout(safety)
    }
  }, [open])

  // Not part of the password-gated admin chrome.
  if (pathname?.startsWith('/admin')) return null

  return (
    <div className={styles.root}>
      <nav className={styles.bar} aria-label="移动导航 · Mobile navigation">
        <Link
          href="/"
          className={`${styles.bubble} ${styles.logoBubble}`}
          aria-label="Meng Wei Yue Opera Studio home"
          onClick={close}
        >
          <Image
            src="/assets/Logo-1.PNG"
            alt="加拿大孟伟越剧艺术传习所"
            width={262}
            height={267}
            className={styles.logoImg}
            priority
          />
        </Link>

        <button
          type="button"
          className={`${styles.bubble} ${styles.toggleBubble}${open ? ` ${styles.toggleOpen}` : ''}`}
          onClick={handleToggle}
          aria-label="打开菜单 · Toggle menu"
          aria-expanded={open}
        >
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
        </button>
      </nav>

      <div ref={overlayRef} className={styles.overlay} aria-hidden={!open}>
        <ul className={styles.list} role="menu" aria-label="导航菜单 · Navigation">
          {items.map((item, i) => {
            const active =
              item.href === '/' ? pathname === '/' : Boolean(pathname?.startsWith(item.href))
            return (
              <li key={item.en} role="none" className={styles.col}>
                <Link
                  role="menuitem"
                  href={item.href}
                  aria-label={item.en}
                  aria-current={active ? 'page' : undefined}
                  className={`${styles.link}${active ? ` ${styles.linkActive}` : ''}`}
                  tabIndex={open ? undefined : -1}
                  onClick={close}
                  ref={(el) => {
                    linkRefs.current[i] = el
                  }}
                >
                  <span
                    className={styles.label}
                    ref={(el) => {
                      labelRefs.current[i] = el
                    }}
                  >
                    <span className={styles.zh}>{item.zh}</span>
                    <span className={styles.en}>{item.en}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
