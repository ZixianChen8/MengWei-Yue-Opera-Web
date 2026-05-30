'use client'

import { useEffect, useState } from 'react'
import { galleryPage, type GalleryAspect } from '@/content/gallery'
import styles from './Gallery.module.css'

// Placeholder pixel dimensions implied by each aspect-ratio class.
function dimsFor(ar: GalleryAspect): string {
  if (ar === 'r45') return '1280 × 1600'
  if (ar === 'r57') return '1200 × 1680'
  if (ar === 'r11') return '1500 × 1500'
  return '1600 × 1067'
}

// CSS aspect-ratio value used by the lightbox stage to mirror the chosen photo.
function ratioFor(ar: GalleryAspect): string {
  if (ar === 'r45') return '4 / 5'
  if (ar === 'r57') return '5 / 7'
  if (ar === 'r11') return '1 / 1'
  return '3 / 2'
}

const arClass: Record<GalleryAspect, string> = {
  r45: styles.r45,
  r32: styles.r32,
  r11: styles.r11,
  r57: styles.r57,
}

const pad2 = (n: number) => String(n).padStart(2, '0')

export default function Gallery() {
  const { header, countSuffix, filters, lightbox, photos } = galleryPage
  const total = photos.length

  const [cat, setCat] = useState<string>('all')
  // Position within the currently-visible list; null means the lightbox is closed.
  const [pos, setPos] = useState<number | null>(null)

  // Original indices of photos visible under the active filter, in order.
  const visible = photos
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => cat === 'all' || p.cat === cat)

  const open = pos !== null
  const current = open ? visible[pos] : null

  const close = () => setPos(null)

  function step(delta: number) {
    setPos((prev) => {
      if (prev === null || visible.length === 0) return prev
      return (prev + delta + visible.length) % visible.length
    })
  }

  // Changing the filter while the lightbox is open would desync the position.
  function selectCat(next: string) {
    setCat(next)
    setPos(null)
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

      {/* ── Filter rail ─────────────────────────────────── */}
      <div className={styles.filters}>
        <div className={styles.filtersInner}>
          <div className={styles.count}>
            <b>{pad2(visible.length)}</b> / {pad2(total)} {countSuffix}
          </div>
          <div className={styles.filterSet}>
            {filters.map((f) => (
              <button
                key={f.key}
                className={`${styles.chip} ${cat === f.key ? styles.chipActive : ''}`}
                onClick={() => selectCat(f.key)}
              >
                {f.zh}
                <span className={styles.chipEn}>{f.en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gallery (masonry columns) ───────────────────── */}
      <section className={styles.galleryWrap}>
        <div className={styles.gallery}>
          {visible.map(({ p, i }, vi) => (
            <figure
              key={i}
              className={styles.photo}
              onClick={() => setPos(vi)}
            >
              <span className={styles.pcNum}>N° {pad2(i + 1)}</span>
              <div className={`${styles.photoFrame} ${arClass[p.ar]}`}>
                <span className={styles.phTag}>{p.play}</span>
                <span className={styles.phGlyph}>{p.glyph}</span>
                <span className={styles.phDim}>{dimsFor(p.ar)} · jpg</span>
              </div>
              <figcaption className={styles.photoCap}>
                <div className={styles.pcCn}>{p.cn}</div>
                <div className={styles.pcEn}>{p.en}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────── */}
      <div
        className={`${styles.lightbox} ${open ? styles.lightboxOpen : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className={styles.lbBar}>
          <div className={styles.lbId}>
            Frame{' '}
            <b>
              {open ? pad2(pos + 1) : '00'} / {pad2(visible.length)}
            </b>
          </div>
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
            <div
              className={styles.lbImg}
              style={current ? { aspectRatio: ratioFor(current.p.ar) } : undefined}
            >
              <span className={styles.lbTag}>
                {current ? `${current.p.play} · ${lightbox.tagSuffix}` : ''}
              </span>
              <span className={styles.lbGlyph}>{current?.p.glyph}</span>
              <span className={styles.lbDim}>
                {current ? `${dimsFor(current.p.ar)} · jpg` : ''}
              </span>
            </div>
            <div className={styles.lbCaption}>
              <div className={styles.lbCn}>
                {current?.p.cn}
                <small>{current?.p.en}</small>
              </div>
              <div className={styles.lbMeta}>
                {current?.p.venue}
                <span className={styles.stamp}>{lightbox.stamp}</span>
              </div>
            </div>
          </div>
          <button className={styles.lbNav} onClick={() => step(1)} aria-label="Next">
            →
          </button>
        </div>
      </div>
    </>
  )
}
