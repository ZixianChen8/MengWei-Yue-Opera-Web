import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-guard'
import { putFile } from '@/lib/github'

export const dynamic = 'force-dynamic'

// Vercel serverless functions cap the request body at ~4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: '需要 multipart 表单数据' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: '未提供文件' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `图片过大（上限 ${Math.round(MAX_BYTES / 1024 / 1024)} MB），请先压缩后再上传。` },
      { status: 413 },
    )
  }
  const ext = EXT_BY_TYPE[file.type]
  if (!ext) {
    return NextResponse.json({ error: `不支持的图片格式：${file.type || '未知'}` }, { status: 415 })
  }

  const base =
    (file.name || 'image')
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image'
  const name = `${base}-${Date.now()}.${ext}`
  const path = `public/assets/uploads/${name}`

  try {
    const bytes = Buffer.from(await file.arrayBuffer())
    await putFile({
      path,
      contentBase64: bytes.toString('base64'),
      message: `admin: upload image ${name}`,
    })
    return NextResponse.json({ ok: true, url: `/assets/uploads/${name}` })
  } catch (err) {
    const message = err instanceof Error ? err.message : '上传失败'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
