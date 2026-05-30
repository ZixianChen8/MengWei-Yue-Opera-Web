import { overture } from '@/content/home'
import styles from './Overture.module.css'

export default function Overture() {
  return (
    <section id="overture" className={styles.section}>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.title}>
            {overture.title.zh[0]}<br />{overture.title.zh[1]}
            <small>{overture.title.en}</small>
          </h2>
          <blockquote className={styles.quote}>
            &ldquo;{overture.quote.text}&rdquo;
          </blockquote>
        </div>

        <div className={styles.body}>
          {overture.body.map((p, i) => <p key={i}>{p}</p>)}

          <div className={styles.meta}>
            {overture.stats.map((s) => (
              <div key={s.value}>
                <div className={styles.k}>{s.value}</div>
                <div className={styles.v}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
