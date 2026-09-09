// ============================================================
// Special events (专场) — types + the client-safe event index.
//
// Each special event is one file: content/data/special/<slug>.json,
// created and edited from /admin/special. Because those files are
// created at runtime by the admin, they cannot be imported
// statically; the *index* (content/data/special/index.json) is a
// fixed path, so it can be. The index carries only what client
// components need (nav links, per-event logo). Full event content
// is loaded on the server — see lib/special-events.ts.
// ============================================================

import indexData from './data/special/index.json'

// ── Page-type content shapes ────────────────────────────────
// These were the 10th-anniversary page types; they are now reusable
// templates that any special event can add (see lib/special-templates.ts).

export type BookletLetter = { name: string; role: string; image: string }

export type BookletMember = {
  name: string
  role: string
  image: string
  bio: string[]
  credits: string[]
}

export type BookletAct = {
  titleEn: string
  titleZh: string
  performers: string
  note: string
}

export type BookletRoleGroup = { role: string; names: string }

export type Booklet = {
  pageHead: { meta: string; titleZh: string; titleEn: string; crumb: string }
  cover: {
    posterImage: string
    presents: string
    wordmark: string
    scriptEn: string
    tagline: string
    organizer: string
    venue: string
    date: string
  }
  preface: {
    titleEn: string
    paragraphs: string[]
    signoff: { org: string; date: string }
  }
  letters: { titleEn: string; intro: string; items: BookletLetter[] }
  team: { titleEn: string; members: BookletMember[] }
  programme: {
    titleEn: string
    emcee: string
    emceeLabel: string
    acts: BookletAct[]
  }
  committee: { titleEn: string; groups: BookletRoleGroup[] }
  crew: { titleEn: string; groups: BookletRoleGroup[] }
  closing: {
    organizerTitleEn: string
    organizer: string
    supportingTitleEn: string
    supporting: string[]
  }
}

export type ProgrammeAct = {
  no: string
  category: string
  titleZh: string
  titleEn: string
  performers: string
  performersEn?: string
  note: string
  noteEn?: string
}

export type ProgrammePage = {
  pageHead: { meta: string; titleZh: string; titleEn: string; crumb: string }
  posterImage: string
  presents: string
  wordmark: string
  scriptEn: string
  tagline: string
  venue: string
  date: string
  emceeLabel: string
  emcee: string
  acts: ProgrammeAct[]
}

export type AppreciationSection = { heading: string; body: string[] }

export type AppreciationLyricLine = { role?: string; zh: string; en: string }

export type AppreciationEntry = {
  no: string
  category: string
  titleZh: string
  titleEn: string
  performers: string
  keywords?: string
  lead?: string
  sections: AppreciationSection[]
  /** English guided-appreciation text; when present the entry gets a 中文/EN toggle. */
  sectionsEn?: AppreciationSection[]
  lyrics?: { title?: string; lines: AppreciationLyricLine[] }
}

export type AppreciationPage = {
  pageHead: { meta: string; titleZh: string; titleEn: string; crumb: string }
  posterImage: string
  presents: string
  wordmark: string
  scriptEn: string
  tagline: string
  venue: string
  date: string
  intro: string
  keywordsLabel: string
  lyricsLabel: string
  entries: AppreciationEntry[]
}

// ── Event shape ─────────────────────────────────────────────

/** Which template renders a page. Adding a type is a code change; adding a *page* is not. */
export type SpecialPageType = 'booklet' | 'programme' | 'appreciation'

export type SpecialPageContent = Booklet | ProgrammePage | AppreciationPage

export type SpecialPage = {
  /** URL segment: /special/<slug>/<id>. */
  id: string
  type: SpecialPageType
  zh: string
  en: string
  /** Short English for the bottom pill (Book / Acts / Guide); falls back to `en`. */
  tabEn?: string
  /** Unready pages show "即将上线" on the hub and are hidden from the pill. */
  ready: boolean
  content: SpecialPageContent
}

export type SpecialBrand = {
  logoUrl: string
  logoWidth: number
  logoHeight: number
  logoAlt: string
}

export type SpecialEvent = {
  slug: string
  titleZh: string
  titleEn: string
  /** Unpublished events are not built as pages and never appear in nav. */
  published: boolean
  /** Add a link to this event in the site navigation. */
  inNav: boolean
  seo: { title: string; description: string }
  brand: SpecialBrand
  hub: {
    pageHead: { meta: string; titleZh: string; titleEn: string; tagline: string }
    /** First tab in the bottom pill, pointing back at the hub. */
    hubTab: { zh: string; en: string }
  }
  pages: SpecialPage[]
}

/** The subset of an event mirrored into index.json for client components. */
export type SpecialEventSummary = {
  slug: string
  titleZh: string
  titleEn: string
  published: boolean
  inNav: boolean
  logoUrl: string
  logoWidth: number
  logoHeight: number
  logoAlt: string
}

export const specialIndex = indexData as SpecialEventSummary[]

// ── Href helpers (URLs are derived, never stored) ───────────

export function specialHubHref(slug: string): string {
  return `/special/${slug}`
}

export function specialPageHref(slug: string, pageId: string): string {
  return `/special/${slug}/${pageId}`
}

/** Published events only — used for nav links and for building routes. */
export function publishedSpecialEvents(): SpecialEventSummary[] {
  return specialIndex.filter((event) => event.published)
}

/** Find the event that owns a pathname, so shared chrome can swap its logo. */
export function specialEventForPath(
  pathname: string | null | undefined,
): SpecialEventSummary | undefined {
  if (!pathname?.startsWith('/special/')) return undefined
  const slug = pathname.split('/')[2]
  return specialIndex.find((event) => event.slug === slug)
}

export function summarize(event: SpecialEvent): SpecialEventSummary {
  return {
    slug: event.slug,
    titleZh: event.titleZh,
    titleEn: event.titleEn,
    published: event.published,
    inNav: event.inNav,
    logoUrl: event.brand.logoUrl,
    logoWidth: event.brand.logoWidth,
    logoHeight: event.brand.logoHeight,
    logoAlt: event.brand.logoAlt,
  }
}
