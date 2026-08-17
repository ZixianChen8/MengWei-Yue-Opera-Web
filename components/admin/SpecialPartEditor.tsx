'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { SpecialEvent } from '@/content/specials'
import type { SpecialPartKey } from '@/lib/specials-store'
import SectionForm, { type JsonValue } from './SectionForm'
import styles from './admin.module.css'

const PART_LABELS: Record<SpecialPartKey, string> = {
  hub: '专场主页',
  booklet: '场刊',
  programmePage: '节目单',
  appreciationPage: '导赏',
}

export default function SpecialPartEditor({
  slug,
  part,
}: {
  slug: string
  part: SpecialPartKey
}) {
  const [data, setData] = useState<JsonValue>(null)
  const [title, setTitle] = useState(slug)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const fetchPart = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch(`/api/admin/specials/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      signal,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '加载失败')
    const item = json.item as SpecialEvent
    return { title: item.navZh || slug, data: item[part] as JsonValue }
  }, [slug, part])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    fetchPart(controller.signal)
      .then((next) => {
        if (cancelled) return
        setTitle(next.title)
        setData(next.data)
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
  }, [fetchPart])

  async function reload() {
    setLoadState('loading')
    setError(null)
    setSavedMsg(null)
    try {
      const next = await fetchPart()
      setTitle(next.title)
      setData(next.data)
      setLoadState('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
      setLoadState('error')
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    setSavedMsg(null)
    try {
      const res = await fetch(`/api/admin/specials/${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ part, data }),
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
          <Link href={`/admin/specials/${slug}`} className={styles.backLink}>
            ← 返回 {title}
          </Link>
          <h1 className={styles.editorTitle}>{PART_LABELS[part]}</h1>
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
      {loadState === 'loading' && <div className={styles.loading}>正在加载内容…</div>}
      {loadState === 'ready' && <SectionForm value={data} onChange={setData} />}
    </div>
  )
}
