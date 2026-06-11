import Link from 'next/link'
import { anniversary } from '@/content/booklet'
import Reveal from '@/components/Reveal/Reveal'
import styles from './Anniversary.module.css'

// The 10th Anniversary Special hub: a masthead for Yuespiration plus a small
// menu of sub-pages. Only `ready` tiles link out; the rest read "coming soon".
export default function Anniversary() {
  const { pageHead, menu } = anniversary

  return (
    <main className={styles.hub}>
      <div className={styles.curtain} aria-hidden="true" />
      <div className={styles.inner}>
        <Reveal as="header" className={styles.head}>
          <p className={styles.meta}>{pageHead.meta}</p>
          <h1 className={styles.title}>{pageHead.titleZh}</h1>
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
                <span className={styles.tileCue}>
                  {item.ready ? '查看 · Open' : '敬请期待 · Coming soon'}
                </span>
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
