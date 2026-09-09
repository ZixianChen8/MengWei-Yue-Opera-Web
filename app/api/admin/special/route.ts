// ============================================================
// Admin API for special events (专场).
//
// One file per event under content/data/special/, plus a derived
// index.json that client chrome (nav links, per-event logo) can
// import statically. Every mutation rewrites the index from the
// actual files, so the index self-heals if a write ever fails
// halfway. Publishing an event with 在导航中显示 also syncs a link
// into home.json's nav.links, so a new event is reachable without
// hand-editing the menu.
// ============================================================

import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-guard'
import { deleteFile, getJsonFile, listDir, putFile, utf8ToBase64 } from '@/lib/github'
import { DATA_FILES } from '@/lib/content-config'
import {
  SPECIAL_DIR,
  SPECIAL_INDEX_PATH,
  isValidPageId,
  isValidSlug,
  specialEventFilePath,
} from '@/lib/special-paths'
import { blankEvent, blankPage, isPageType } from '@/lib/special-templates'
import { summarize, type SpecialEvent, type SpecialPage } from '@/content/special'

export const dynamic = 'force-dynamic'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : '发生未知错误'
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// ── Reads ───────────────────────────────────────────────────

async function readEvent(slug: string): Promise<{ sha: string; data: SpecialEvent } | null> {
  return getJsonFile<SpecialEvent>(specialEventFilePath(slug))
}

async function listSlugs(): Promise<string[]> {
  const entries = await listDir(SPECIAL_DIR)
  return entries
    .filter((entry) => entry.type === 'file' && entry.name.endsWith('.json'))
    .map((entry) => entry.name.slice(0, -'.json'.length))
    .filter(isValidSlug)
    .sort()
}

async function readAllEvents(): Promise<SpecialEvent[]> {
  const slugs = await listSlugs()
  const files = await Promise.all(slugs.map(readEvent))
  return files.filter((file): file is { sha: string; data: SpecialEvent } => !!file).map((f) => f.data)
}

// ── Derived writes ──────────────────────────────────────────

/** `sha` is the blob the edit was based on; omit it only when creating. */
async function writeEvent(event: SpecialEvent, message: string, sha?: string): Promise<void> {
  await putFile({
    path: specialEventFilePath(event.slug),
    contentBase64: utf8ToBase64(JSON.stringify(event, null, 2) + '\n'),
    message,
    sha,
  })
}

/** Rebuild index.json from the event files so clients see current nav/logo data. */
async function rebuildIndex(): Promise<void> {
  const events = await readAllEvents()
  const index = events.map(summarize)
  const existing = await getJsonFile(SPECIAL_INDEX_PATH)
  await putFile({
    path: SPECIAL_INDEX_PATH,
    contentBase64: utf8ToBase64(JSON.stringify(index, null, 2) + '\n'),
    message: 'admin: rebuild special event index',
    sha: existing?.sha,
  })
}

type NavLink = { zh: string; en: string; href: string }
type HomeData = { nav?: { links?: NavLink[] }; [key: string]: unknown }

/**
 * Keep one nav link per event in sync. New links are inserted before the last
 * menu item so the trailing 关于我们 entry stays last.
 */
async function syncNavLink(event: SpecialEvent | null, slug: string): Promise<void> {
  const path = DATA_FILES.home
  const file = await getJsonFile<HomeData>(path)
  if (!file?.data?.nav?.links) return

  const href = `/special/${slug}`
  const links = file.data.nav.links
  const at = links.findIndex((link) => link.href === href)
  const wanted = !!event && event.published && event.inNav

  let next: NavLink[]
  if (!wanted) {
    if (at < 0) return
    next = links.filter((_, i) => i !== at)
  } else {
    const entry: NavLink = { zh: event.titleZh, en: event.titleEn, href }
    if (at >= 0) {
      if (links[at].zh === entry.zh && links[at].en === entry.en) return
      next = links.map((link, i) => (i === at ? entry : link))
    } else {
      next = [...links.slice(0, Math.max(links.length - 1, 0)), entry, ...links.slice(Math.max(links.length - 1, 0))]
    }
  }

  const data = { ...file.data, nav: { ...file.data.nav, links: next } }
  await putFile({
    path,
    contentBase64: utf8ToBase64(JSON.stringify(data, null, 2) + '\n'),
    message: `admin: sync nav link for special/${slug}`,
    sha: file.sha,
  })
}

/** Run after every mutation so index + nav always match the event files. */
async function afterMutation(event: SpecialEvent | null, slug: string): Promise<void> {
  await rebuildIndex()
  await syncNavLink(event, slug)
}

// ── GET: list all events, or one full event with ?slug= ─────

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return json({ error: 'unauthorized' }, 401)
  }

  const slug = new URL(request.url).searchParams.get('slug')
  try {
    if (!slug) {
      const events = await readAllEvents()
      return json({
        events: events.map((event) => ({
          ...summarize(event),
          pages: event.pages.map((page) => ({
            id: page.id,
            type: page.type,
            zh: page.zh,
            ready: page.ready,
          })),
        })),
      })
    }

    if (!isValidSlug(slug)) return json({ error: '网址名称无效' }, 400)
    const file = await readEvent(slug)
    if (!file) return json({ error: '未找到该专场' }, 404)
    return json({ event: file.data })
  } catch (err) {
    return json({ error: errorMessage(err) }, 502)
  }
}

// ── POST: create / save / delete ────────────────────────────

