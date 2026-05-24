import Image from 'next/image'
import { nav } from '@/content/home'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <Image
          src="/assets/Logo-horizontal.PNG"
          alt="加拿大孟伟越剧艺术传习所"
          width={792}
          height={612}
          className={styles.logo}
          priority
        />
      </div>

      <div className={styles.menu}>
        {nav.links.map((item) => (
          <a key={item.en} href={item.href} className={styles.menuItem}>
            {item.zh}<span className={styles.en}>{item.en}</span>
          </a>
        ))}
        <button className={styles.contactBtn}>
          <span>{nav.contact.zh}</span>
          <span className={styles.en}>{nav.contact.en}</span>
        </button>
      </div>
    </nav>
  )
}
