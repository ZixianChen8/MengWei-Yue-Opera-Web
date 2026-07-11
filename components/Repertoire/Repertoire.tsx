'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { repertoire } from '@/content/home'
import { galleryPage } from '@/content/gallery'
import { MM_DESKTOP, MM_MOBILE, MM_REDUCED, revealBatch } from '@/components/hooks/scrollStory'
import styles from './Repertoire.module.css'

const SCROLL_STEP = 320
const EASE = 0.12

// The home filmstrip is a curated view of the shared gallery photos
// (single source of truth) — those flagged `home: true`, capped at 10.
const MAX_HOME_PHOTOS = 10
const works = galleryPage.photos.filter((p) => p.home && p.image).slice(0, MAX_HOME_PHOTOS)

export default function Repertoire() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const scrollTarget = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenIndex(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openIndex])

  useEffect(() => {
    return () => { if (rafId.current !== null) cancelAnimationFrame(rafId.current) }
  }, [])

  // GSAP scroll storytelling: reveal the head. The filmstrip stays a normal
  // native horizontal scroller (arrow buttons + RAF) on every breakpoint —
  // no pin, no vertical-scroll hijacking for horizontal travel.
  useEffect(() => {
    const scope = sectionRef.current
    if (!scope) return

    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      media.add(MM_REDUCED, () => undefined)

      media.add(MM_DESKTOP, () => {
        revealBatch(scope, '[data-reveal]', { stagger: 0.1 })
      })

      media.add(MM_MOBILE, () => {
        revealBatch(scope, '[data-reveal]', { stagger: 0.1 })
      })
    }, scope)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [])

  const animateScroll = () => {
    const strip = stripRef.current
    if (!strip) { rafId.current = null; return }
    const diff = scrollTarget.current - strip.scrollLeft
    if (Math.abs(diff) < 0.5) {
      strip.scrollLeft = scrollTarget.current
      rafId.current = null
      return
    }
    strip.scrollLeft += diff * EASE
    rafId.current = requestAnimationFrame(animateScroll)
  }

  const scrollBy = (dir: -1 | 1) => {
    const strip = stripRef.current
    if (!strip) return
    const maxScroll = strip.scrollWidth - strip.clientWidth
    const current = rafId.current === null ? strip.scrollLeft : scrollTarget.current
    scrollTarget.current = Math.max(0, Math.min(maxScroll, current + dir * SCROLL_STEP))
    if (rafId.current === null) animateScroll()
  }

  const titleBody = repertoire.title.zh.slice(0, -1)
  const titleLast = repertoire.title.zh.slice(-1)

  // Derive from openIndex only — do not keep a stale activeWork after close,
  // or the next open flashes the previous image while the new src loads.
  const openWork = openIndex !== null ? works[openIndex] : null

  return (
    <section id="repertoire" className={styles.section} ref={sectionRef}>
      <div className={styles.head} data-reveal>
        <h2 className={styles.title}>
          {titleBody}<span className={styles.titleRed}>{titleLast}</span>
        </h2>
        <p className={styles.titleEn}>{repertoire.title.en}</p>
      </div>

      <div className={styles.filmstripOuter}>
        <div ref={stripRef} className={styles.filmstripWrap} data-lenis-prevent>
          <div className={styles.filmstrip}>
            {works.map((work, i) => (
              <div
                key={`${work.image}-${i}`}
                className={styles.filmCard}
                onClick={() => setOpenIndex(i)}
              >
                <Image
                  src={work.image}
                  alt={work.title || ''}
                  width={280}
                  height={520}
                  className={styles.filmImg}
                  sizes="(max-width: 767px) 480px, 900px"
                />
                <div className={styles.filmGradient} />
                <div className={styles.filmOverlay} />
                <div className={styles.expandIcon}>
                  <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
                <div className={styles.filmCaption}>
                  {work.date && <div className={styles.year}>{work.date}</div>}
                  {work.title && <div className={styles.cnTitle}>{work.title}</div>}
                  {work.description && <div className={styles.enTitle}>{work.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <p className={styles.scrollHint}>{repertoire.hint}</p>
        <div className={styles.arrowGroup}>
          <button
            className={styles.arrowBtn}
            onClick={() => scrollBy(-1)}
            aria-label="Scroll gallery left"
          >
            <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className={styles.arrowBtn}
            onClick={() => scrollBy(1)}
            aria-label="Scroll gallery right"
          >
            <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lightbox — always rendered, toggled via .lightboxOpen */}
      <div
        className={`${styles.lightbox}${openIndex !== null ? ` ${styles.lightboxOpen}` : ''}`}
        data-lenis-prevent
        onClick={() => setOpenIndex(null)}
      >
        <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
          <div className={styles.lbImgWrap}>
            {openWork?.image && (
              <Image
                key={openWork.image}
                src={openWork.image}
                alt={openWork.title || ''}
                width={1200}
                height={1200}
                className={styles.lbImg}
                sizes="(max-width: 1023px) 90vw, 980px"
                priority
              />
            )}
          </div>
          <div className={styles.lbMeta}>
            {openWork?.date && <div className={styles.lbYear}>{openWork.date}</div>}
            {openWork?.title && <div className={styles.lbCn}>{openWork.title}</div>}
            {openWork?.description && <div className={styles.lbEn}>{openWork.description}</div>}
          </div>
          <button className={styles.lbClose} onClick={() => setOpenIndex(null)} aria-label="Close">
            <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
