'use client'

import { useRef, useState } from 'react'
import styles from './admin.module.css'

type Props = {
  value: string
  onChange: (next: string) => void
}

// Image field: shows the current image, uploads a replacement
// (committed to the repo), and also allows pasting a URL directly.
export default function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
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
