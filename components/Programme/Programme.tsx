import type { CSSProperties } from 'react'
import { programmePage } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import styles from './Programme.module.css'

// 中文节目单 — the Chinese-language run-of-show for the 10th-anniversary gala.
// A compact crimson masthead (echoing the program book cover) followed by an
// ivory ink-wash "sheet" that lists the acts in order, Chinese title first.
export default function Programme() {
  const {
    pageHead,
    posterImage,
    presents,
    wordmark,
    scriptEn,
    tagline,
    venue,
    date,
    emceeLabel,
    emcee,
    acts,
  } = programmePage

  // One CSS variable drives both the masthead field and the faint interior
  // poster echo; when empty, CSS falls back to the crimson/ivory placeholders.
  const posterVars = posterImage
    ? ({ ['--bk-poster' as string]: `url("${posterImage}")` } as CSSProperties)
    : undefined

  return (
    <article className={styles.programme} style={posterVars}>
      {/* ── Masthead ──────────────────────────────────────── */}
      <section className={`${styles.cover}${posterImage ? ` ${styles.coverPoster}` : ''}`}>
        <div className={styles.coverInner}>
          <p className={styles.presents}>{presents}</p>
          <h1 className={styles.wordmark}>{wordmark}</h1>
          <p className={styles.script}>{scriptEn}</p>
          <span className={styles.coverRule} aria-hidden="true" />
          <p className={styles.coverTagline}>{tagline}</p>
          <div className={styles.coverFoot}>
            <p className={styles.coverMeta}>
              {venue}
              <span className={styles.dot} aria-hidden="true">·</span>
              {date}
            </p>
          </div>
        </div>
      </section>

      {/* ── Programme sheet ───────────────────────────────── */}
      <Reveal as="section" className={styles.sheet}>
        <div className={styles.sheetInner}>
          <h2 className={styles.sectionTitle}>{pageHead.titleEn}</h2>
          {emcee && (
            <p className={styles.emcee}>
              <span className={styles.emceeLabel}>{emceeLabel}</span>
              {emcee}
            </p>
          )}
          <ol className={styles.acts}>
            {acts.map((act, i) => (
              <Reveal as="li" key={act.no} className={styles.act} delay={0.04 * i}>
                <span className={styles.actNo} aria-hidden="true">{act.no}</span>
                <div className={styles.actMain}>
                  {act.category && <p className={styles.actCat}>{act.category}</p>}
                  <h3 className={styles.actTitle}>{act.titleZh}</h3>
                  {act.titleEn && <p className={styles.actTitleEn}>{act.titleEn}</p>}
                  {act.performers && <p className={styles.actCast}>{act.performers}</p>}
                  {act.note && <p className={styles.actNote}>{act.note}</p>}
                </div>
                {act.duration && <span className={styles.actTime}>{act.duration}</span>}
              </Reveal>
            ))}
          </ol>
        </div>
      </Reveal>
    </article>
  )
}
