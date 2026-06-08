'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { BookletLetter } from '@/content/booklet'
import styles from './Booklet.module.css'

// Scanned greeting letters as white drop-shadow cards; click to open a
// zoomable lightbox (letters are dense, so legibility matters on mobile).
// Reuses the keyboard-nav + body-scroll-lock pattern from Gallery.
export default function LetterLightbox({ letters }: { letters: BookletLetter[] }) {
  const [pos, setPos] = useState<number | null>(null)
  const open = pos !== null
  const current = open ? letters[pos] : null
  const total = letters.length

  const close = () => setPos(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPos(null)
      else if (e.key === 'ArrowLeft') setPos((p) => (p === null ? p : (p - 1 + total) % total))
      else if (e.key === 'ArrowRight') setPos((p) => (p === null ? p : (p + 1) % total))
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, total])

  if (total === 0) return null

  return (
    <>
      <div className={styles.letterGrid}>
        {letters.map((l, i) => (
          <figure key={l.name} className={styles.letterCard} onClick={() => setPos(i)}>
            <div className={styles.letterPaper}>
              <Image
                src={l.image}
                alt={`Greeting letter from ${l.name}`}
                width={1347}
                height={1743}
                sizes="(max-width: 720px) 90vw, 420px"
                className={styles.letterImg}
              />
            </div>
            <figcaption className={styles.letterCap}>
              <span className={styles.letterName}>{l.name}</span>
              {l.role && <span className={styles.letterRole}>{l.role}</span>}
            </figcaption>
          </figure>
        ))}
      </div>

      <div
        className={`${styles.lightbox}${open ? ` ${styles.lightboxOpen}` : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Greeting letter"
      >
        <div className={styles.lbBar}>
          <span className={styles.lbId}>
            {current?.name}
            {total > 1 && open && (
              <b>
                {' '}
                {pos + 1} / {total}
              </b>
            )}
          </span>
          <button className={styles.lbClose} onClick={close} aria-label="Close" type="button">
            ×
          </button>
        </div>
        <div
          className={styles.lbStage}
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          {total > 1 && (
            <button
              className={styles.lbNav}
              onClick={() => setPos((p) => (p === null ? p : (p - 1 + total) % total))}
              aria-label="Previous"
              type="button"
            >
              ←
            </button>
          )}
          {current && (
            <div className={styles.lbPaper}>
              <Image
                src={current.image}
                alt={`Greeting letter from ${current.name}`}
                width={1347}
                height={1743}
                sizes="(max-width: 900px) 92vw, 760px"
                className={styles.lbImg}
              />
            </div>
          )}
          {total > 1 && (
            <button
              className={styles.lbNav}
              onClick={() => setPos((p) => (p === null ? p : (p + 1) % total))}
              aria-label="Next"
              type="button"
            >
              →
            </button>
          )}
        </div>
      </div>
    </>
  )
}
