'use client'

import { useRef, type ReactNode } from 'react'
import styles from './Appreciation.module.css'

// The inner "展开全文 / 收起" toggle. Because the unfolded text is ordered
// *above* the summary (so the collapse control sits at the bottom where the
// reader finishes), collapsing removes height above the button and the page
// jumps upward. This client wrapper captures the summary's viewport position
// at click time and, after the collapse reflow, scrolls by the delta so the
// toggle stays exactly where the user clicked it.
export default function MoreNote({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const summaryTop = useRef<number | null>(null)

  // Runs before the native toggle (click default action), so it records the
  // pre-toggle position.
  const handleSummaryClick = () => {
    const summary = ref.current?.querySelector('summary')
    summaryTop.current = summary ? summary.getBoundingClientRect().top : null
  }

  // Only compensate when collapsing — expanding reveals text below the click
  // point, which reads naturally without any scroll adjustment.
  const handleToggle = () => {
    const el = ref.current
    if (!el || el.open || summaryTop.current == null) {
      summaryTop.current = null
      return
    }
    const summary = el.querySelector('summary')
    if (summary) {
      const delta = summary.getBoundingClientRect().top - summaryTop.current
      if (delta) window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior })
    }
    summaryTop.current = null
  }

  return (
    <details ref={ref} className={styles.more} onToggle={handleToggle}>
      <summary className={styles.moreSummary} onClick={handleSummaryClick}>
        <span className={`${styles.moreLabel} ${styles.moreLabelClosed}`}>
          展开全文 · Continue reading
        </span>
        <span className={`${styles.moreLabel} ${styles.moreLabelOpen}`}>
          收起 · Collapse
        </span>
        <span className={styles.moreChevron} aria-hidden="true" />
      </summary>
      <div className={styles.moreInner}>{children}</div>
    </details>
  )
}
