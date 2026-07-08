import { appreciationPage } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import Silk from '@/components/Silk/Silk'
import EntryNote from './EntryNote'
import type { CSSProperties } from 'react'
import styles from './Appreciation.module.css'

// 导赏 — Guided Appreciation. A compact crimson masthead (echoing the program
// book cover) over an ivory ink-wash sheet. Each act is an expandable card
// (native <details>): the header — number, category, title, cast — is always
// visible; the program note unfolds on tap. All cards start collapsed so the
// page opens as a tidy index; inside, EntryNote renders the note — with a
// 中文/English switch when a translation exists, and an inner "展开全文" fold
// that keeps any single entry from running on.
export default function Appreciation() {
  const {
    pageHead,
    posterImage,
    presents,
    wordmark,
    scriptEn,
    tagline,
    venue,
    date,
    intro,
    entries,
  } = appreciationPage

  // One CSS variable drives both the masthead field and the faint interior
  // poster echo; when empty, CSS falls back to the crimson/ivory placeholders.
  const posterVars = posterImage
    ? ({ ['--bk-poster' as string]: `url("${posterImage}")` } as CSSProperties)
    : undefined

  return (
    <article className={styles.appreciation} style={posterVars}>
      {/* ── Masthead ──────────────────────────────────────── */}
      <section className={`${styles.cover}${posterImage ? ` ${styles.coverPoster}` : ''}`}>
        <div className={styles.silkBg} aria-hidden="true">
          <Silk speed={5} scale={1.1} color="#711816" noiseIntensity={0.8} rotation={2.2} />
        </div>
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

      {/* ── Appreciation sheet ────────────────────────────── */}
      <Reveal as="section" className={styles.sheet}>
        <div className={styles.sheetInner}>
          <h2 className={styles.sectionTitle}>{pageHead.titleEn}</h2>
          {intro && <p className={styles.intro}>{intro}</p>}

          <ol className={styles.entries}>
            {entries.map((e, i) => (
              <Reveal as="li" key={e.no} className={styles.entryWrap} delay={0.04 * i}>
                <details className={styles.entry}>
                  <summary className={styles.entryHead}>
                    <span className={styles.entryNo} aria-hidden="true">{e.no}</span>
                    <div className={styles.entryId}>
                      {e.category && <p className={styles.entryCat}>{e.category}</p>}
                      <h3 className={styles.entryTitle}>{e.titleZh}</h3>
                      {e.titleEn && <p className={styles.entryTitleEn}>{e.titleEn}</p>}
                      {e.keywords && <p className={styles.entryKeywords}>{e.keywords}</p>}
                      {e.performers && <p className={styles.entryCast}>{e.performers}</p>}
                    </div>
                    <span className={styles.entryChevron} aria-hidden="true" />
                  </summary>

                  <EntryNote lead={e.lead} sections={e.sections} sectionsEn={e.sectionsEn} />
                </details>
              </Reveal>
            ))}
          </ol>
        </div>
      </Reveal>
    </article>
  )
}
