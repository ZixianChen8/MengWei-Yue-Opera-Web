import Link from 'next/link'
import { season, type SeasonEvent } from '@/content/home'
import Reveal from '@/components/Reveal/Reveal'
import EventCard from './EventCard'
import styles from './Season.module.css'

const MAX_HOME_EVENTS = 3

// Pick the events shown in the home Season section: those flagged `home`
// come first (in list order), then the earliest unflagged events fill the
// remaining slots up to MAX_HOME_EVENTS. Fewer than the cap simply shows all.
function selectHomeEvents(events: SeasonEvent[], max = MAX_HOME_EVENTS): SeasonEvent[] {
  const checked = events.filter((e) => e.home).slice(0, max)
  if (checked.length >= max) return checked
  const fill = events.filter((e) => !e.home)
  return [...checked, ...fill].slice(0, max)
}

export default function Season() {
  return (
    <section id="season" className={styles.section}>
      <Reveal className={styles.head}>
        <div>
          <h2 className={styles.title}>
            {season.title.zh}<small>{season.title.en}</small>
          </h2>
        </div>
        <Link href="/events" className={styles.viewAll}>
          查看全部活动
          <span className={styles.viewAllEn}>· View all events</span>
          <span className={styles.viewAllArrow}>→</span>
        </Link>
      </Reveal>

      <div className={styles.events}>
        {selectHomeEvents(season.events).map((ev, i) => (
          <Reveal key={ev.id} delay={0.08 * i}>
            <EventCard ev={ev} />
          </Reveal>
        ))}
      </div>

    </section>
  )
}
