'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { overture } from '@/content/home'
import { MM_DESKTOP, MM_MOBILE, MM_REDUCED, revealBatch } from '@/components/hooks/scrollStory'
import styles from './Overture.module.css'

export default function Overture() {
  const scopeRef = useRef<HTMLElement>(null)
  const colLRef = useRef<HTMLDivElement>(null)
  const colRRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      // Reduced motion: leave everything at its natural, fully-visible state.
      media.add(MM_REDUCED, () => undefined)

      // Shared reveal (both desktop + mobile get the staggered fade/rise).
      const addReveals = () => revealBatch(scope, '[data-reveal]', { stagger: 0.1 })

      // Desktop: reveals + a gentle two-speed column parallax for depth.
      media.add(MM_DESKTOP, () => {
        addReveals()
        const st = {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        }
        gsap.fromTo(colLRef.current, { y: -18 }, { y: 34, ease: 'none', scrollTrigger: st })
        gsap.fromTo(colRRef.current, { y: 18 }, { y: -26, ease: 'none', scrollTrigger: st })
      })

      // Mobile: reveals only (no parallax to keep single-column layout calm).
      media.add(MM_MOBILE, () => {
        addReveals()
      })
    }, scope)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section id="overture" className={styles.section} ref={scopeRef}>
      <div className={styles.inner}>
        <div ref={colLRef}>
          <h2 className={styles.title} data-reveal>
            {overture.title.zh[0]}<br />{overture.title.zh[1]}
            <small>{overture.title.en}</small>
          </h2>
          <blockquote className={styles.quote} data-reveal>
            &ldquo;{overture.quote.text}&rdquo;
          </blockquote>
        </div>

        <div className={styles.body} ref={colRRef}>
          {overture.body.map((p, i) => <p key={i} data-reveal>{p}</p>)}
        </div>
      </div>
    </section>
  )
}
