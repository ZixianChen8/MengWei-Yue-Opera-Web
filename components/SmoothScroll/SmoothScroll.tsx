'use client'

import { useEffect, useRef } from 'react'

const EASE = 0.1
const MOBILE_SCROLL_QUERY = '(max-width: 767px)'

export default function SmoothScroll() {
  const targetY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const mobileScrollQuery = window.matchMedia(MOBILE_SCROLL_QUERY)
    let isActive = false

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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetY.current = Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          targetY.current + e.deltaY
        )
      )
      if (rafId.current === null) tick()
    }

    const onScroll = () => {
      if (rafId.current === null) {
        targetY.current = window.scrollY
      }
    }

    const start = () => {
      if (isActive || mobileScrollQuery.matches) return
      targetY.current = window.scrollY
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('scroll', onScroll, { passive: true })
      isActive = true
    }

    const stop = () => {
      if (!isActive) return
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      rafId.current = null
      targetY.current = window.scrollY
      isActive = false
    }

    const syncScrollMode = () => {
      if (mobileScrollQuery.matches) {
        stop()
      } else {
        start()
      }
    }

    syncScrollMode()
    mobileScrollQuery.addEventListener('change', syncScrollMode)

    return () => {
      mobileScrollQuery.removeEventListener('change', syncScrollMode)
      stop()
    }
  }, [])

  return null
}
