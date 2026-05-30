import Link from 'next/link'
import { SECTIONS, type SectionDef } from '@/lib/content-config'
import styles from '@/components/admin/admin.module.css'

export const dynamic = 'force-dynamic'

const GROUP_ORDER: SectionDef['group'][] = ['Programme', 'Site text', 'Pages']

export default function AdminDashboard() {
  return (
    <div>
      <div className={styles.intro}>
        <h1 className={styles.introTitle}>内容管理 · Content</h1>
        <p className={styles.introBlurb}>
          Edit the studio website here. Changes are saved to the site&rsquo;s content and go live after a
          short automatic redeploy (about 1–2 minutes).
        </p>
      </div>

      {GROUP_ORDER.map((group) => {
        const items = SECTIONS.filter((s) => s.group === group)
        if (items.length === 0) return null
        return (
          <section key={group} className={styles.dashGroup}>
            <h2 className={styles.groupTitle}>{group}</h2>
            <div className={styles.cards}>
              {items.map((s) => (
                <Link key={`${s.target}/${s.section}`} href={`/admin/edit/${s.target}/${s.section}`} className={styles.card}>
                  <div className={styles.cardLabel}>{s.label}</div>
                  <div className={styles.cardBlurb}>{s.blurb}</div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
