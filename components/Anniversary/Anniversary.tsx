import Link from 'next/link'
import { anniversary } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import Silk from '@/components/Silk/Silk'
import styles from './Anniversary.module.css'

// The 10th Anniversary Special hub: a masthead plus a small
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

        <ol className={styles.index}>
          {menu.map((item, i) => {
            const num = String(i + 1).padStart(2, '0')
            const inner = (
              <>
                <span className={styles.rowNum} aria-hidden="true">{num}</span>
                <span className={styles.rowMain}>
                  <span className={styles.rowZh}>{item.zh}</span>
                  <span className={styles.rowEn}>{item.en}</span>
                </span>
                {item.ready ? (
                  <span className={styles.rowArrow} aria-hidden="true" />
                ) : (
                  <span className={styles.rowCue}>即将上线 · Coming soon</span>
                )}
              </>
            )
            return (
              <Reveal as="li" key={item.en} className={styles.row} delay={0.06 * i}>
                {item.ready ? (
                  <Link href={item.href} className={styles.rowLink}>
                    {inner}
                  </Link>
                ) : (
                  <div className={`${styles.rowLink} ${styles.rowDisabled}`} aria-disabled="true">
                    {inner}
                  </div>
                )}
              </Reveal>
            )
          })}
        </ol>
      </div>
    </main>
  )
}