type Body = {
  action?: string
  slug?: string
  titleZh?: string
  titleEn?: string
  settings?: Partial<SpecialEvent>
  pages?: { id: string; zh: string; en: string; tabEn?: string; ready: boolean }[]
  pageId?: string
  type?: string
  content?: unknown
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return json({ error: 'unauthorized' }, 401)
  }

  let body: Body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'JSON 格式无效' }, 400)
  }

  const slug = String(body.slug ?? '')
  if (!isValidSlug(slug)) {
    return json({ error: '网址名称无效：只能使用小写字母、数字与短横线。' }, 400)
  }

  try {
    switch (body.action) {
      case 'create':
        return await handleCreate(slug, body)
      case 'saveEvent':
        return await handleSaveEvent(slug, body)
      case 'addPage':
        return await handleAddPage(slug, body)
      case 'deletePage':
        return await handleDeletePage(slug, body)
      case 'savePage':
        return await handleSavePage(slug, body)
      case 'deleteEvent':
        return await handleDeleteEvent(slug)
      default:
        return json({ error: '未知操作' }, 400)
    }
  } catch (err) {
    return json({ error: errorMessage(err) }, 502)
  }
}

async function handleCreate(slug: string, body: Body) {
  const titleZh = String(body.titleZh ?? '').trim()
  const titleEn = String(body.titleEn ?? '').trim()
  if (!titleZh && !titleEn) {
    return json({ error: '请填写专场名称（中文或英文）。' }, 400)
  }
  if (await readEvent(slug)) {
    return json({ error: `网址名称 ${slug} 已被占用，请换一个。` }, 409)
  }

  const event = blankEvent(slug, titleZh, titleEn)
  await writeEvent(event, `admin: create special event ${slug}`)
  await afterMutation(event, slug)
  return json({ ok: true, slug })
}

async function handleSaveEvent(slug: string, body: Body) {
  const file = await readEvent(slug)
  if (!file) return json({ error: '未找到该专场' }, 404)
  const current = file.data
  const settings = body.settings ?? {}

  // Page *content* never round-trips through the settings form; only order and
  // labels are editable there, so content is carried over by id.
  const byId = new Map(current.pages.map((page) => [page.id, page]))
  let pages: SpecialPage[] = current.pages
  if (Array.isArray(body.pages)) {
    const next: SpecialPage[] = []
    for (const meta of body.pages) {
      const existing = byId.get(meta.id)
      if (!existing) return json({ error: `未知的页面：${meta.id}` }, 400)
      next.push({
        ...existing,
        zh: meta.zh,
        en: meta.en,
        tabEn: meta.tabEn ?? '',
        ready: !!meta.ready,
      })
    }
    pages = next
  }

  const event: SpecialEvent = {
    ...current,
    titleZh: settings.titleZh ?? current.titleZh,
    titleEn: settings.titleEn ?? current.titleEn,
    published: settings.published ?? current.published,
    inNav: settings.inNav ?? current.inNav,
    seo: settings.seo ?? current.seo,
    brand: settings.brand ?? current.brand,
    hub: settings.hub ?? current.hub,
    slug,
    pages,
  }

  await writeEvent(event, `admin: update special event ${slug}`, file.sha)
  await afterMutation(event, slug)
  return json({ ok: true })
}

async function handleAddPage(slug: string, body: Body) {
  const file = await readEvent(slug)
  if (!file) return json({ error: '未找到该专场' }, 404)
  const type = body.type
  if (!isPageType(type)) return json({ error: '未知的页面类型' }, 400)

  const pageId = String(body.pageId ?? type).trim()
  if (!isValidPageId(pageId)) {
    return json({ error: '页面网址无效：只能使用小写字母、数字与短横线。' }, 400)
  }
  if (file.data.pages.some((page) => page.id === pageId)) {
    return json({ error: `页面网址 ${pageId} 已存在。` }, 409)
  }

  const event: SpecialEvent = {
    ...file.data,
    pages: [...file.data.pages, blankPage(type, pageId, file.data)],
  }
  await writeEvent(event, `admin: add ${type} page to special/${slug}`, file.sha)
  await afterMutation(event, slug)
  return json({ ok: true, pageId })
}

async function handleDeletePage(slug: string, body: Body) {
  const file = await readEvent(slug)
  if (!file) return json({ error: '未找到该专场' }, 404)
  const pageId = String(body.pageId ?? '')
  if (!file.data.pages.some((page) => page.id === pageId)) {
    return json({ error: '未找到该页面' }, 404)
  }

  const event: SpecialEvent = {
    ...file.data,
    pages: file.data.pages.filter((page) => page.id !== pageId),
  }
  await writeEvent(event, `admin: remove page ${pageId} from special/${slug}`, file.sha)
  await afterMutation(event, slug)
  return json({ ok: true })
}

async function handleSavePage(slug: string, body: Body) {
  const file = await readEvent(slug)
  if (!file) return json({ error: '未找到该专场' }, 404)
  const pageId = String(body.pageId ?? '')
  if (!file.data.pages.some((page) => page.id === pageId)) {
    return json({ error: '未找到该页面' }, 404)
  }
  if (body.content === null || typeof body.content !== 'object') {
    return json({ error: '提交的数据无效' }, 400)
  }

  const event: SpecialEvent = {
    ...file.data,
    pages: file.data.pages.map((page) =>
      page.id === pageId
        ? ({ ...page, content: body.content } as SpecialPage)
        : page,
    ),
  }
  // No afterMutation: page content feeds neither the index nor the nav links,
  // so skipping it keeps a content save to a single commit.
  await writeEvent(event, `admin: update special/${slug}/${pageId}`, file.sha)
  return json({ ok: true })
}

async function handleDeleteEvent(slug: string) {
  if (!(await readEvent(slug))) return json({ error: '未找到该专场' }, 404)
  await deleteFile({
    path: specialEventFilePath(slug),
    message: `admin: delete special event ${slug}`,
  })
  await afterMutation(null, slug)
  return json({ ok: true })
}
