'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { parseEventDate } from '@/lib/event-date'
import styles from './EventsListing.module.css'

type MonthLabel = { cn: string; en: string }

type Props = {
  years: string[]
  months: MonthLabel[]
  // Only the ISO `date` of each event is needed to drive the ribbon.
  events: { date: string }[]
}

// "Today" as a client-only value. The year/month highlight tracks the live
// date so it stays correct even months after the last deploy. We read it via
// useSyncExternalStore — server snapshot is null (deterministic markup, no
// hydration mismatch), client snapshot is a stable cached object so the
// highlight + pips appear once the client takes over.
type Today = { year: number; monthIdx: number }
let cachedToday: Today | null = null
const emptySubscribe = () => () => {}
const getClientToday = (): Today => {
  if (!cachedToday) {
    const d = new Date()
    cachedToday = { year: d.getFullYear(), monthIdx: d.getMonth() }
  }
  return cachedToday
}
const getServerToday = (): Today | null => null

export default function MonthRibbon({ years, months, events }: Props) {
  const today = useSyncExternalStore(emptySubscribe, getClientToday, getServerToday)

  const currentYear = today ? String(today.year) : null
  const currentMonthIdx = today ? today.monthIdx : null

  // Events per calendar month (index 0-11) for the highlighted year.
  const countsByMonth = useMemo(() => {
    const counts = new Array(12).fill(0)
    if (!today) return counts
    for (const ev of events) {
      const parsed = parseEventDate(ev.date)
      if (parsed && parsed.year === today.year) counts[parsed.month - 1] += 1
    }
    return counts
  }, [today, events])

  return (
    <div className={styles.ribbon}>
      <div className={styles.yearBlock}>
        <div className={styles.yearToggle}>
          {years.map((y) => (
            <span key={y} className={y === currentYear ? styles.yearBtnOn : styles.yearBtn}>
              {y}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.months}>
        {months.map((m, i) => {
          const count = countsByMonth[i]
          const cls = [
            styles.month,
            count > 0 ? styles.monthHas : '',
            i === currentMonthIdx ? styles.monthNow : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <div key={m.en} className={cls}>
              {count >= 2 ? (
                <span className={styles.pip} />
              ) : count === 1 ? (
                <span className={styles.pipMuted} />
              ) : null}
              <div className={styles.mCn}>{m.cn}</div>
              <div className={styles.mEn}>{m.en}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
