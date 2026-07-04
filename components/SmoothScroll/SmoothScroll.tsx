'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const ARROW_STEP = 90

// Lenis config. `lerp: 0.1` matches the old hand-rolled easing; `anchors`
// smooths same-page #hash link clicks. Touch is left native (syncTouch off).
const LENIS_OPTIONS: LenisOptions = {
  lerp: 0.1,
  smoothWheel: true,
  anchors: true,
}

// Root smooth-scroll provider, mounted once in app/layout.tsx around {children}.
// Lenis only runs on desktop pointer devices: it stays OFF below 768px, under
// prefers-reduced-motion, and on /admin — in those cases we render children
// untouched so the browser's native scrolling takes over (matching the prior
// behavior of the hand-rolled component).
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  // Starts false so the server render and first client render both emit plain
  // children (no Lenis), avoiding a hydration mismatch from the media queries.
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY)
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY)
    const sync = () => setEnabled(!mobile.matches && !reduced.matches)
    sync()
    mobile.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    return () => {
      mobile.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
    }
  }, [])

  const isAdmin = pathname?.startsWith('/admin') ?? false

  if (!enabled || isAdmin) return <>{children}</>

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
      <LenisExtras />
    </ReactLenis>
  )
}

// Behaviors Lenis doesn't cover natively, driven off the active instance.
function LenisExtras() {
  const lenis = useLenis()

  // Bridge Lenis and GSAP ScrollTrigger: feed Lenis scroll events into
  // ScrollTrigger.update so pins/scrubs track the eased position, and resize
  // Lenis whenever ScrollTrigger refreshes (fonts/images/layout settle). When
  // Lenis is off (mobile / reduced-motion / /admin) this component never
  // mounts, so ScrollTrigger falls back to native scroll — which is fine.
  useEffect(() => {
    if (!lenis) return

    gsap.registerPlugin(ScrollTrigger)
    lenis.on('scroll', ScrollTrigger.update)
    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
    }
  }, [lenis])

  // Route the common keyboard-scroll keys through Lenis so they ease like the
  // wheel. Relative keys accumulate against `targetScroll` (Lenis clamps to
  // limit). Skips form fields / contenteditable and modifier combos; Space on a
  // focused button/link is left to activate the control.
  useEffect(() => {
    if (!lenis) return

    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false
      if (el.isContentEditable) return true
      const tag = el.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (isTypingTarget(e.target)) return

      const page = window.innerHeight * 0.9
      let delta: number | null = null
      let absolute: number | null = null

      switch (e.key) {
        case 'ArrowDown': delta = ARROW_STEP; break
        case 'ArrowUp': delta = -ARROW_STEP; break
        case 'PageDown': delta = page; break
        case 'PageUp': delta = -page; break
        case ' ':
          if (e.target instanceof HTMLElement &&
              (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) return
          delta = e.shiftKey ? -page : page
          break
        case 'Home': absolute = 0; break
        case 'End': absolute = lenis.limit; break
        default: return
      }

      e.preventDefault()
      if (absolute !== null) lenis.scrollTo(absolute)
      else if (delta !== null) lenis.scrollTo(lenis.targetScroll + delta)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lenis])

  // Ease to an on-load hash target (e.g. the "/#season" back-link arriving from
  // an event page). `anchors` only handles click events, not a hash already
  // present at mount. Idempotent, so a double-fire with `anchors` is harmless.
  useEffect(() => {
    if (!lenis || window.location.hash.length < 2) return
    const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    if (!el) return
    const raf = requestAnimationFrame(() => lenis.scrollTo(el))
    return () => cancelAnimationFrame(raf)
  }, [lenis])

  return null
}
