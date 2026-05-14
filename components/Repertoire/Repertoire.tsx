'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { repertoire } from '@/content/home'
import Eyebrow from '@/components/Eyebrow/Eyebrow'
import styles from './Repertoire.module.css'

export default function Repertoire() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const didDrag = useRef(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenIndex(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openIndex])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stripRef.current) return
    isDragging.current = true
    didDrag.current = false
    dragStart.current = {
      x: e.pageX - stripRef.current.offsetLeft,
      scrollLeft: stripRef.current.scrollLeft,
    }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !stripRef.current) return
    e.preventDefault()
    const x = e.pageX - stripRef.current.offsetLeft
    const dx = x - dragStart.current.x
    if (Math.abs(dx) > 5) didDrag.current = true
    stripRef.current.scrollLeft = dragStart.current.scrollLeft - dx
  }

  const stopDrag = () => { isDragging.current = false }

  const titleBody = repertoire.title.zh.slice(0, -1)
  const titleLast = repertoire.title.zh.slice(-1)

  // Safe fallback: while openIndex is null the lightbox is hidden,
  // but we still need a valid work object to avoid conditional Image renders.
  const openWork = repertoire.works[openIndex ?? 0]

  return (
    <section id="repertoire" className={styles.section}>
      <div className={styles.head}>
        <Eyebrow label={repertoire.eyebrow} />
        <h2 className={styles.title}>
          {titleBody}<span className={styles.titleRed}>{titleLast}</span>
        </h2>
        <p className={styles.titleEn}>{repertoire.title.en}</p>
      </div>

      <div className={styles.filmstripOuter}>
        <div
          ref={stripRef}
          className={styles.filmstripWrap}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <div className={styles.filmstrip}>
            {repertoire.works.map((work, i) => (
              <div
                key={`${work.year}-${work.zh.join('')}`}
                className={styles.filmCard}
                onClick={() => { if (!didDrag.current) setOpenIndex(i) }}
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

      <p className={styles.scrollHint}>{repertoire.hint}</p>

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
