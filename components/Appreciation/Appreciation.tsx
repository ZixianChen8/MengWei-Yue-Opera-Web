import { appreciationPage } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import type { CSSProperties } from 'react'
import styles from './Appreciation.module.css'

// 导赏 — Guided Appreciation. A compact crimson masthead (echoing the program
// book cover) over an ivory ink-wash sheet. Each act is an expandable card
// (native <details>): the header — number, category, title, cast — is always
// visible; the full program note (源流 · 背景 · 特色 · 行当 · 精髓 · 看点 · 唱词)
// unfolds on tap. The first act opens by default.
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
    lyricsLabel,
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
            {entries.map((e, i) => (
              <Reveal as="li" key={e.no} className={styles.entryWrap} delay={0.04 * i}>
                <details className={styles.entry} open={i === 0}>
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

                    {e.sections.map((s, si) => (
                      <section key={si} className={styles.note}>
                        <h4 className={styles.noteHeading}>{s.heading}</h4>
                        {s.body.map((p, pi) => (
                          <p key={pi} className={styles.notePara}>{p}</p>
                        ))}
                      </section>
                    ))}

                    {e.lyrics && (
                      <section className={styles.lyrics}>
                        <h4 className={styles.lyricsTitle}>
                          <span className={styles.lyricsLabel}>{lyricsLabel}</span>
                          {e.lyrics.title}
                        </h4>
                        <dl className={styles.lyricLines}>
                          {e.lyrics.lines.map((l, li) => (
                            <div key={li} className={styles.lyricLine}>
                              {l.role && <dt className={styles.lyricRole}>{l.role}</dt>}
                              <dd className={styles.lyricText}>
                                <span className={styles.lyricZh}>{l.zh}</span>
                                <span className={styles.lyricEn}>{l.en}</span>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    )}
                  </div>
                </details>
              </Reveal>
            ))}
          </ol>
        </div>
      </Reveal>
    </article>
  )
}
