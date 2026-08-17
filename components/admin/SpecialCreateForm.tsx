'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './admin.module.css'

const TABS = [
  { key: 'booklet', label: '场刊' },
  { key: 'programme', label: '节目单' },
  { key: 'appreciation', label: '导赏' },
] as const

export default function SpecialCreateForm() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [navZh, setNavZh] = useState('')
  const [navEn, setNavEn] = useState('')
  const [showInNav, setShowInNav] = useState(true)
  const [tabs, setTabs] = useState({ booklet: true, programme: true, appreciation: true })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/specials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, navZh, navEn, showInNav, tabs }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '创建失败')
      router.push(`/admin/specials/${json.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败')
      setSaving(false)
    }
  }

  return (
    <div>
      <div className={styles.editorHead}>
        <div>
          <Link href="/admin/specials" className={styles.backLink}>
            ← 返回特别活动
          </Link>
          <h1 className={styles.editorTitle}>新建专场</h1>
        </div>
      </div>

      {error && <div className={`${styles.status} ${styles.statusErr}`}>{error}</div>}

      <form onSubmit={submit}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>网址别名</span>
          <input
            className={styles.input}
            value={slug}
            onChange={(e) => setSlug(e.target.value.trim().toLowerCase())}
            placeholder="spring-gala"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>导航标题（中文）</span>
          <input className={styles.input} value={navZh} onChange={(e) => setNavZh(e.target.value)} required />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>导航标题（英文）</span>
          <input className={styles.input} value={navEn} onChange={(e) => setNavEn(e.target.value)} required />
        </label>
        <label className={`${styles.field} ${styles.checkboxRow}`}>
          <input type="checkbox" checked={showInNav} onChange={(e) => setShowInNav(e.target.checked)} />
          <span>加入网站导航</span>
        </label>
        <div className={styles.group}>
          <div className={styles.groupLabel}>子页面</div>
          {TABS.map((tab) => (
            <label key={tab.key} className={`${styles.field} ${styles.checkboxRow}`}>
              <input
                type="checkbox"
                checked={tabs[tab.key]}
                onChange={(e) => setTabs((current) => ({ ...current, [tab.key]: e.target.checked }))}
              />
              <span>{tab.label}</span>
            </label>
          ))}
        </div>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
          {saving ? '创建中…' : '创建并继续编辑'}
        </button>
      </form>
    </div>
  )
}
