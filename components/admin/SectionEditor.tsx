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
    if (!res.ok) throw new Error(json.error || 'Failed to load content')
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
      setError(err instanceof Error ? err.message : 'Failed to load content')
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
        setError(err instanceof Error ? err.message : 'Failed to load content')
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
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      setSavedMsg('Saved and committed. The public site will update after the redeploy finishes (~1–2 minutes).')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className={styles.editorHead}>
        <div>
          <Link href="/admin" className={styles.backLink}>
            ← Dashboard
          </Link>
          <h1 className={styles.editorTitle}>{label}</h1>
        </div>
        <div className={styles.toolbar}>
          <button type="button" className={styles.btn} onClick={load} disabled={saving || loadState === 'loading'}>
            Reload
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={save} disabled={saving || loadState !== 'ready'}>
            {saving ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </div>

      {savedMsg && <div className={`${styles.status} ${styles.statusOk}`}>{savedMsg}</div>}
      {error && <div className={`${styles.status} ${styles.statusErr}`}>{error}</div>}

      {loadState === 'loading' && <div className={styles.loading}>Loading current content…</div>}

      {loadState === 'ready' && <SectionForm value={data} onChange={setData} />}
    </div>
  )
}
