'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import SectionForm, { type JsonValue } from './SectionForm'
import { pageTypeMeta } from '@/lib/special-templates'
import type { SpecialEvent, SpecialPage } from '@/content/special'
import styles from './admin.module.css'

type LoadState = 'loading' | 'ready' | 'error'

// Content editor for one page of one special event. The page's structure is
// fixed by its template type, so the generic JSON form renders it; only the
// content is sent back, which keeps the event's other pages untouched.
export default function SpecialPageEditor({ slug, pageId }: { slug: string; pageId: string }) {
  const [meta, setMeta] = useState<{ event: SpecialEvent; page: SpecialPage } | null>(null)
  const [content, setContent] = useState<JsonValue>(null)
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchPage = useCallback(
    async (signal?: AbortSignal): Promise<{ event: SpecialEvent; page: SpecialPage }> => {
      const res = await fetch(`/api/admin/special?slug=${encodeURIComponent(slug)}`, {
        cache: 'no-store',
        signal,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '加载内容失败')
      const event = json.event as SpecialEvent
      const page = event.pages.find((p) => p.id === pageId)
      if (!page) throw new Error(`未找到页面 ${pageId}`)
      return { event, page }
    },
    [slug, pageId],
  )

  const load = useCallback(async () => {
    setLoadState('loading')
    setError(null)
    setSavedMsg(null)
    try {
      const next = await fetchPage()
      setMeta(next)
      setContent(next.page.content as unknown as JsonValue)
      setLoadState('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载内容失败')
      setLoadState('error')
    }
  }, [fetchPage])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    fetchPage(controller.signal)
      .then((next) => {
        if (cancelled) return
        setMeta(next)
        setContent(next.page.content as unknown as JsonValue)
        setLoadState('ready')
      })
      .catch((err) => {
        if (cancelled || controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载内容失败')
        setLoadState('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [fetchPage])

  async function save() {
    setSaving(true)
    setError(null)
    setSavedMsg(null)
    try {
      const res = await fetch('/api/admin/special', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'savePage', slug, pageId, content }),
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

  const typeLabel = meta ? pageTypeMeta(meta.page.type)?.zh ?? meta.page.type : ''

  return (
    <div>
      <div className={styles.editorHead}>
        <div>
          <Link href={`/admin/special/${slug}`} className={styles.backLink}>← 返回专场设置</Link>
          <h1 className={styles.editorTitle}>
            {meta ? `${meta.page.zh || pageId} · ${typeLabel}` : pageId}
          </h1>
        </div>
        <div className={styles.toolbar}>
          <a
            className={styles.btn}
            href={`/special/${slug}/${pageId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看页面
          </a>
          <button type="button" className={styles.btn} onClick={load} disabled={saving || loadState === 'loading'}>
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

      {loadState === 'ready' && <SectionForm value={content} onChange={setContent} />}
    </div>
  )
}
