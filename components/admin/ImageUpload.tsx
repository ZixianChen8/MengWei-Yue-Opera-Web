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
      setError(`Image is ${mb} MB — max ${MAX_MB} MB. Please resize or compress it first.`)
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
          throw new Error(`Image too large — max ${MAX_MB} MB. Please resize or compress it first.`)
        }
        throw new Error(json.error || `Upload failed (${res.status})`)
      }
      if (!json.url) throw new Error('Upload failed — no URL returned.')
      onChange(json.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
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
        <div className={styles.imagePreviewEmpty}>no image</div>
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
            {uploading ? 'Uploading…' : 'Upload image'}
          </button>
        </div>
        <input
          type="text"
          className={styles.input}
          value={value}
          placeholder="/assets/... or https://..."
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles.uploadHint}>
          {isLocal
            ? 'Uploaded image — appears on the site after the redeploy (~1–2 min).'
            : 'Or paste an image URL.'}
        </span>
        {error && <span className={styles.statusErr}>{error}</span>}
      </div>
    </div>
  )
}
