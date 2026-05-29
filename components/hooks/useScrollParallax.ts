'use client'

import { useCallback, useEffect, useRef } from 'react'

export interface CloudLayerConfig {
  depth: number
  scale: number  // additive scale max at p=1
  fade: number   // target opacity at p=1
}

export function useScrollParallax(
  configs: CloudLayerConfig[],
  wispBaseOpacities: number[],
) {
  const cloudRefs    = useRef<(HTMLDivElement | null)[]>([])
  const wispRefs     = useRef<(HTMLDivElement | null)[]>([])
  const figureRef    = useRef<HTMLDivElement>(null)
  const titleBlockRef = useRef<HTMLDivElement>(null)
  const titlePoemRef  = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  const setCloudRef = useCallback((index: number, element: HTMLDivElement | null) => {
    cloudRefs.current[index] = element
  }, [])

  const setWispRef = useCallback((index: number, element: HTMLDivElement | null) => {
    wispRefs.current[index] = element
  }, [])

  useEffect(() => {
    let raf: number | null = null

    function update() {
      const h = window.innerHeight
      const y = window.scrollY
      const p = Math.max(0, Math.min(1, y / (h * 0.9)))

      // cloud layers
      cloudRefs.current.forEach((layer, i) => {
        if (!layer || !configs[i]) return
        const { depth, scale: scaleMax, fade } = configs[i]
        const translateY = -p * depth * h
        const scale = 1 + p * scaleMax
        const ease = p * p * (3 - 2 * p) // smoothstep

        // Cache CSS-defined base opacity once (matches spec's getComputedStyle approach)
        if ((layer as HTMLDivElement & { _baseOpacity?: number })._baseOpacity === undefined) {
          ;(layer as HTMLDivElement & { _baseOpacity?: number })._baseOpacity =
            parseFloat(getComputedStyle(layer).opacity)
        }
        const base = (layer as HTMLDivElement & { _baseOpacity?: number })._baseOpacity!

        layer.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
        layer.style.opacity = String(base * (1 - ease) + fade * ease)
      })

      // wisps
      wispRefs.current.forEach((w, i) => {
        if (!w) return
        const dir = i % 2 === 0 ? -1 : 1
        const x = dir * p * (80 + i * 40)
        const yT = -p * 80
        w.style.transform = `translate3d(${x}px, ${yT}px, 0)`
        const baseOp = wispBaseOpacities[i] ?? 1
        w.style.opacity = String((1 - p) * baseOp)
      })

      // figure
      const fig = figureRef.current
      if (fig) {
        fig.style.transform = `translate(-50%, calc(-46% + ${-p * 60}px)) scale(${1 + p * 0.08})`
        fig.style.opacity = String(1 - p * 0.85)
      }

      // title block
      const tb = titleBlockRef.current
      if (tb) {
        tb.style.transform = `translateY(${-p * 120}px)`
        tb.style.opacity = String(1 - p * 1.2)
      }

      // poem
      const tp = titlePoemRef.current
      if (tp) {
        tp.style.transform = `translateY(${-p * 80}px)`
        tp.style.opacity = String(1 - p * 1.3)
      }

      // scroll hint
      const sh = scrollHintRef.current
      if (sh) sh.style.opacity = String(Math.max(0, 1 - p * 3))

      raf = null
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [configs, wispBaseOpacities])

  return {
    cloudRefs,
    wispRefs,
    figureRef,
    titleBlockRef,
    titlePoemRef,
    scrollHintRef,
    setCloudRef,
    setWispRef,
  }
}
