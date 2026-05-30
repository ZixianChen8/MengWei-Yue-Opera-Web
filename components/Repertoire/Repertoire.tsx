'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { repertoire } from '@/content/home'
import styles from './Repertoire.module.css'

const SCROLL_STEP = 320
const EASE = 0.12

export default function Repertoire() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeWork, setActiveWork] = useState(repertoire.works[0])
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

  const openWork = activeWork

  const openLightbox = (index: number) => {
    setActiveWork(repertoire.works[index])
    setOpenIndex(index)
  }

  return (
    <section id="repertoire" className={styles.section}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          {titleBody}<span className={styles.titleRed}>{titleLast}</span>
        </h2>
        <p className={styles.titleEn}>{repertoire.title.en}</p>
      </div>

      <div className={styles.filmstripOuter}>
        <div ref={stripRef} className={styles.filmstripWrap}>
          <div className={styles.filmstrip}>
            {repertoire.works.map((work, i) => (
              <div
                key={`${work.year}-${work.zh.join('')}`}
                className={styles.filmCard}
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={work.image}
                  alt={`${work.zh.join('')} – ${work.en}`}
                  width={280}
                  height={520}
                  className={styles.filmImg}
                  sizes="370px"
                />
                <div className={styles.filmGradient} />
                <div className={styles.filmOverlay} />
                <div className={styles.expandIcon}>
                  <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
                <div className={styles.filmCaption}>
                  <div className={styles.year}>{work.year}</div>
                  <div className={styles.cnTitle}>{work.zh.join('')}</div>
                  <div className={styles.enTitle}>{work.en}</div>
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
        onClick={() => setOpenIndex(null)}
      >
        <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
          <div className={styles.lbImgWrap}>
            <Image
              src={openWork.image}
              alt={`${openWork.zh.join('')} – ${openWork.en}`}
              width={460}
              height={560}
              className={styles.lbImg}
              sizes="460px"
            />
          </div>
          <div className={styles.lbMeta}>
            <div className={styles.lbYear}>{openWork.year}</div>
            <div className={styles.lbCn}>{openWork.zh.join('')}</div>
            <div className={styles.lbEn}>{openWork.en}</div>
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
