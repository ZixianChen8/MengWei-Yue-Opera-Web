import Link from 'next/link'
import type { SpecialMenuItem, SpecialPageHead } from '@/content/specials'
import Reveal from '@/components/Reveal/Reveal'
import Silk from '@/components/Silk/Silk'
import styles from './Anniversary.module.css'

type Props = {
  pageHead: SpecialPageHead
  menu: SpecialMenuItem[]
}

// Special-event hub: a masthead plus a menu of enabled sub-pages.
export default function Anniversary({ pageHead, menu }: Props) {
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
                <span className={styles.rowArrow} aria-hidden="true" />
              </>
            )
            return (
              <Reveal as="li" key={item.href} className={styles.row} delay={0.06 * i}>
                <Link href={item.href} className={styles.rowLink}>
                  {inner}
                </Link>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </main>
  )
}
