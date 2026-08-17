// ============================================================
// Special-event content — typed accessors over editable data.
//
// Values live in ./data/specials.json so the /admin dashboard can
// create and edit anniversary-style hubs (场刊 / 节目单 / 导赏)
// without touching source code.
// ============================================================

import specialsData from './data/specials.json'

export const SPECIAL_TAB_KEYS = ['booklet', 'programme', 'appreciation'] as const
export type SpecialTabKey = (typeof SPECIAL_TAB_KEYS)[number]

export type SpecialPageHead = {
  meta: string
  titleZh: string
  titleEn: string
  tagline: string
}

export type SpecialSubHead = {
  meta: string
  titleZh: string
  titleEn: string
  crumb: string
}

export type SpecialTab = {
  enabled: boolean
  navZh: string
  navEn: string
  menuZh: string
  menuEn: string
}

export type SpecialHub = {
  pageHead: SpecialPageHead
}

// ── Program booklet ─────────────────────────────────────────
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
  pageHead: SpecialSubHead
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

// ── Chinese programme (中文节目单) ───────────────────────────
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
  pageHead: SpecialSubHead
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

// ── Guided appreciation (导赏) ───────────────────────────────
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
  pageHead: SpecialSubHead
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

export type SpecialEvent = {
  slug: string
  showInNav: boolean
  navZh: string
  navEn: string
  hubTab: { zh: string; en: string }
  logo: string
  tabs: Record<SpecialTabKey, SpecialTab>
  hub: SpecialHub
  booklet: Booklet
  programmePage: ProgrammePage
  appreciationPage: AppreciationPage
}

export type SpecialsFile = { items: SpecialEvent[] }

export type SpecialMenuItem = {
  key: SpecialTabKey
  zh: string
  en: string
  href: string
}

export type SpecialPillItem = {
  zh: string
  en: string
  href: string
}

const data = specialsData as SpecialsFile

export const specials: SpecialEvent[] = data.items

export function getSpecial(slug: string): SpecialEvent | undefined {
  return specials.find((item) => item.slug === slug)
}

export function specialHref(slug: string, tab?: SpecialTabKey): string {
  return tab ? `/special/${slug}/${tab}` : `/special/${slug}`
}

export function specialFromPath(pathname: string | null | undefined): SpecialEvent | undefined {
  if (!pathname) return undefined
  const match = pathname.match(/^\/special\/([^/]+)/)
  if (!match) return undefined
  return getSpecial(match[1])
}

export function enabledTabs(special: SpecialEvent): SpecialMenuItem[] {
  return SPECIAL_TAB_KEYS.filter((key) => special.tabs[key].enabled).map((key) => ({
    key,
    zh: special.tabs[key].menuZh,
    en: special.tabs[key].menuEn,
    href: specialHref(special.slug, key),
  }))
}

export function pillNavItems(special: SpecialEvent): SpecialPillItem[] {
  return [
    {
      zh: special.hubTab.zh,
      en: special.hubTab.en,
      href: specialHref(special.slug),
    },
    ...enabledTabs(special).map((tab) => ({
      zh: special.tabs[tab.key].navZh,
      en: special.tabs[tab.key].navEn,
      href: tab.href,
    })),
  ]
}

export function isTabEnabled(special: SpecialEvent, tab: SpecialTabKey): boolean {
  return special.tabs[tab].enabled
}

export function specialStaticParams(): { slug: string }[] {
  return specials.map((item) => ({ slug: item.slug }))
}

export function specialTabStaticParams(tab: SpecialTabKey): { slug: string }[] {
  return specials.filter((item) => item.tabs[tab].enabled).map((item) => ({ slug: item.slug }))
}
