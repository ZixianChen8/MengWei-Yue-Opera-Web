import { NextResponse } from 'next/server'
import type { SpecialEvent, SpecialTab } from '@/content/specials'
import { SPECIAL_TAB_KEYS } from '@/content/specials'
import { isAdmin } from '@/lib/admin-guard'
import {
  isSpecialPart,
  loadSpecialsFile,
  saveSpecialsFile,
  type SpecialPartKey,
} from '@/lib/specials-store'

export const dynamic = 'force-dynamic'

type SettingsPatch = {
  showInNav?: boolean
  navZh?: string
  navEn?: string
  hubTab?: { zh?: string; en?: string }
  logo?: string
  tabs?: Partial<Record<(typeof SPECIAL_TAB_KEYS)[number], Partial<SpecialTab>>>
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { slug } = await context.params
  try {
    const file = await loadSpecialsFile()
    const item = file.data.items.find((entry) => entry.slug === slug)
    if (!item) {
      return NextResponse.json({ error: '未找到该特别活动' }, { status: 404 })
    }
    return NextResponse.json({ item })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { slug } = await context.params

  let body: { settings?: SettingsPatch; part?: string; data?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON 格式无效' }, { status: 400 })
  }

  try {
    const file = await loadSpecialsFile()
    const index = file.data.items.findIndex((entry) => entry.slug === slug)
    if (index < 0) {
      return NextResponse.json({ error: '未找到该特别活动' }, { status: 404 })
    }

    let nextItem = file.data.items[index]
    let message = `admin: update special ${slug}`

    if (body.settings) {
      nextItem = applySettings(nextItem, body.settings)
      message = `admin: update special ${slug} settings`
    } else if (body.part) {
      if (!isSpecialPart(body.part)) {
        return NextResponse.json({ error: '未知的内容板块' }, { status: 400 })
      }
      if (body.data === null || typeof body.data !== 'object') {
        return NextResponse.json({ error: '提交的数据无效' }, { status: 400 })
      }
      nextItem = applyPart(nextItem, body.part, body.data)
      message = `admin: update special ${slug}/${body.part}`
    } else {
      return NextResponse.json({ error: '请提供 settings 或 part' }, { status: 400 })
    }

    const items = file.data.items.slice()
    items[index] = nextItem
    const result = await saveSpecialsFile({ items }, file.sha, message)
    return NextResponse.json({ ok: true, commit: result.commitSha })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { slug } = await context.params
  try {
    const file = await loadSpecialsFile()
    if (!file.data.items.some((entry) => entry.slug === slug)) {
      return NextResponse.json({ error: '未找到该特别活动' }, { status: 404 })
    }
    const next = { items: file.data.items.filter((entry) => entry.slug !== slug) }
    const result = await saveSpecialsFile(next, file.sha, `admin: delete special ${slug}`)
    return NextResponse.json({ ok: true, commit: result.commitSha })
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 502 })
  }
}

function applySettings(item: SpecialEvent, settings: SettingsPatch): SpecialEvent {
  const next: SpecialEvent = { ...item }
  if (typeof settings.showInNav === 'boolean') next.showInNav = settings.showInNav
  if (typeof settings.navZh === 'string') next.navZh = settings.navZh.trim()
  if (typeof settings.navEn === 'string') next.navEn = settings.navEn.trim()
  if (typeof settings.logo === 'string') next.logo = settings.logo
  if (settings.hubTab) {
    next.hubTab = {
      zh: typeof settings.hubTab.zh === 'string' ? settings.hubTab.zh : item.hubTab.zh,
      en: typeof settings.hubTab.en === 'string' ? settings.hubTab.en : item.hubTab.en,
    }
  }
  if (settings.tabs) {
    next.tabs = { ...item.tabs }
    for (const key of SPECIAL_TAB_KEYS) {
      const patch = settings.tabs[key]
      if (!patch) continue
      next.tabs[key] = {
        ...item.tabs[key],
        ...patch,
        enabled: typeof patch.enabled === 'boolean' ? patch.enabled : item.tabs[key].enabled,
      }
    }
  }
  return next
}

function applyPart(item: SpecialEvent, part: SpecialPartKey, data: unknown): SpecialEvent {
  return { ...item, [part]: data } as SpecialEvent
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : '发生未知错误'
}
