'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { studio } from '@/content/home'
import {
  MM_DESKTOP,
  MM_MOBILE,
  MM_REDUCED,
  STORY_EASE,
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

      // Desktop: pin the section and scrub a chapter timeline — background
      // parallax, then title, body, the three program rows one-by-one, then CTA.
      media.add(MM_DESKTOP, () => {
        const title = scope.querySelector('[data-title]')
        const bodyPs = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll('[data-bodyp]'))
        const rows = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll('[data-row]'))
        const cta = scope.querySelector('[data-cta]')

        gsap.set(title, { autoAlpha: 0, y: 44, willChange: 'transform, opacity' })
        gsap.set(bodyPs, { autoAlpha: 0, y: 30, willChange: 'transform, opacity' })
        gsap.set(rows, { autoAlpha: 0, y: 28, willChange: 'transform, opacity' })
        gsap.set(cta, { autoAlpha: 0, y: 20, willChange: 'transform, opacity' })
        if (bg) gsap.set(bg, { transformOrigin: 'right center' })

        const tl = gsap.timeline({
          defaults: { ease: STORY_EASE },
          scrollTrigger: {
            trigger: scope,
            start: 'top top',
            end: '+=120%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        if (bg) {
          tl.fromTo(
            bg,
            { scale: 1.34, yPercent: 0 },
            { scale: 1.18, yPercent: -6, ease: 'none', duration: 1 },
            0,
          )
        }
        tl.to(title, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05)
        tl.to(bodyPs, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.4 }, 0.22)
        tl.to(rows, { autoAlpha: 1, y: 0, stagger: 0.16, duration: 0.5 }, 0.46)
        tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.86)
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

          <Link href={studio.cta.href} className={styles.cta} data-cta data-reveal>
            {studio.cta.zh}
            <span className={styles.ctaEn}>{studio.cta.en}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
