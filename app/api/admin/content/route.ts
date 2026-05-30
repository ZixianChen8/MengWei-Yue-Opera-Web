import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-guard'
import { getJsonFile, putFile, utf8ToBase64 } from '@/lib/github'
import { DATA_FILES, findSection, type ContentTarget } from '@/lib/content-config'

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
    return NextResponse.json({ error: 'Unknown section' }, { status: 400 })
  }
  try {
    const file = await getJsonFile<DataFile>(DATA_FILES[target as ContentTarget])
    if (!file) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 })
    }
    return NextResponse.json({ data: file.data[section] })
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
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const target = String(body.target ?? '')
  const section = String(body.section ?? '')
  const def = findSection(target, section)
  if (!def) {
    return NextResponse.json({ error: 'Unknown section' }, { status: 400 })
  }
  if (body.data === null || typeof body.data !== 'object') {
    return NextResponse.json({ error: 'Invalid data payload' }, { status: 400 })
  }

  const path = DATA_FILES[target as ContentTarget]
  try {
    const file = await getJsonFile<DataFile>(path)
    if (!file) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 })
    }
    const next = { ...file.data, [section]: body.data }
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
  return err instanceof Error ? err.message : 'Unexpected error'
}
