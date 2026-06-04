// ============================================================
// Home page content — typed accessors over the editable data.
//
// The actual values live in ./data/home.json so the /admin
// dashboard can edit them without touching source code. This
// module only re-exports that JSON with the project's existing
// TypeScript types, so every importing component and its types
// are unchanged.
// ============================================================

import homeData from './data/home.json'

// ── Shared value types ──────────────────────────────────────
type LabeledField = { zh: string; en: string }

// ── Section types (mirror the previous inline literals) ─────
type Nav = {
  brand: { markPre: string; markAccent: string; markPost: string; seal: string; sub: string }
  links: { zh: string; en: string; href: string }[]
}

type Hero = {
  meta: string
  titleChars: string[]
  titleRedIndex: number
  poem: { zh: string; en: string; stamp: string }
}

type Overture = {
  title: { zh: string[]; en: string }
  quote: { text: string; attr: string }
  body: string[]
  stats: { value: string; label: string }[]
}

export type EventStatus = 'open' | 'free' | 'soon' | 'waitlist' | 'members' | 'closed'

export type SeasonEvent = {
  id: string
  num: string
  tag: string
  titleZh: string[]
  titleEn: string
  blurb: string
  description: string
  date: string
  time: string
  duration: string
  venue: string
  venueAddress: string
  feature: boolean
  statusType: EventStatus
  statusLabel: string
  listNum: string
  venueEn: string
  formUrl: string
  imageUrl: string
  cardImageUrl: string
}

type Season = {
  title: { zh: string; en: string }
  aside: { zh: string; en: string }
  events: SeasonEvent[]
}

type Studio = {
  title: { zh: string; en: string }
  body: string[]
  program: { level: string; en: string; duration: string }[]
  cta: { zh: string; en: string; href: string }
}

// The home filmstrip now draws its cards from the shared gallery photos
// (see content/gallery.ts); only the section heading/hint live here.
type Repertoire = {
  title: { zh: string; en: string }
  hint: string
}

type About = {
  verse: string[]
  verseEn: string
  vertMeta: string
  vertTitle: { before: string; red: string; after: string }
  stamp: string
  mission: string[]
  cta: { zh: string; en: string; href: string }
}

type Footer = {
  ornament: string
  brand: { zh: string; en: string }
  legal: { zh: string; en: string }
  columns: { heading: string; links: { zh: string; en: string; href: string }[] }[]
  copyright: string
  sealLine: string
}

type EventsListingPage = {
  header: { titleZh: string; titleEn: string; quote: { zh: string; en: string } }
  years: string[]
  currentYear: string
  months: { cn: string; en: string; hasEvent: boolean; isCurrent: boolean; pipMuted: boolean }[]
  archive: { year: string; shows: { num: string; cn: string }[] }[]
}

type EventPage = {
  backLink: LabeledField
  signup: LabeledField
  qrLabel: LabeledField
  formLink: LabeledField
  labels: {
    date: LabeledField
    time: LabeledField
    duration: LabeledField
    venue: LabeledField
    address: LabeledField
  }
}

type AboutPage = {
  pageHead: {
    meta: string
    charsZh: { before: string; red: string; after: string }
    subtitle: string
    crumb: string
  }
  bio: {
    vertZh: { before: string; red: string; after: string }
    heading: { zh: string; en: string }
    paragraphs: { zh: string; en: string }[]
  }
  contact: {
    heading: { zh1: string; zh2: string; en: string }
    lede: { zh: string; en: string }
    channels: { zh: string; val: string; sub: string }[]
    form: {
      sealGlyph: string
      intro: string
      subjects: { value: string; label: string }[]
      fields: {
        name: { zh: string; en: string; ph: string }
        email: { zh: string; en: string; ph: string }
        subject: { zh: string; en: string }
        phone: { zh: string; en: string; ph: string }
        message: { zh: string; en: string; ph: string }
      }
      privacy: string
      submit: { zh: string; en: string }
      sending: { zh: string; en: string }
      error: { zh: string; en: string }
      sent: { stamp: string; zh: string; en: string }
    }
  }
}

type HomeContent = {
  nav: Nav
  hero: Hero
  overture: Overture
  season: Season
  studio: Studio
  repertoire: Repertoire
  about: About
  footer: Footer
  eventsListingPage: EventsListingPage
  eventPage: EventPage
  aboutPage: AboutPage
}

const data = homeData as HomeContent

export const nav = data.nav
export const hero = data.hero
export const overture = data.overture
export const season = data.season
export const studio = data.studio
export const repertoire = data.repertoire
export const about = data.about
export const footer = data.footer
export const eventsListingPage = data.eventsListingPage
export const eventPage = data.eventPage
export const aboutPage = data.aboutPage
