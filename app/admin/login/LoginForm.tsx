'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './login.module.css'

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '登录失败')
      const from = params.get('from')
      router.replace(from && from.startsWith('/admin') ? from : '/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
      setBusy(false)
    }
  }

  return (
    <form className={styles.card} onSubmit={submit}>
      <div className={styles.mark}>
        孟<b>伟</b>越剧
      </div>
      <div className={styles.sub}>管理后台</div>

      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.label} htmlFor="admin-password">
        密码
      </label>
      <input
        id="admin-password"
        className={styles.input}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <button type="submit" className={styles.button} disabled={busy || password.length === 0}>
        {busy ? '登录中…' : '登录'}
      </button>
    </form>
  )
}
