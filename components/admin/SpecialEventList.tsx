'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SLUG_HINT, isValidSlug, suggestSlug } from '@/lib/special-paths'
import styles from './admin.module.css'

type EventRow = {
  slug: string
  titleZh: string
  titleEn: string
  published: boolean
  inNav: boolean
  pages: { id: string; type: string; zh: string; ready: boolean }[]
}

type LoadState = 'loading' | 'ready' | 'error'

export default function SpecialEventList() {
  const router = useRouter()
  const [events, setEvents] = useState<EventRow[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)

  const [titleZh, setTitleZh] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [creating, setCreating] = useState(false)

  const fetchEvents = useCallback(async (signal?: AbortSignal): Promise<EventRow[]> => {
    const res = await fetch('/api/admin/special', { cache: 'no-store', signal })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '加载专场列表失败')
    return json.events ?? []
  }, [])

  const load = useCallback(async () => {
    setLoadState('loading')
    setError(null)
    try {
      setEvents(await fetchEvents())
      setLoadState('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载专场列表失败')
      setLoadState('error')
    }
  }, [fetchEvents])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    fetchEvents(controller.signal)
      .then((rows) => {
        if (cancelled) return
        setEvents(rows)
        setLoadState('ready')
      })
      .catch((err) => {
        if (cancelled || controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载专场列表失败')
        setLoadState('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [fetchEvents])

  // The slug is suggested from the English title until the operator edits it.
  const effectiveSlug = slugTouched ? slug : suggestSlug(titleEn || titleZh)

  async function create() {
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/special', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', slug: effectiveSlug, titleZh, titleEn }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '创建失败')
      router.push(`/admin/special/${effectiveSlug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败')
      setCreating(false)
    }
  }

  async function remove(row: EventRow) {
    const name = row.titleZh || row.titleEn || row.slug
    if (!window.confirm(`确定要删除专场「${name}」吗？该专场的所有页面内容都会被移除，且无法撤销。`)) {
      return
    }
    setError(null)
    try {
      const res = await fetch('/api/admin/special', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteEvent', slug: row.slug }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '删除失败')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    }
  }

  const canCreate =
    !creating && (titleZh.trim() || titleEn.trim()) && isValidSlug(effectiveSlug)

  return (
    <div>
      <div className={styles.editorHead}>
        <div>
          <Link href="/admin" className={styles.backLink}>← 返回面板</Link>
          <h1 className={styles.editorTitle}>专场</h1>
        </div>
        <div className={styles.toolbar}>
          <button type="button" className={styles.btn} onClick={load} disabled={loadState === 'loading'}>
            重新加载
          </button>
        </div>
      </div>

      <p className={styles.introBlurb}>
        每个专场都有自己的网址与页面。新建专场后，可添加「场刊 / 节目单 / 导赏」等页面并逐页编辑内容。
      </p>

      {error && <div className={`${styles.status} ${styles.statusErr}`}>{error}</div>}
      {loadState === 'loading' && <div className={styles.loading}>正在加载专场…</div>}

      {loadState === 'ready' && (
        <div className={styles.eventList}>
          {events.length === 0 && (
            <div className={styles.arrayEmpty}>还没有专场。在下方新建第一个专场。</div>
          )}
          {events.map((row) => (
            <div key={row.slug} className={styles.eventRow}>
              <div className={styles.eventHead}>
                <Link href={`/admin/special/${row.slug}`} className={styles.eventSummary}>
                  <span className={styles.eventName}>
                    {row.titleZh || row.titleEn || row.slug}
                  </span>
                  <span className={styles.eventMeta}>
                    <span>/special/{row.slug}</span>
                    <span>{row.pages.length} 个页面</span>
                    <span className={row.published ? styles.eventChipOn : undefined}>
                      {row.published ? '已发布' : '未发布'}
                    </span>
                    {row.inNav && <span className={styles.eventChipOn}>导航中</span>}
                  </span>
                </Link>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => remove(row)}
                  aria-label={`删除 ${row.titleZh || row.slug}`}
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.collapsible}>
        <div className={styles.collapsibleBody}>
          <h2 className={styles.groupTitle}>新建专场</h2>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>中文名称</label>
            <input
              className={styles.input}
              type="text"
              value={titleZh}
              placeholder="例如：十载芳馨 越动枫华"
              onChange={(e) => setTitleZh(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>英文名称</label>
            <input
              className={styles.input}
              type="text"
              value={titleEn}
              placeholder="例如：10th Anniversary Special"
              onChange={(e) => setTitleEn(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>网址名称</label>
            <input
              className={styles.input}
              type="text"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
            />
            <span className={styles.uploadHint}>
              {SLUG_HINT} 专场网址为 /special/{effectiveSlug || '…'}，创建后不可更改。
            </span>
          </div>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={create}
            disabled={!canCreate}
          >
            {creating ? '创建中…' : '新建专场'}
          </button>
        </div>
      </div>
    </div>
  )
}
