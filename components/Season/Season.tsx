import { season } from '@/content/home'
import Eyebrow from '@/components/Eyebrow/Eyebrow'
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
          <article
            key={ev.num}
            className={ev.feature ? `${styles.event} ${styles.feature}` : styles.event}
          >
            <div className={styles.eRow}>
              <span className={styles.eNum}>{ev.num}</span>
              <span className={styles.eTag}>{ev.tag}</span>
            </div>
            <h3 className={styles.eCn}>
              {ev.titleZh.map((line, i) => (
                <span key={i}>{line}{i < ev.titleZh.length - 1 && <br />}</span>
              ))}
            </h3>
            <div className={styles.eEn}>{ev.titleEn}</div>
            <p className={styles.eBlurb}>{ev.blurb}</p>
            <div className={styles.eWhen}>
              <span>{ev.date}</span>
              <span className={styles.dot} />
              <span>{ev.venue}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
