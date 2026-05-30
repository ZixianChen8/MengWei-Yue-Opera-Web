import Link from 'next/link'
import { season } from '@/content/home'
import EventCard from './EventCard'
import styles from './Season.module.css'

export default function Season() {
  return (
    <section id="season" className={styles.section}>
      <div className={styles.head}>
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
      </div>

      <div className={styles.events}>
        {season.events.slice(0, 3).map((ev) => (
          <EventCard key={ev.id} ev={ev} />
        ))}
      </div>

    </section>
  )
}
