'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact, studio } from '@/content/home'
import {
  MM_DESKTOP,
  MM_MOBILE,
  MM_REDUCED,
  revealBatch,
} from '@/components/hooks/scrollStory'
import styles from './Studio.module.css'

export default function Studio() {
  const scopeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    gsap.registerPlugin(ScrollTrigger)

    const bg = scope.querySelector<HTMLElement>('[data-bg]')

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      media.add(MM_REDUCED, () => undefined)

      // Desktop: play content reveals once as the section enters so title,
      // rows, and CTA are fully visible while the section is on screen.
      // Background keeps a light scrubbed parallax — no pin, no hijacking.
      media.add(MM_DESKTOP, () => {
        revealBatch(scope, '[data-reveal]', { stagger: 0.08, start: 'top 82%' })
        if (bg) {
          gsap.set(bg, { transformOrigin: 'right center' })
          gsap.fromTo(
            bg,
            { scale: 1.32, yPercent: 2 },
            {
              scale: 1.18,
              yPercent: -4,
              ease: 'none',
              scrollTrigger: {
                trigger: scope,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            },
          )
        }
      })

      // Mobile: no pin — plain staggered reveal + light background parallax.
      media.add(MM_MOBILE, () => {
        revealBatch(scope, '[data-reveal]', { stagger: 0.1 })
        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: scope,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          )
        }
      })
    }, scope)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section id="studio" className={styles.section} ref={scopeRef}>
      <div className={styles.bgClip} aria-hidden="true">
        <Image
          src="/assets/bg2.webp"
          alt=""
          fill
          className={styles.bg}
          sizes="100vw"
          data-bg
        />
      </div>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.title} data-title data-reveal>
            {studio.title.zh}<small>{studio.title.en}</small>
          </h2>
          <div className={styles.body}>
            {studio.body.map((p, i) => <p key={i} data-bodyp data-reveal>{p}</p>)}
          </div>

          <div className={styles.program}>
            {studio.program.map((row) => (
              <div key={row.level} className={styles.row} data-row data-reveal>
                <div className={styles.lvl}>{row.level}</div>
                <div className={styles.en}>{row.en}</div>
                <div className={styles.when}>{row.duration}</div>
              </div>
            ))}
          </div>

          <Link href={`mailto:${contact.email}`} className={styles.cta} data-cta data-reveal>
            {studio.cta.zh}
            <span className={styles.ctaEn}>{studio.cta.en}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
