import Link from 'next/link'
import { footer, nav } from '@/content/home'
import styles from './Footer.module.css'

export default function Footer() {
  const contactColumn = footer.columns[1]

  return (
    <footer className={styles.footer}>
      <div className={styles.ornament}>{footer.ornament}</div>

      <div className={styles.inner}>
        <div>
          <div className={styles.mark}>
            {footer.brand.zh}
            <small>{footer.brand.en}</small>
          </div>
          <p className={styles.line}>
            {footer.legal.zh}<br />
            {footer.legal.en}
          </p>
        </div>

        <div className={styles.col}>
          <h4>{footer.columns[0]?.heading}</h4>
          {nav.links.map((item) => (
            <Link key={item.en} href={item.href}>
              {item.zh}<span className={styles.en}>{item.en}</span>
            </Link>
          ))}
        </div>

        {contactColumn ? (
          <div className={styles.col}>
            <h4>{contactColumn.heading}</h4>
            {contactColumn.links.map((item) => (
              <a key={`${item.en}-${item.href}`} href={item.href}>
                {item.zh}<span className={styles.en}>{item.en}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.bottom}>
        <div>{footer.copyright}</div>
        <div className={styles.sealMark}>
          <span>{footer.sealLine}</span>
          <span className={styles.stamp}>
            <span className={styles.stampGlyph}>{nav.brand.seal}</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
