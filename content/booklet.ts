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
}

const data = bookletData as BookletData

export const anniversary = data.anniversary
export const booklet = data.booklet
