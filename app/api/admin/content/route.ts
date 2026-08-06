import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-guard'
import { getJsonFile, putFile, utf8ToBase64 } from '@/lib/github'
import { DATA_FILES, findSection, type ContentTarget } from '@/lib/content-config'
import { blankEventsError, findBlankEventIndexes, normalizeSeasonEvents } from '@/lib/event-slug'

export const dynamic = 'force-dynamic'

type DataFile = Record<string, unknown>

// GET ?target=&section= → current value of that section (live from GitHub).
export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target') ?? ''
  const section = searchParams.get('section') ?? ''
  const def = findSection(target, section)
  if (!def) {
    return NextResponse.json({ error: '未知的内容板块' }, { status: 400 })
  }
  try {
    const file = await getJsonFile<DataFile>(DATA_FILES[target as ContentTarget])
    if (!file) {
      return NextResponse.json({ error: '未找到数据文件' }, { status: 404 })
    }
    let data = file.data[section]
    if (target === 'home' && section === 'season' && isSeasonSection(data)) {
      data = { ...data, events: normalizeSeasonEvents(data.events) }
    }
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

// POST { target, section, data } → merge the section and commit.
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { target?: string; section?: string; data?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON 格式无效' }, { status: 400 })
  }

  const target = String(body.target ?? '')
  const section = String(body.section ?? '')
  const def = findSection(target, section)
  if (!def) {
    return NextResponse.json({ error: '未知的内容板块' }, { status: 400 })
  }
  if (body.data === null || typeof body.data !== 'object') {
    return NextResponse.json({ error: '提交的数据无效' }, { status: 400 })
  }

  const path = DATA_FILES[target as ContentTarget]
  try {
    const file = await getJsonFile<DataFile>(path)
    if (!file) {
      return NextResponse.json({ error: '未找到数据文件' }, { status: 404 })
    }
    let sectionData = body.data
    if (target === 'home' && section === 'season' && isSeasonSection(sectionData)) {
      const events = normalizeSeasonEvents(sectionData.events)
      const blank = findBlankEventIndexes(events)
      if (blank.length > 0) {
        return NextResponse.json({ error: blankEventsError(blank) }, { status: 400 })
      }
      sectionData = {
        ...sectionData,
        events,
      }
    }
    const next = { ...file.data, [section]: sectionData }
    const content = JSON.stringify(next, null, 2) + '\n'
    const result = await putFile({
      path,
      contentBase64: utf8ToBase64(content),
      message: `admin: update ${target}/${section}`,
      sha: file.sha,
    })
    return NextResponse.json({ ok: true, commit: result.commitSha })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : '发生未知错误'
}

function isSeasonSection(
  data: unknown,
): data is { events: Parameters<typeof normalizeSeasonEvents>[0]; [key: string]: unknown } {
  return !!data && typeof data === 'object' && Array.isArray((data as { events?: unknown }).events)
}
