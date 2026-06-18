'use client'

import { useEffect, useState } from 'react'
import { galleryPage } from '@/content/gallery'
import styles from './Gallery.module.css'

export default function Gallery() {
  const { header, photos } = galleryPage

  // Real images only, rendered in admin-defined array order.
  const visible = photos.filter((p) => p.image)
  // Position within the list; null means the lightbox is closed.
  const [pos, setPos] = useState<number | null>(null)

  const open = pos !== null
  const current = open ? visible[pos] : null

  const close = () => setPos(null)

  function step(delta: number) {
    setPos((prev) => {
      if (prev === null || visible.length === 0) return prev
      return (prev + delta + visible.length) % visible.length
    })
  }

  // Keyboard navigation + body scroll lock while the lightbox is open.
  const visibleLen = visible.length
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPos(null)
      } else if (e.key === 'ArrowLeft') {
        setPos((prev) => (prev === null ? prev : (prev - 1 + visibleLen) % visibleLen))
      } else if (e.key === 'ArrowRight') {
        setPos((prev) => (prev === null ? prev : (prev + 1) % visibleLen))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, visibleLen])

  return (
    <>
      {/* ── Page header ─────────────────────────────────── */}
      <header className={styles.pageHead}>
        <div className={styles.phInner}>
          <div className={styles.phTitle}>
            <div className={styles.phMeta}>{header.meta}</div>
            <div className={styles.phChars}>
              {header.charsTop}
              <br />
              <span className={styles.red}>{header.charsRed}</span>
            </div>
          </div>
          <div className={styles.phAside}>
            <div className={styles.crumbs}>
              {header.crumbsTop.plain}
              <b>{header.crumbsTop.bold}</b>
            </div>
            <div className={styles.enTitle}>{header.enTitle}</div>
            <div className={styles.crumbs}>{header.crumbsBottom}</div>
          </div>
        </div>
      </header>

      {/* ── Gallery (masonry columns, natural ratios) ───── */}
      <section className={styles.galleryWrap}>
        <div className={styles.gallery}>
          {visible.map((p, i) => (
            <figure
              key={`${p.image}-${i}`}
              className={styles.photo}
              onClick={() => setPos(i)}
            >
              <div className={styles.photoFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title || ''} loading="lazy" className={styles.photoImg} />
              </div>
              {(p.title || p.date) && (
                <figcaption className={styles.photoCap}>
                  {p.title && <div className={styles.pcCn}>{p.title}</div>}
                  {p.date && <div className={styles.pcEn}>{p.date}</div>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>

      {/* ── Lightbox (click a photo to see detail) ──────── */}
      <div
        className={`${styles.lightbox} ${open ? styles.lightboxOpen : ''}`}
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className={styles.lbBar}>
          <button className={styles.lbClose} onClick={close} aria-label="Close">
            ×
          </button>
        </div>
        <div
          className={styles.lbStage}
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <button className={styles.lbNav} onClick={() => step(-1)} aria-label="Previous">
            ←
          </button>
          <div className={styles.lbFigure}>
            <div className={styles.lbImg}>
              {current && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.image} alt={current.title || ''} className={styles.lbImgEl} />
              )}
            </div>
            {current && (current.title || current.description || current.date) && (
              <div className={styles.lbCaption}>
                {(current.title || current.description) && (
                  <div className={styles.lbCn}>
                    {current.title}
                    {current.description && <small>{current.description}</small>}
                  </div>
                )}
                <div className={styles.lbMeta}>
                  {current.date}
                </div>
              </div>
            )}
          </div>
          <button className={styles.lbNav} onClick={() => step(1)} aria-label="Next">
            →
          </button>
        </div>
      </div>
    </>
  )
}
