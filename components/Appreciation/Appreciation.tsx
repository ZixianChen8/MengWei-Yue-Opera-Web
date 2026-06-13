import { appreciationPage, type AppreciationSection } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import type { CSSProperties } from 'react'
import styles from './Appreciation.module.css'

// One program note (源流 · 背景 · 特色 · 行当 · 精髓 · 看点 …). The heading is
// optional — some source notes are plain narrative paragraphs with no sub-title.
function NoteSection({ s }: { s: AppreciationSection }) {
  return (
    <section className={styles.note}>
      {s.heading && <h4 className={styles.noteHeading}>{s.heading}</h4>}
      {s.body.map((p, pi) => (
        <p key={pi} className={styles.notePara}>{p}</p>
      ))}
    </section>
  )
}

// 导赏 — Guided Appreciation. A compact crimson masthead (echoing the program
// book cover) over an ivory ink-wash sheet. Each act is an expandable card
// (native <details>): the header — number, category, title, cast — is always
// visible; the program note unfolds on tap. All cards start collapsed so the
// page opens as a tidy index; inside a long note the first section previews and
// the rest tucks behind an inner "展开全文" toggle (a second native <details>),
// keeping any single entry from running on.
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
            {entries.map((e, i) => {
              // Long notes (>2 sections) preview the first section inline and
              // fold the remainder behind the "展开全文" toggle.
              const hasMore = e.sections.length > 2
              const preview = hasMore ? e.sections.slice(0, 1) : e.sections
              const more = hasMore ? e.sections.slice(1) : []

              return (
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

                    <div className={styles.entryBody}>
                      {e.lead && <p className={styles.lead}>{e.lead}</p>}

                      {preview.map((s, si) => (
                        <NoteSection key={si} s={s} />
                      ))}

                      {more.length > 0 && (
                        <details className={styles.more}>
                          <summary className={styles.moreSummary}>
                            <span className={styles.moreLabel}>展开全文 · Continue reading</span>
                            <span className={styles.moreChevron} aria-hidden="true" />
                          </summary>
                          <div className={styles.moreInner}>
                            {more.map((s, si) => (
                              <NoteSection key={si} s={s} />
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </details>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </Reveal>
    </article>
  )
}
