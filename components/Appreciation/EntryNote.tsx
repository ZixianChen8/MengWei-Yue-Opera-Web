'use client'

import { useState } from 'react'
import type { AppreciationSection } from '@/content/specials'
import MoreNote from './MoreNote'
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

// The unfolded body of one appreciation entry. When an English note exists a
// 中文/English segmented switch shows exactly one language at a time — long
// bilingual notes never stack, which keeps phone reading columns short. Long
// notes (>2 sections) preview the first section and tuck the rest behind the
// inner "展开全文" toggle; the fold resets when the language flips (key swap).
export default function EntryNote({
  lead,
  sections,
  sectionsEn,
}: {
  lead?: string
  sections: AppreciationSection[]
  sectionsEn?: AppreciationSection[]
}) {
  const hasEn = !!sectionsEn && sectionsEn.length > 0
  const [lang, setLang] = useState<'zh' | 'en'>('zh')
  const en = hasEn && lang === 'en'

  const active = en ? (sectionsEn as AppreciationSection[]) : sections

  // Fold long notes so a phone screen never opens onto a wall of text:
  // multi-section notes preview their first section; a lone section with many
  // paragraphs previews its first two (the split changes nothing but layout).
  let preview = active
  let more: AppreciationSection[] = []
  if (active.length > 2) {
    preview = active.slice(0, 1)
    more = active.slice(1)
  } else if (active.length === 1 && active[0].body.length > 4) {
    const [only] = active
    preview = [{ heading: only.heading, body: only.body.slice(0, 2) }]
    more = [{ heading: '', body: only.body.slice(2) }]
  }

  return (
    <div className={styles.entryBody}>
      {hasEn && (
        <div className={styles.langSwitch} role="group" aria-label="导赏语言 · Language">
          <button
            type="button"
            className={`${styles.langBtn}${!en ? ` ${styles.langBtnActive}` : ''}`}
            aria-pressed={!en}
            onClick={() => setLang('zh')}
          >
            中文
          </button>
          <button
            type="button"
            className={`${styles.langBtn}${en ? ` ${styles.langBtnActive}` : ''}`}
            aria-pressed={en}
            onClick={() => setLang('en')}
          >
            English
          </button>
        </div>
      )}

      <div key={lang} className={en ? styles.notesEn : undefined}>
        {!en && lead && <p className={styles.lead}>{lead}</p>}

        {preview.map((s, si) => (
          <NoteSection key={si} s={s} />
        ))}

        {more.length > 0 && (
          <MoreNote>
            {more.map((s, si) => (
              <NoteSection key={si} s={s} />
            ))}
          </MoreNote>
        )}
      </div>
    </div>
  )
}
