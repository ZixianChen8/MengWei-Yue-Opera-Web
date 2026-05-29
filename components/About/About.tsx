import Image from 'next/image'
import { about } from '@/content/home'
import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <Image
        src="/assets/bg3.webp"
        alt=""
        fill
        className={styles.bg}
        sizes="100vw"
        aria-hidden="true"
      />
<div className={styles.frame}>

        <div className={styles.colL}>
          <p className={styles.lede}>
            {about.verse.map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <p className={styles.ledeEn}>{about.verseEn}</p>
        </div>

        <div className={styles.center}>
          <div className={styles.vertMeta}>{about.vertMeta}</div>
          <div className={styles.vertTitle}>
            {about.vertTitle.before}
            <span className={styles.red}>{about.vertTitle.red}</span>
            {about.vertTitle.after}
          </div>
        </div>

        <div className={styles.colR}>
          <p className={styles.lede}>
            {about.mission.map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <a className={styles.ctaLine} href={about.cta.href}>
            <span>{about.cta.zh}</span>
            <span className={styles.ctaEn}>{about.cta.en}</span>
            <span className={styles.ctaArrow}>→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
