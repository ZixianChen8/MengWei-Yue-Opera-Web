'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import SectionForm, { type JsonValue } from './SectionForm'
import styles from './admin.module.css'

type Props = {
  target: string
  section: string
  label: string
}

type LoadState = 'loading' | 'ready' | 'error'

export default function SectionEditor({ target, section, label }: Props) {
  const [data, setData] = useState<JsonValue>(null)
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const fetchContent = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch(
      `/api/admin/content?target=${encodeURIComponent(target)}&section=${encodeURIComponent(section)}`,
      { cache: 'no-store', signal },
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '加载内容失败')
    return json.data as JsonValue
  }, [target, section])

  const load = useCallback(async () => {
    setLoadState('loading')
    setError(null)
    setSavedMsg(null)
    try {
      setData(await fetchContent())
      setLoadState('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载内容失败')
      setLoadState('error')
    }
  }, [fetchContent])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    fetchContent(controller.signal)
      .then(nextData => {
        if (cancelled) return
        setData(nextData)
        setLoadState('ready')
      })
      .catch(err => {
        if (cancelled || controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载内容失败')
        setLoadState('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [fetchContent])

  async function save() {
    setSaving(true)
    setError(null)
    setSavedMsg(null)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, section, data }),
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
          <Link href="/admin" className={styles.backLink}>
            ← 返回面板
          </Link>
          <h1 className={styles.editorTitle}>{label}</h1>
        </div>
        <div className={styles.toolbar}>
          <button type="button" className={styles.btn} onClick={load} disabled={saving || loadState === 'loading'}>
            重新加载
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={save} disabled={saving || loadState !== 'ready'}>
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
