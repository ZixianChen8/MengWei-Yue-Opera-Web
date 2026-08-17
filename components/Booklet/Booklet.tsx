import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { Booklet as BookletData } from '@/content/specials'
import Reveal from '@/components/Reveal/Reveal'
import Silk from '@/components/Silk/Silk'
import LetterLightbox from './LetterLightbox'
import styles from './Booklet.module.css'

// The printed gala program book, rendered as a single long page: the poster
// hero followed by ivory "interior pages" carrying the ink-wash watermark and a
// faint blurred echo of the poster behind the content.
export default function Booklet({ booklet }: { booklet: BookletData }) {
  const { cover, preface, letters, team, programme, committee, crew, closing } = booklet

  // Only dignitaries whose scanned letter is available render a card; the
  // remaining slots stay in the data for later uploads (mirrors Gallery).
  const visibleLetters = letters.items.filter((l) => l.image)

  // Drive the cover background and the interior blurred-poster layer from one
  // CSS variable; when empty, CSS falls back to the crimson/ivory placeholders.
  const posterVars = cover.posterImage
    ? ({ ['--bk-poster' as string]: `url("${cover.posterImage}")` } as CSSProperties)
    : undefined

  return (
    <article className={styles.booklet} style={posterVars}>
      {/* ── Cover ─────────────────────────────────────────── */}
      <section
        className={`${styles.cover}${cover.posterImage ? ` ${styles.coverPoster}` : ''}`}
      >
        <div className={styles.silkBg} aria-hidden="true">
          <Silk speed={5} scale={1.1} color="#711816" noiseIntensity={0.8} rotation={2.2} />
        </div>
        <div className={styles.coverInner}>
          <p className={styles.presents}>{cover.presents}</p>
          <h1 className={styles.wordmark}>{cover.wordmark}</h1>
          <p className={styles.script}>{cover.scriptEn}</p>
          <span className={styles.coverRule} aria-hidden="true" />
          <p className={styles.coverTagline}>{cover.tagline}</p>
          <div className={styles.coverFoot}>
            <p className={styles.coverMeta}>
              {cover.venue}
              <span className={styles.dot} aria-hidden="true">·</span>
              {cover.date}
            </p>
          </div>
        </div>
      </section>

      {/* ── Preface ───────────────────────────────────────── */}
      <Reveal as="section" className={styles.page}>
        <div className={styles.pageInner}>
          <h2 className={styles.sectionTitle}>{preface.titleEn}</h2>
          <div className={styles.prose}>
            {preface.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? styles.lede : undefined}>{p}</p>
            ))}
          </div>
          <p className={styles.signoff}>
            <span className={styles.signoffOrg}>{preface.signoff.org}</span>
            <span className={styles.signoffDate}>{preface.signoff.date}</span>
          </p>
        </div>
      </Reveal>

      {/* ── Greetings (scanned dignitary letters) ─────────── */}
      <Reveal as="section" className={styles.page}>
        <div className={styles.pageInner}>
          <h2 className={styles.sectionTitle}>{letters.titleEn}</h2>
          {letters.intro && <p className={styles.sectionIntro}>{letters.intro}</p>}
          <LetterLightbox letters={visibleLetters} />
        </div>
      </Reveal>

      {/* ── Producer & Director ───────────────────────────── */}
      <Reveal as="section" className={styles.page}>
        <div className={styles.pageInner}>
          <h2 className={styles.sectionTitle}>{team.titleEn}</h2>
          <div className={styles.bios}>
            {team.members.map((m) => (
              <div key={m.name} className={styles.bio}>
                <div className={styles.bioHead}>
                  <div className={styles.bioPortrait}>
                    {m.image ? (
                      <Image src={m.image} alt={m.name} width={320} height={400} className={styles.bioImg} />
                    ) : (
                      <span className={styles.bioGlyph} aria-hidden="true">越</span>
                    )}
                  </div>
                  <div className={styles.bioId}>
                    <h3 className={styles.bioName}>{m.name}</h3>
                    <p className={styles.bioRole}>{m.role}</p>
                  </div>
                </div>
                <div className={styles.bioBody}>
                  {m.bio.map((p, i) => (
                    <p key={i} className={styles.bioPara}>{p}</p>
                  ))}
                  {m.credits.length > 0 && (
                    <ul className={styles.credits}>
                      {m.credits.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Programme (run of show) ───────────────────────── */}
      <Reveal as="section" className={styles.page}>
        <div className={styles.pageInner}>
          <h2 className={styles.sectionTitle}>{programme.titleEn}</h2>
          <p className={styles.emcee}>
            <span className={styles.emceeLabel}>{programme.emceeLabel}</span>
            {programme.emcee}
          </p>
          <ol className={styles.acts}>
            {programme.acts.map((act, i) => (
              <li key={i} className={styles.act}>
                <div className={styles.actHead}>
                  <h3 className={styles.actTitle}>{act.titleEn}</h3>
                </div>
                {act.titleZh && <p className={styles.actTitleZh}>{act.titleZh}</p>}
                {act.performers && <p className={styles.actCast}>{act.performers}</p>}
                {act.note && <p className={styles.actNote}>{act.note}</p>}
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* ── Organizing Committee ──────────────────────────── */}
      <Reveal as="section" className={styles.page}>
        <div className={styles.pageInner}>
          <h2 className={styles.sectionTitle}>{committee.titleEn}</h2>
          <RoleList groups={committee.groups} />
        </div>
      </Reveal>

      {/* ── Production Crew ───────────────────────────────── */}
      <Reveal as="section" className={styles.page}>
        <div className={styles.pageInner}>
          <h2 className={styles.sectionTitle}>{crew.titleEn}</h2>
          <RoleList groups={crew.groups} />
        </div>
      </Reveal>

      {/* ── Organizer & partners ───────────────────────────── */}
      <Reveal as="section" className={styles.page}>
        <div className={styles.pageInner}>
          <h2 className={styles.sectionTitle}>{closing.organizerTitleEn}</h2>
          <p className={styles.organizer}>{closing.organizer}</p>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleSecond}`}>
            {closing.supportingTitleEn}
          </h2>
          <ul className={styles.supportList}>
            {closing.supporting.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </article>
  )
}

// Centered role → names list, shared by Committee and Crew.
function RoleList({ groups }: { groups: { role: string; names: string }[] }) {
  return (
    <dl className={styles.roleList}>
      {groups.map((g) => (
        <div key={g.role} className={styles.roleGroup}>
          <dt className={styles.roleName}>{g.role}</dt>
          <dd className={styles.roleNames}>{g.names}</dd>
        </div>
      ))}
    </dl>
  )
}
