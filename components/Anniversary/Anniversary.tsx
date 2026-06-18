import Link from 'next/link'
import { anniversary } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import Silk from '@/components/Silk/Silk'
import styles from './Anniversary.module.css'

// The 10th Anniversary Special hub: a masthead for Yuespiration plus a small
// menu of sub-pages. Only `ready` tiles link out.
export default function Anniversary() {
  const { pageHead, menu } = anniversary
  const titleLines = pageHead.titleZh.split(' ')

  return (
    <main className={styles.hub}>
      <div className={styles.silkBg} aria-hidden="true">
        <Silk speed={5} scale={1.1} color="#711816" noiseIntensity={0.8} rotation={2.2} />
      </div>
      <div className={styles.inner}>
        <Reveal as="header" className={styles.head}>
          <p className={styles.meta}>{pageHead.meta}</p>
          <h1 className={styles.title}>
            {titleLines.map((line, index) => (
              <span key={line} className={styles.titleLine}>
                {line}
                {index < titleLines.length - 1 && ' '}
              </span>
            ))}
          </h1>
          <p className={styles.titleEn}>{pageHead.titleEn}</p>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.tagline}>{pageHead.tagline}</p>
        </Reveal>

        <ul className={styles.menu}>
          {menu.map((item) => {
            const inner = (
              <>
                <span className={styles.tileZh}>{item.zh}</span>
                <span className={styles.tileEn}>{item.en}</span>
              </>
            )
            return (
              <li key={item.en} className={styles.tileWrap}>
                {item.ready ? (
                  <Link href={item.href} className={styles.tile}>
                    {inner}
                  </Link>
                ) : (
                  <div className={`${styles.tile} ${styles.tileDisabled}`} aria-disabled="true">
                    {inner}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </main>
  )
}
