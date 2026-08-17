'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { SpecialSummary } from '@/lib/specials-store'
import styles from './admin.module.css'

const TAB_LABELS = [
  { key: 'booklet', label: '场刊' },
  { key: 'programme', label: '节目单' },
  { key: 'appreciation', label: '导赏' },
] as const

export default function SpecialsList() {
  const [items, setItems] = useState<SpecialSummary[]>([])
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const load = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch('/api/admin/specials', { cache: 'no-store', signal })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '加载失败')
    return json.items as SpecialSummary[]
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    load(controller.signal)
      .then((next) => {
        if (cancelled) return
        setItems(next)
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
  }, [load])

  async function reorder(from: number, dir: -1 | 1) {
    const to = from + dir
    if (to < 0 || to >= items.length) return
    const next = items.slice()
    ;[next[from], next[to]] = [next[to], next[from]]
    setItems(next)
    setBusy(true)
    setError(null)
    setSavedMsg(null)
    try {
      const res = await fetch('/api/admin/specials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: next.map((item) => item.slug) }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '排序失败')
      setSavedMsg('顺序已保存。网站将在重新部署完成后更新（约 1–2 分钟）。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '排序失败')
      const next = await load()
      setItems(next)
      setLoadState('ready')
    } finally {
      setBusy(false)
    }
  }

  async function remove(slug: string, title: string) {
    if (!window.confirm(`确定删除「${title}」？此操作会从网站上移除该专场页面。`)) return
    setBusy(true)
    setError(null)
    setSavedMsg(null)
    try {
      const res = await fetch(`/api/admin/specials/${encodeURIComponent(slug)}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '删除失败')
      setItems((current) => current.filter((item) => item.slug !== slug))
      setSavedMsg('已删除。网站将在重新部署完成后更新（约 1–2 分钟）。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className={styles.editorHead}>
        <div>
          <Link href="/admin" className={styles.backLink}>
            ← 返回面板
          </Link>
          <h1 className={styles.editorTitle}>特别活动</h1>
        </div>
        <div className={styles.toolbar}>
          <Link href="/admin/specials/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            新建专场
          </Link>
        </div>
      </div>

      <p className={styles.introBlurb}>
        以十周年场刊 / 节目单 / 导赏为模板，创建大型特别活动页面。导航标题在各专场设置里填写，会自动出现在网站导航「关于」之前。
      </p>

      {savedMsg && <div className={`${styles.status} ${styles.statusOk}`}>{savedMsg}</div>}
      {error && <div className={`${styles.status} ${styles.statusErr}`}>{error}</div>}
      {loadState === 'loading' && <div className={styles.loading}>正在加载…</div>}

      {loadState === 'ready' && items.length === 0 && (
        <div className={styles.arrayEmpty}>还没有特别活动。点击「新建专场」开始。</div>
      )}

      {loadState === 'ready' &&
        items.map((item, i) => {
          const tabsOn = TAB_LABELS.filter((tab) => item.tabs[tab.key]).map((tab) => tab.label)
          return (
            <div key={item.slug} className={styles.arrayItem}>
              <div className={styles.arrayHead}>
                <div>
                  <div className={styles.collapseTitle}>{item.navZh || item.slug}</div>
                  <div className={styles.collapseDetail}>
                    {item.navEn} · /special/{item.slug}
                    {item.showInNav ? ' · 已加入导航' : ' · 未加入导航'}
                    {tabsOn.length > 0 ? ` · ${tabsOn.join(' / ')}` : ' · 仅主页'}
                  </div>
                </div>
                <div className={styles.arrayControls}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => reorder(i, -1)}
                    disabled={busy || i === 0}
                    aria-label="上移"
                  >
                    ^
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => reorder(i, 1)}
                    disabled={busy || i === items.length - 1}
                    aria-label="下移"
                  >
                    v
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => remove(item.slug, item.navZh || item.slug)}
                    disabled={busy}
                    aria-label="删除"
                  >
                    x
                  </button>
                </div>
              </div>
              <div className={styles.toolbar}>
                <Link href={`/admin/specials/${item.slug}`} className={styles.btn}>
                  设置
                </Link>
                <Link href={`/special/${item.slug}`} className={styles.btn} target="_blank" rel="noreferrer">
                  查看页面
                </Link>
              </div>
            </div>
          )
        })}
    </div>
  )
}
