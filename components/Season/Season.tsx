import { season } from '@/content/home'
import Eyebrow from '@/components/Eyebrow/Eyebrow'
import EventCard from './EventCard'
import styles from './Season.module.css'

export default function Season() {
  return (
    <section id="season" className={styles.section}>
      <div className={styles.head}>
        <div>
          <Eyebrow label={season.eyebrow} />
          <h2 className={styles.title}>
            {season.title.zh}<small>{season.title.en}</small>
          </h2>
        </div>
        <div className={styles.aside}>
          {season.aside.zh}
          <span className={styles.en}>{season.aside.en}</span>
        </div>
      </div>

      <div className={styles.events}>
        {season.events.map((ev) => (
          <EventCard key={ev.id} ev={ev} />
        ))}
      </div>
    </section>
  )
}
