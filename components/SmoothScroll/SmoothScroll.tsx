'use client'

import { useEffect, useRef } from 'react'

const EASE = 0.1

export default function SmoothScroll() {
  const targetY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    targetY.current = window.scrollY

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

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return null
}
