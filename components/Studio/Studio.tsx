import Image from 'next/image'
import Link from 'next/link'
import { studio } from '@/content/home'
import Reveal from '@/components/Reveal/Reveal'
import styles from './Studio.module.css'

export default function Studio() {
  return (
    <section id="studio" className={styles.section}>
      <div className={styles.bgClip} aria-hidden="true">
        <Image
          src="/assets/bg2.webp"
          alt=""
          fill
          className={styles.bg}
          sizes="100vw"
        />
      </div>
      <div className={styles.inner}>
        <Reveal>
          <h2 className={styles.title}>
            {studio.title.zh}<small>{studio.title.en}</small>
          </h2>
          <div className={styles.body}>
            {studio.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className={styles.program}>
            {studio.program.map((row, i) => (
              <Reveal key={row.level} className={styles.row} delay={0.06 * i}>
                <div className={styles.lvl}>{row.level}</div>
                <div className={styles.en}>{row.en}</div>
                <div className={styles.when}>{row.duration}</div>
              </Reveal>
            ))}
          </div>

          <Link href={studio.cta.href} className={styles.cta}>
            {studio.cta.zh}
            <span className={styles.ctaEn}>{studio.cta.en}</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
