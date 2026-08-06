'use client'

import { useRef, useState } from 'react'
import styles from './admin.module.css'

type Props = {
  value: string
  onChange: (next: string) => void
}

// Keep in sync with MAX_BYTES in app/api/admin/upload/route.ts. Checked
// client-side too so the user gets an instant message instead of the host
// rejecting the oversized body with a non-JSON "Request Entity Too Large".
const MAX_BYTES = 4 * 1024 * 1024
const MAX_MB = Math.round(MAX_BYTES / 1024 / 1024)

// Image field: shows the current image, uploads a replacement
// (committed to the repo), and also allows pasting a URL directly.
export default function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)

    // Reject oversized files before the upload so the user sees a clear
    // message — the host bounces a too-large body with a plain-text 413
    // that would otherwise surface as a JSON parse error.
    if (file.size > MAX_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1)
      setError(`图片大小为 ${mb} MB — 上限 ${MAX_MB} MB。请先压缩或缩小后再上传。`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })

      // Read as text first: error responses from the host/proxy (e.g. a
      // 413 "Request Entity Too Large") are not JSON, so res.json() would
      // throw a cryptic "Unexpected token" before we can report the cause.
      const raw = await res.text()
      let json: { url?: string; error?: string } = {}
      try {
        json = raw ? JSON.parse(raw) : {}
      } catch {
        json = {}
      }

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(`图片过大 — 上限 ${MAX_MB} MB。请先压缩或缩小后再上传。`)
        }
        throw new Error(json.error || `上传失败（${res.status}）`)
      }
      if (!json.url) throw new Error('上传失败 — 未返回图片地址。')
      onChange(json.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const isLocal = value.startsWith('/')

  return (
    <div className={styles.imageUpload}>
      {value ? (
        // Remote placeholder URLs and local uploads both render via plain img
        // to avoid next/image remote-domain config for arbitrary admin URLs.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className={styles.imagePreview} />
      ) : (
        <div className={styles.imagePreviewEmpty}>暂无图片</div>
      )}

      <div className={styles.imageCol}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        <div>
          <button
            type="button"
            className={styles.btn}
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? '上传中…' : '上传图片'}
          </button>
        </div>
        <input
          type="text"
          className={styles.input}
          value={value}
          placeholder="/assets/... 或 https://..."
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles.uploadHint}>
          单张图片不得超过 {MAX_MB} MB，请先压缩后再上传。
          {isLocal
            ? ' 已上传的图片 — 重新部署后（约 1–2 分钟）显示在网站上。'
            : ' 或粘贴图片地址。'}
        </span>
        {error && <span className={styles.statusErr}>{error}</span>}
      </div>
    </div>
  )
}
