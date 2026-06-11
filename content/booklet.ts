// ============================================================
// 10th-anniversary content — typed accessors over editable data.
//
// Values live in ./data/booklet.json so the /admin dashboard can
// edit them without touching source code. This module re-exports
// that JSON with the project's TypeScript types. Two top-level
// keys live in one file: `anniversary` (the hub page + submenu)
// and `booklet` (the full program book).
// ============================================================

import bookletData from './data/booklet.json'

// ── Anniversary hub ─────────────────────────────────────────
export type AnniversaryMenuItem = {
  zh: string
  en: string
  href: string
  ready: boolean
}

export type Anniversary = {
  pageHead: { meta: string; titleZh: string; titleEn: string; tagline: string }
  menu: AnniversaryMenuItem[]
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
  duration: string
  performers: string
  note: string
}

export type BookletRoleGroup = { role: string; names: string }

// ── Chinese programme (中文节目单) ───────────────────────────
export type ProgrammeAct = {
  no: string
  category: string
  titleZh: string
  titleEn: string
  duration: string
  performers: string
  note: string
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

type BookletData = {
  anniversary: Anniversary
  booklet: Booklet
  programmePage: ProgrammePage
  appreciationPage: AppreciationPage
}

const data = bookletData as BookletData

export const anniversary = data.anniversary
export const booklet = data.booklet
export const programmePage = data.programmePage
export const appreciationPage = data.appreciationPage
