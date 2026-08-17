import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-guard'
import { blankSpecial, SLUG_PATTERN, type SpecialCreateInput } from '@/lib/special-template'
import { loadSpecialsFile, saveSpecialsFile, summarizeSpecial } from '@/lib/specials-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const file = await loadSpecialsFile()
    return NextResponse.json({ items: file.data.items.map(summarizeSpecial) })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: Partial<SpecialCreateInput>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON 格式无效' }, { status: 400 })
  }

  const slug = String(body.slug ?? '').trim()
  const navZh = String(body.navZh ?? '').trim()
  const navEn = String(body.navEn ?? '').trim()
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: '网址别名须为小写字母、数字与连字符，例如 spring-gala' }, { status: 400 })
  }
  if (!navZh || !navEn) {
    return NextResponse.json({ error: '请填写中英文导航标题' }, { status: 400 })
  }

  const tabs = {
    booklet: Boolean(body.tabs?.booklet),
    programme: Boolean(body.tabs?.programme),
    appreciation: Boolean(body.tabs?.appreciation),
  }

  try {
    const file = await loadSpecialsFile()
    if (file.data.items.some((item) => item.slug === slug)) {
      return NextResponse.json({ error: '该网址别名已存在' }, { status: 400 })
    }
    const next = {
      items: [
        ...file.data.items,
        blankSpecial({
          slug,
          navZh,
          navEn,
          showInNav: Boolean(body.showInNav),
          tabs,
        }),
      ],
    }
    const result = await saveSpecialsFile(next, file.sha, `admin: create special ${slug}`)
    return NextResponse.json({ ok: true, slug, commit: result.commitSha })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { slugs?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON 格式无效' }, { status: 400 })
  }

  const slugs = Array.isArray(body.slugs) ? body.slugs.map((s) => String(s)) : []
  try {
    const file = await loadSpecialsFile()
    const current = file.data.items.map((item) => item.slug)
    if (slugs.length !== current.length || new Set(slugs).size !== slugs.length) {
      return NextResponse.json({ error: '排序列表与现有特别活动不匹配' }, { status: 400 })
    }
    if (current.some((slug) => !slugs.includes(slug))) {
      return NextResponse.json({ error: '排序列表与现有特别活动不匹配' }, { status: 400 })
    }
    const bySlug = new Map(file.data.items.map((item) => [item.slug, item]))
    const next = { items: slugs.map((slug) => bySlug.get(slug)!).filter(Boolean) }
    const result = await saveSpecialsFile(next, file.sha, 'admin: reorder specials')
    return NextResponse.json({ ok: true, commit: result.commitSha })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : '发生未知错误'
}
