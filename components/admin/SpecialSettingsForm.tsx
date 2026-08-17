'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { SpecialEvent, SpecialTabKey } from '@/content/specials'
import ImageUpload from './ImageUpload'
import styles from './admin.module.css'

const PARTS = [
  { key: 'hub', label: '专场主页', tab: null },
  { key: 'booklet', label: '场刊', tab: 'booklet' },
  { key: 'programmePage', label: '节目单', tab: 'programme' },
  { key: 'appreciationPage', label: '导赏', tab: 'appreciation' },
] as const

const TAB_FIELDS: { key: SpecialTabKey; label: string }[] = [
  { key: 'booklet', label: '场刊' },
  { key: 'programme', label: '节目单' },
  { key: 'appreciation', label: '导赏' },
]

export default function SpecialSettingsForm({ slug }: { slug: string }) {
  const [item, setItem] = useState<SpecialEvent | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const fetchItem = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch(`/api/admin/specials/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      signal,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '加载失败')
    return json.item as SpecialEvent
  }, [slug])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    fetchItem(controller.signal)
      .then((next) => {
        if (cancelled) return
        setItem(next)
        setLoadState('ready')
      })
      .catch((err) => {
        if (cancelled || controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载失败')
        setLoadState('error')
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [fetchItem])

  async function reload() {
    setLoadState('loading')
    setError(null)
    setSavedMsg(null)
    try {
      setItem(await fetchItem())
      setLoadState('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
      setLoadState('error')
    }
  }

  async function save() {
    if (!item) return
    setSaving(true)
    setError(null)
    setSavedMsg(null)
    try {
      const res = await fetch(`/api/admin/specials/${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            showInNav: item.showInNav,
            navZh: item.navZh,
            navEn: item.navEn,
            hubTab: item.hubTab,
            logo: item.logo,
            tabs: item.tabs,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '保存失败')
      setSavedMsg('已保存并提交。网站将在重新部署完成后更新（约 1–2 分钟）。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
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
          <h1 className={styles.editorTitle}>{item?.navZh || slug}</h1>
        </div>
        <div className={styles.toolbar}>
          <button type="button" className={styles.btn} onClick={reload} disabled={saving || loadState === 'loading'}>
            重新加载
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={save}
            disabled={saving || loadState !== 'ready'}
          >
            {saving ? '保存中…' : '保存并发布'}
          </button>
        </div>
      </div>

      {savedMsg && <div className={`${styles.status} ${styles.statusOk}`}>{savedMsg}</div>}
      {error && <div className={`${styles.status} ${styles.statusErr}`}>{error}</div>}
      {loadState === 'loading' && <div className={styles.loading}>正在加载…</div>}

      {item && loadState === 'ready' && (
        <>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>网址别名</span>
            <input className={styles.input} value={item.slug} disabled />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>导航标题（中文）</span>
            <input
              className={styles.input}
              value={item.navZh}
              onChange={(e) => setItem({ ...item, navZh: e.target.value })}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>导航标题（英文）</span>
            <input
              className={styles.input}
              value={item.navEn}
              onChange={(e) => setItem({ ...item, navEn: e.target.value })}
            />
          </label>
          <label className={`${styles.field} ${styles.checkboxRow}`}>
            <input
              type="checkbox"
              checked={item.showInNav}
              onChange={(e) => setItem({ ...item, showInNav: e.target.checked })}
            />
            <span>加入网站导航</span>
          </label>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>专场标志</span>
            <ImageUpload value={item.logo} onChange={(logo) => setItem({ ...item, logo })} />
          </div>
          <div className={styles.group}>
            <div className={styles.groupLabel}>主页底栏标签</div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>中文</span>
              <input
                className={styles.input}
                value={item.hubTab.zh}
                onChange={(e) => setItem({ ...item, hubTab: { ...item.hubTab, zh: e.target.value } })}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>英文</span>
              <input
                className={styles.input}
                value={item.hubTab.en}
                onChange={(e) => setItem({ ...item, hubTab: { ...item.hubTab, en: e.target.value } })}
              />
            </label>
          </div>

          {TAB_FIELDS.map((tab) => {
            const current = item.tabs[tab.key]
            return (
              <div key={tab.key} className={styles.group}>
                <label className={`${styles.groupLabel} ${styles.checkboxRow}`}>
                  <input
                    type="checkbox"
                    checked={current.enabled}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        tabs: { ...item.tabs, [tab.key]: { ...current, enabled: e.target.checked } },
                      })
                    }
                  />
                  <span>{tab.label}</span>
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>底栏中文</span>
                  <input
                    className={styles.input}
                    value={current.navZh}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        tabs: { ...item.tabs, [tab.key]: { ...current, navZh: e.target.value } },
                      })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>底栏英文</span>
                  <input
                    className={styles.input}
                    value={current.navEn}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        tabs: { ...item.tabs, [tab.key]: { ...current, navEn: e.target.value } },
                      })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>主页菜单中文</span>
                  <input
                    className={styles.input}
                    value={current.menuZh}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        tabs: { ...item.tabs, [tab.key]: { ...current, menuZh: e.target.value } },
                      })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>主页菜单英文</span>
                  <input
                    className={styles.input}
                    value={current.menuEn}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        tabs: { ...item.tabs, [tab.key]: { ...current, menuEn: e.target.value } },
                      })
                    }
                  />
                </label>
              </div>
            )
          })}

          <div className={styles.group}>
            <div className={styles.groupLabel}>编辑文案</div>
            <div className={styles.cards}>
              {PARTS.map((part) => (
                <Link
                  key={part.key}
                  href={`/admin/specials/${slug}/${part.key}`}
                  className={styles.card}
                >
                  <div className={styles.cardLabel}>{part.label}</div>
                  <div className={styles.cardBlurb}>
                    {part.tab && !item.tabs[part.tab].enabled
                      ? '已关闭，仍可预先填写内容'
                      : '编辑此页内容'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
