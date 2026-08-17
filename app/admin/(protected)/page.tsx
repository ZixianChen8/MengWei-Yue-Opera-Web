import Link from 'next/link'
import { SECTIONS, GROUP_LABELS, type SectionGroup } from '@/lib/content-config'
import styles from '@/components/admin/admin.module.css'

export const dynamic = 'force-dynamic'

const GROUP_ORDER: SectionGroup[] = ['Programme', 'Specials', 'Site text', 'Pages']

export default function AdminDashboard() {
  return (
    <div>
      <div className={styles.intro}>
        <h1 className={styles.introTitle}>内容管理</h1>
        <p className={styles.introBlurb}>
          在此编辑工作室网站的内容。保存后会自动重新部署，约 1–2 分钟后在网站上生效。
        </p>
      </div>

      {GROUP_ORDER.map((group) => {
        const items = SECTIONS.filter((s) => s.group === group)
        const showSpecialsCard = group === 'Specials'
        if (items.length === 0 && !showSpecialsCard) return null
        return (
          <section key={group} className={styles.dashGroup}>
            <h2 className={styles.groupTitle}>{GROUP_LABELS[group]}</h2>
            <div className={styles.cards}>
              {showSpecialsCard && (
                <Link href="/admin/specials" className={styles.card}>
                  <div className={styles.cardLabel}>特别活动</div>
                  <div className={styles.cardBlurb}>
                    以十周年场刊 / 节目单 / 导赏为模板，新建或编辑大型专场页面，并设置导航标题。
                  </div>
                </Link>
              )}
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
