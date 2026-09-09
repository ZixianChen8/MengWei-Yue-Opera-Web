import Link from 'next/link'
import type { SpecialEvent } from '@/content/special'
import { specialPageHref } from '@/content/special'
import Reveal from '@/components/Reveal/Reveal'
import Silk from '@/components/Silk/Silk'
import styles from './SpecialHub.module.css'

// Hub page for a special event (专场): a masthead plus an index of its
// sub-pages. Only `ready` rows link out; the rest read "即将上线".
export default function SpecialHub({ event }: { event: SpecialEvent }) {
  const { pageHead } = event.hub
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
          {event.pages.map((item, i) => {
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
              <Reveal as="li" key={item.id} className={styles.row} delay={0.06 * i}>
                {item.ready ? (
                  <Link href={specialPageHref(event.slug, item.id)} className={styles.rowLink}>
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
