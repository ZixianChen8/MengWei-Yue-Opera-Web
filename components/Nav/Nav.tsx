import Image from 'next/image'
import Link from 'next/link'
import { nav } from '@/content/home'
import styles from './Nav.module.css'

type NavProps = {
  variant?: 'overlay' | 'horizontal'
}

export default function Nav({ variant = 'overlay' }: NavProps) {
  const navClassName = variant === 'horizontal'
    ? `${styles.nav} ${styles.horizontal}`
    : styles.nav

  return (
    <nav className={navClassName}>
      <Link href="/" className={styles.brand} aria-label="Meng Wei Yue Opera Studio home">
        <Image
          src="/assets/Logo-1.PNG"
          alt="加拿大孟伟越剧艺术传习所"
          width={262}
          height={267}
          className={styles.logo}
          priority
        />
      </Link>

      <div className={styles.menu}>
        {nav.links.map((item) => (
          <Link key={item.en} href={item.href} className={styles.menuItem}>
            {item.zh}<span className={styles.en}>{item.en}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
