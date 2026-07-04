'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about } from '@/content/home'
import { MM_DESKTOP, MM_MOBILE, MM_REDUCED, revealBatch } from '@/components/hooks/scrollStory'
import styles from './About.module.css'

export default function About() {
  const scopeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    gsap.registerPlugin(ScrollTrigger)

    const bg = scope.querySelector<HTMLElement>('[data-bg]')
    const red = scope.querySelector<HTMLElement>('[data-red]')

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      media.add(MM_REDUCED, () => undefined)

      const addReveals = () => revealBatch(scope, '[data-reveal]', { stagger: 0.12 })

      const sceneST = {
        trigger: scope,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      }

      // Background parallax runs on both desktop + mobile (light, transform-only).
      // Scale stays > 1 so the `fill` image always overflows its box and the
      // vertical drift never exposes a masked edge (.about is overflow:hidden).
      const addBgParallax = () => {
        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -6, scale: 1.14 },
            { yPercent: 6, scale: 1.06, ease: 'none', scrollTrigger: sceneST },
          )
        }
      }

      media.add(MM_DESKTOP, () => {
        addReveals()
        addBgParallax()
        if (red) {
          gsap.set(red, { display: 'inline-block', transformOrigin: '50% 50%' })
          gsap.fromTo(
            red,
            { scale: 0.96 },
            { scale: 1.07, ease: 'none', scrollTrigger: sceneST },
          )
        }
      })

      media.add(MM_MOBILE, () => {
        addReveals()
        addBgParallax()
      })
    }, scope)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section id="about" className={styles.about} ref={scopeRef}>
      <Image
        src="/assets/bg3.webp"
        alt=""
        fill
        className={styles.bg}
        sizes="100vw"
        aria-hidden="true"
        data-bg
      />
<div className={styles.frame}>

        <div className={styles.colL} data-reveal>
          <p className={styles.lede}>
            {about.verse.map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <p className={styles.ledeEn}>{about.verseEn}</p>
        </div>

        <div className={styles.center} data-reveal>
          <div className={styles.vertMeta}>{about.vertMeta}</div>
          <div className={styles.vertTitle}>
            {about.vertTitle.before}
            <span className={styles.red} data-red>{about.vertTitle.red}</span>
            {about.vertTitle.after}
          </div>
        </div>

        <div className={styles.colR} data-reveal>
          <p className={styles.lede}>
            {about.mission.map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <a className={styles.ctaLine} href={about.cta.href}>
            <span>{about.cta.zh}</span>
            <span className={styles.ctaEn}>{about.cta.en}</span>
            <span className={styles.ctaArrow}>→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
