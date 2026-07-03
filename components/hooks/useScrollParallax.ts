'use client'

import { useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface CloudLayerConfig {
  depth: number
  scale: number  // additive scale max at p=1
  fade: number   // target opacity at p=1
  drift?: number // xPercent drift at p=1
  duration?: number
  at?: number
}

export function useScrollParallax(
  configs: CloudLayerConfig[],
  wispBaseOpacities: number[],
  enableClouds = true,
) {
  const heroRef      = useRef<HTMLElement>(null)
  const cloudRefs    = useRef<(HTMLDivElement | null)[]>([])
  const wispRefs     = useRef<(HTMLDivElement | null)[]>([])
  const titleBlockRef = useRef<HTMLDivElement>(null)
  const titlePoemRef  = useRef<HTMLDivElement>(null)
  const mistRef       = useRef<HTMLDivElement>(null)

  const setCloudRef = useCallback((index: number, element: HTMLDivElement | null) => {
    cloudRefs.current[index] = element
  }, [])

  const setWispRef = useCallback((index: number, element: HTMLDivElement | null) => {
    wispRefs.current[index] = element
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const cloudLayers = cloudRefs.current.filter(Boolean) as HTMLDivElement[]
      const wisps = wispRefs.current.filter(Boolean) as HTMLDivElement[]
      const titleTargets = [titleBlockRef.current, titlePoemRef.current].filter(Boolean) as HTMLDivElement[]
      const mist = mistRef.current

      media.add('(prefers-reduced-motion: reduce)', () => {
        if (mist) gsap.set(mist, { autoAlpha: 0 })
        return () => undefined
      })

      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (enableClouds) {
          gsap.set(cloudLayers, {
            force3D: true,
            transformOrigin: '50% 100%',
          })
          gsap.set(wisps, {
            force3D: true,
            transformOrigin: '50% 50%',
          })
          if (mist) gsap.set(mist, { autoAlpha: 0 })

          wisps.forEach((wisp, i) => {
            gsap.set(wisp, { autoAlpha: wispBaseOpacities[i] ?? 1 })
          })
        }

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        titleTargets.forEach((target, i) => {
          timeline.to(target, {
            y: i === 0 ? -150 : -110,
            autoAlpha: 0,
            duration: 0.45,
          }, 0)
        })

        wisps.forEach((wisp, i) => {
          if (!enableClouds) return

          const dir = i % 2 === 0 ? -1 : 1
          timeline.to(wisp, {
            x: dir * (140 + i * 46),
            y: -130,
            scale: 1.18 + i * 0.08,
            autoAlpha: 0,
            duration: 0.62,
          }, 0)
        })

        cloudLayers.forEach((layer, i) => {
          if (!enableClouds) return

          const config = configs[i]
          if (!config) return

          timeline.to(layer, {
            xPercent: config.drift ?? 0,
            y: () => -window.innerHeight * config.depth,
            scale: 1 + config.scale,
            autoAlpha: config.fade,
            duration: config.duration ?? 1,
          }, config.at ?? 0)
        })

        if (enableClouds && mist) {
          timeline
            .to(mist, {
              autoAlpha: 0.86,
              duration: 0.34,
            }, 0.24)
            .to(mist, {
              autoAlpha: 0,
              duration: 0.36,
            }, 0.68)
        }

        const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())

        return () => {
          cancelAnimationFrame(refresh)
          timeline.kill()
        }
      })

    }, hero)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [configs, wispBaseOpacities, enableClouds])

  return {
    heroRef,
    cloudRefs,
    wispRefs,
    titleBlockRef,
    titlePoemRef,
    mistRef,
    setCloudRef,
    setWispRef,
  }
}
