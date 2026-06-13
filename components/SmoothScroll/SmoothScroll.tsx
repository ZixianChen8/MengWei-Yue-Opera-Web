'use client'

import { useEffect, useRef } from 'react'

const EASE = 0.1
const MOBILE_SCROLL_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const ARROW_STEP = 90

export default function SmoothScroll() {
  const targetY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const mobileScrollQuery = window.matchMedia(MOBILE_SCROLL_QUERY)
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    let isActive = false

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight

    const clamp = (y: number) => Math.max(0, Math.min(maxScroll(), y))

    const tick = () => {
      const current = window.scrollY
      const diff = targetY.current - current
      if (Math.abs(diff) < 0.5) {
        window.scrollTo({ top: targetY.current, behavior: 'instant' })
        rafId.current = null
        return
      }
      window.scrollTo({ top: current + diff * EASE, behavior: 'instant' })
      rafId.current = requestAnimationFrame(tick)
    }

    // Nudge the eased target by `delta` (px) and (re)start the animation loop.
    // Used by both the wheel and keyboard handlers so every input shares one
    // smoothing pass.
    const scrollByEased = (delta: number) => {
      targetY.current = clamp(targetY.current + delta)
      if (rafId.current === null) tick()
    }

    const scrollToEased = (y: number) => {
      targetY.current = clamp(y)
      if (rafId.current === null) tick()
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      scrollByEased(e.deltaY)
    }

    // Route the common keyboard-scroll keys through the same easing. We skip
    // when focus sits in a form field / contenteditable so typing and caret
    // movement behave normally, and bail on modifier combos (browser shortcuts).
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

      switch (e.key) {
        case 'ArrowDown':
          scrollByEased(ARROW_STEP)
          break
        case 'ArrowUp':
          scrollByEased(-ARROW_STEP)
          break
        case 'PageDown':
          scrollByEased(page)
          break
        case 'PageUp':
          scrollByEased(-page)
          break
        case ' ': // Space / Shift+Space — only when not on a focusable control
          if (e.target instanceof HTMLElement &&
              (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) return
          scrollByEased(e.shiftKey ? -page : page)
          break
        case 'Home':
          scrollToEased(0)
          break
        case 'End':
          scrollToEased(maxScroll())
          break
        default:
          return
      }
      e.preventDefault()
    }

    // Ease to an in-page anchor instead of letting the browser (or Next's
    // <Link>) jump or native-smooth to it, so hash navigation shares the same
    // feel as wheel/keyboard scrolling. Runs in the capture phase to beat the
    // router's own click handler for same-page hashes.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target instanceof Element ? e.target.closest('a[href]') : null) as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      // Only handle hashes that point at an element on the current page.
      if (url.pathname !== window.location.pathname || url.search !== window.location.search) return
      if (url.hash.length < 2) return

      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (!el) return

      e.preventDefault()
      scrollToEased(el.getBoundingClientRect().top + window.scrollY)
      if (url.hash !== window.location.hash) {
        window.history.pushState(null, '', url.hash)
      }
    }

    const onScroll = () => {
      if (rafId.current === null) {
        targetY.current = window.scrollY
      }
    }

    const start = () => {
      if (isActive || mobileScrollQuery.matches || reducedMotionQuery.matches) return
      targetY.current = window.scrollY
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('click', onClick, { capture: true })
      window.addEventListener('scroll', onScroll, { passive: true })
      isActive = true
    }

    const stop = () => {
      if (!isActive) return
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('click', onClick, { capture: true })
      window.removeEventListener('scroll', onScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      rafId.current = null
      targetY.current = window.scrollY
      isActive = false
    }

    const syncScrollMode = () => {
      if (mobileScrollQuery.matches || reducedMotionQuery.matches) {
        stop()
      } else {
        start()
      }
    }

    // When the page loads with a hash (e.g. the "/#season" back-link from an
    // event page), glide down to the target from the top instead of the
    // browser's hard jump. One-shot, only while the eased scroller is active.
    const easeInitialHash = () => {
      if (!isActive || window.location.hash.length < 2) return
      const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      if (!el) return
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        scrollToEased(el.getBoundingClientRect().top + window.scrollY)
      })
    }

    syncScrollMode()
    easeInitialHash()
    mobileScrollQuery.addEventListener('change', syncScrollMode)
    reducedMotionQuery.addEventListener('change', syncScrollMode)

    return () => {
      mobileScrollQuery.removeEventListener('change', syncScrollMode)
      reducedMotionQuery.removeEventListener('change', syncScrollMode)
      stop()
    }
  }, [])

  return null
}
