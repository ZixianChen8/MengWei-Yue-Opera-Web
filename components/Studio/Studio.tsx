import Image from 'next/image'
import Link from 'next/link'
import { studio } from '@/content/home'
import styles from './Studio.module.css'

export default function Studio() {
  return (
    <section id="studio" className={styles.section}>
      <Image
        src="/assets/bg2.webp"
        alt=""
        fill
        className={styles.bg}
        sizes="100vw"
        aria-hidden="true"
      />
      <div className={styles.inner}>
        <div>
          <h2 className={styles.title}>
            {studio.title.zh}<small>{studio.title.en}</small>
          </h2>
          <div className={styles.body}>
            {studio.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className={styles.program}>
            {studio.program.map((row) => (
              <div key={row.level} className={styles.row}>
                <div className={styles.lvl}>{row.level}</div>
                <div className={styles.en}>{row.en}</div>
                <div className={styles.when}>{row.duration}</div>
              </div>
            ))}
          </div>

          <Link href={studio.cta.href} className={styles.cta}>
            {studio.cta.zh}
            <span className={styles.ctaEn}>{studio.cta.en}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
