'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { galleryPage } from '@/content/gallery'
import {
  buildGalleryAlbums,
  photosForEvent,
  visiblePhotos,
} from '@/lib/gallery-albums'
import styles from './Gallery.module.css'

const MOSAIC_SLOTS = 4

export function GalleryFallback() {
  return <PageHeader />
}

function PageHeader({ titleZh, titleEn }: { titleZh?: string; titleEn?: string }) {
  const { header } = galleryPage
  const zh = titleZh || header.titleZh
  const en = titleEn ?? header.titleEn
  const interior = Boolean(titleZh)
  return (
    <header className={`${styles.pageHead}${interior ? ` ${styles.pageHeadInterior}` : ''}`}>
      <div className={styles.phInner}>
        <div className={styles.phTop}>
          <h1 className={styles.phTitle}>
            {zh}
            {en ? <small>{en}</small> : null}
          </h1>
          <div className={styles.phAside}>
            <p className={styles.phQuote}>{header.quote.zh}</p>
            <span className={styles.phQuoteEn}>{header.quote.en}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Gallery() {
  const searchParams = useSearchParams()
  const raw = searchParams.get('event')
  const eventKey = raw && raw.trim() ? raw.trim() : null

  const photos = useMemo(() => visiblePhotos(), [])
  const albums = useMemo(() => buildGalleryAlbums(photos), [photos])
  const album = eventKey ? albums.find((item) => item.key === eventKey) : undefined
  const visible = useMemo(
    () => (eventKey ? photosForEvent(eventKey, photos) : []),
    [eventKey, photos],
  )

  const [pos, setPos] = useState<number | null>(null)

  useEffect(() => {
    setPos(null)
  }, [eventKey])

  const open = pos !== null
  const current = open ? visible[pos] : null

  const close = () => setPos(null)

  function step(delta: number) {
    setPos((prev) => {
      if (prev === null || visible.length === 0) return prev
      return (prev + delta + visible.length) % visible.length
    })
  }

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

  const { albums: albumCopy } = galleryPage
  const interiorTitle = album?.titleZh ?? eventKey ?? ''
  const interiorEn = album?.titleEn

  return (
    <>
      <PageHeader
        titleZh={eventKey ? interiorTitle : undefined}
        titleEn={eventKey ? interiorEn || '' : undefined}
      />

      {eventKey ? (
        <section className={styles.galleryWrap}>
          <Link href="/gallery" className={styles.backLink}>
            ← {albumCopy.back.zh} · {albumCopy.back.en}
          </Link>
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
      ) : (
        <section className={styles.galleryWrap}>
          <div className={styles.albumIndex}>
            {albums.map((item) => {
              const mosaic = item.mosaic
              return (
                <Link
                  key={item.key}
                  href={`/gallery?event=${encodeURIComponent(item.key)}`}
                  className={styles.album}
                  aria-label={`${item.titleZh}${item.titleEn ? ` · ${item.titleEn}` : ''} · ${item.count} ${albumCopy.frames}`}
                >
                  <div className={styles.plate}>
                    {mosaic ? (
                      <div className={styles.mosaic}>
                        {Array.from({ length: MOSAIC_SLOTS }, (_, i) => (
                          <div key={i} className={styles.mosaicCell}>
                            {mosaic[i] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={mosaic[i]} alt="" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : item.coverSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.coverSrc} alt="" className={styles.plateImg} />
                    ) : null}
                    <div className={styles.plateShade} />
                    <span className={styles.overlayCount}>
                      {item.count} {albumCopy.frames}
                    </span>
                    <span className={styles.albumTitleVert}>{item.titleZh}</span>
                  </div>
                  <div className={styles.albumMeta}>
                    <div className={styles.albumTitleMobile}>{item.titleZh}</div>
                    {item.titleEn ? <div className={styles.albumEn}>{item.titleEn}</div> : null}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

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
                <img
                  key={current.image}
                  src={current.image}
                  alt={current.title || ''}
                  className={styles.lbImgEl}
                />
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
                <div className={styles.lbMeta}>{current.date}</div>
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
