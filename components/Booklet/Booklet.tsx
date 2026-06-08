import type { CSSProperties } from 'react'
import Image from 'next/image'
import { booklet } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import LetterLightbox from './LetterLightbox'
import styles from './Booklet.module.css'

// The printed gala program book, rendered as a single long page: the poster
// hero followed by ivory "interior pages" carrying the ink-wash watermark and a
// faint blurred echo of the poster behind the content.
export default function Booklet() {
  const { cover, preface, letters, team, programme, committee, crew, closing } = booklet

  // Only dignitaries whose scanned letter is available render a card; the
  // remaining slots stay in the data for later uploads (mirrors Gallery).
  const visibleLetters = letters.items.filter((l) => l.image)

  // Drive the interior blurred-poster echo from one CSS variable; when empty,
  // CSS falls back to the ivory placeholder.
  const posterVars = cover.posterImage
    ? ({ ['--bk-poster' as string]: `url("${cover.posterImage}")` } as CSSProperties)
    : undefined

  return (
    <article className={styles.booklet} style={posterVars}>
      {/* ── Hero (poster — the title art is baked into the image) ── */}
      <Reveal as="section" className={styles.hero}>
        {cover.posterImage ? (
          <Image
            src={cover.posterImage}
            alt="Yuespiration · 10 Years in the Making"
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
        ) : (
          <div className={styles.heroFallback} aria-hidden="true" />
        )}
        <div className={styles.heroScrim} aria-hidden="true" />
      </Reveal>

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
                  {act.duration && <span className={styles.actTime}>{act.duration}</span>}
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

      {/* ── Organizer & Supporting Organizations ──────────── */}
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
