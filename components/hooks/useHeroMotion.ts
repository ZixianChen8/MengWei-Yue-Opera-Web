'use client'

import { useEffect, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const HERO_MOTION_MIN_WIDTH = 768

const MOTION_QUERY =
  `(min-width: ${HERO_MOTION_MIN_WIDTH}px) and (prefers-reduced-motion: no-preference)`
const STATIC_QUERY =
  `(max-width: ${HERO_MOTION_MIN_WIDTH - 1}px), (prefers-reduced-motion: reduce)`

type UseHeroMotionArgs = {
  heroRef: RefObject<HTMLElement | null>
  veilRef: RefObject<HTMLElement | null>
  wordmarkRef: RefObject<HTMLElement | null>
  cutoutRef: RefObject<HTMLElement | null>
}

export function useHeroMotion({ heroRef, veilRef, wordmarkRef, cutoutRef }: UseHeroMotionArgs) {
  const [entranceDone, setEntranceDone] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const hero = heroRef.current
    const veil = veilRef.current
    const wordmark = wordmarkRef.current
    const cutout = cutoutRef.current
    if (!hero || !veil || !wordmark || !cutout) return

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      media.add(MOTION_QUERY, () => {
        setEntranceDone(false)

        gsap.set(veil, { autoAlpha: 1 })
        gsap.set(wordmark, { autoAlpha: 0, y: 16 })
        gsap.set(cutout, { autoAlpha: 0, y: 28 })

        const entrance = gsap.timeline({
          defaults: { ease: 'power3.out' },
        })

        entrance
          .to(veil, { autoAlpha: 0, duration: 0.85, ease: 'power2.inOut' })
          .to(wordmark, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.2')
          .to(cutout, { autoAlpha: 1, y: 0, duration: 0.75 }, '-=0.25')

        let exitTween: gsap.core.Tween | undefined

        const enableExit = () => {
          exitTween = gsap.to(wordmark, {
            autoAlpha: 0,
            y: -32,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
        }

        entrance.eventCallback('onComplete', () => {
          enableExit()
          setEntranceDone(true)
          ScrollTrigger.refresh()
        })

        return () => {
          entrance.kill()
          exitTween?.scrollTrigger?.kill()
          exitTween?.kill()
          gsap.set([veil, wordmark, cutout], { clearProps: 'opacity,visibility,transform' })
          setEntranceDone(false)
        }
      })

      media.add(STATIC_QUERY, () => {
        gsap.set(veil, { autoAlpha: 0 })
        gsap.set([wordmark, cutout], { autoAlpha: 1, y: 0 })
        setEntranceDone(true)
        return () => undefined
      })
    }, hero)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [heroRef, veilRef, wordmarkRef, cutoutRef])

  return { entranceDone }
}
