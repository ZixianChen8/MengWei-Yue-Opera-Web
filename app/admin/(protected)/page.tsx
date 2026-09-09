import Link from 'next/link'
import {
  CUSTOM_EDITORS,
  GROUP_LABELS,
  SECTIONS,
  type SectionGroup,
} from '@/lib/content-config'
import styles from '@/components/admin/admin.module.css'

export const dynamic = 'force-dynamic'

const GROUP_ORDER: SectionGroup[] = ['Programme', 'Site text', 'Pages']

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
        const items = [
          ...SECTIONS.filter((s) => s.group === group).map((s) => ({
            key: `${s.target}/${s.section}`,
            href: `/admin/edit/${s.target}/${s.section}`,
            label: s.label,
            blurb: s.blurb,
          })),
          ...CUSTOM_EDITORS.filter((e) => e.group === group).map((e) => ({
            key: e.href,
            href: e.href,
            label: e.label,
            blurb: e.blurb,
          })),
        ]
        if (items.length === 0) return null
        return (
          <section key={group} className={styles.dashGroup}>
            <h2 className={styles.groupTitle}>{GROUP_LABELS[group]}</h2>
            <div className={styles.cards}>
              {items.map((item) => (
                <Link key={item.key} href={item.href} className={styles.card}>
                  <div className={styles.cardLabel}>{item.label}</div>
                  <div className={styles.cardBlurb}>{item.blurb}</div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
