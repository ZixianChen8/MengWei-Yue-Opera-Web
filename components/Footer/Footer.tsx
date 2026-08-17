import Link from 'next/link'
import { contact, footer, nav } from '@/content/home'
import { siteNavLinks } from '@/lib/nav-links'
import Reveal from '@/components/Reveal/Reveal'
import styles from './Footer.module.css'

export default function Footer() {
  const contactHeading = footer.columns[1]?.heading ?? 'To Reach Us · 留书'
  const mailto = `mailto:${contact.email}`

  return (
    <footer className={styles.footer}>
      <div className={styles.ornament}>{footer.ornament}</div>

      <div className={styles.inner}>
        <Reveal className={styles.brandBlock}>
          <div className={styles.mark}>
            {footer.brand.zh}
            <small>{footer.brand.en}</small>
          </div>
        </Reveal>

        <Reveal className={styles.legalBlock}>
          <p className={styles.line}>
            {footer.legal.zh}<br />
            {footer.legal.en}
          </p>
        </Reveal>

        <Reveal className={styles.col} delay={0.1}>
          <h4>{footer.columns[0]?.heading}</h4>
          {siteNavLinks.map((item) => (
            <Link key={item.en} href={item.href}>
              {item.zh}<span className={styles.en}>{item.en}</span>
            </Link>
          ))}
        </Reveal>

        <Reveal className={styles.col} delay={0.2}>
          <h4>{contactHeading}</h4>
          <a href={mailto}>
            {contact.email}<span className={styles.en}>By letter</span>
          </a>
        </Reveal>
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
