// ============================================================
// Page-type templates for special events (专场).
//
// Adding a *page* to an event is a content operation: the admin
// picks a type here and gets an empty, correctly-shaped content
// object. Adding a new *type* is a code change (new template +
// a case in app/special/[slug]/[page]/page.tsx).
//
// Pure data — safe to import from client components.
// ============================================================

import type {
  AppreciationPage,
  Booklet,
  ProgrammePage,
  SpecialEvent,
  SpecialPage,
  SpecialPageContent,
  SpecialPageType,
} from '@/content/special'

export type PageTypeMeta = {
  type: SpecialPageType
  /** Default tab labels when the operator adds this page. */
  zh: string
  en: string
  tabEn: string
  blurb: string
}

export const PAGE_TYPES: PageTypeMeta[] = [
  {
    type: 'booklet',
    zh: '场刊',
    en: 'Program Booklet',
    tabEn: 'Book',
    blurb: '完整节目册：封面、序言、贺信、演职人员、节目表、组委会与鸣谢。',
  },
  {
    type: 'programme',
    zh: '节目单',
    en: 'Programme',
    tabEn: 'Acts',
    blurb: '演出当天的节目顺序：每个节目的类别、中英文名、演员与备注。',
  },
  {
    type: 'appreciation',
    zh: '导赏',
    en: 'Guided Appreciation',
    tabEn: 'Guide',
    blurb: '每折戏的赏析文章：看点关键词、导语、分段正文，可选英文与唱词。',
  },
]

export function pageTypeMeta(type: string): PageTypeMeta | undefined {
  return PAGE_TYPES.find((meta) => meta.type === type)
}

export function isPageType(value: unknown): value is SpecialPageType {
  return typeof value === 'string' && PAGE_TYPES.some((meta) => meta.type === value)
}

// Shared masthead defaults so a new page looks like the others.
function blankMasthead(event?: { titleZh?: string }) {
  return {
    posterImage: '',
    presents: '加拿大孟伟越剧艺术传习所 呈献',
    wordmark: '',
    scriptEn: '',
    tagline: event?.titleZh ?? '',
    venue: '',
    date: '',
  }
}

function blankBooklet(event?: { titleZh?: string; titleEn?: string }): Booklet {
  return {
    pageHead: { meta: '', titleZh: '场刊', titleEn: 'Program Book', crumb: event?.titleEn ?? '' },
    cover: {
      ...blankMasthead(event),
      wordmark: '场刊',
      scriptEn: 'Program Booklet',
      organizer: '加拿大孟伟越剧艺术传习所 · Meng Wei Yue Opera Studio',
    },
    preface: { titleEn: 'Preface', paragraphs: [''], signoff: { org: '', date: '' } },
    letters: { titleEn: 'Greetings', intro: '', items: [] },
    team: { titleEn: 'Producer & Director', members: [] },
    programme: { titleEn: 'Programme', emcee: '', emceeLabel: '主持', acts: [] },
    committee: { titleEn: 'Organizing Committee', groups: [] },
    crew: { titleEn: 'Production Crew', groups: [] },
    closing: {
      organizerTitleEn: 'Organizer',
      organizer: '',
      supportingTitleEn: 'In Partnership With',
      supporting: [],
    },
  }
}

function blankProgramme(event?: { titleZh?: string; titleEn?: string }): ProgrammePage {
  return {
    pageHead: { meta: '', titleZh: '节目单', titleEn: 'Programme', crumb: event?.titleZh ?? '' },
    ...blankMasthead(event),
    wordmark: '节目单',
    scriptEn: 'Programme',
    emceeLabel: '主持',
    emcee: '',
    acts: [],
  }
}

function blankAppreciation(event?: { titleZh?: string; titleEn?: string }): AppreciationPage {
  return {
    pageHead: { meta: '', titleZh: '导赏', titleEn: 'Guided Appreciation', crumb: event?.titleZh ?? '' },
    ...blankMasthead(event),
    wordmark: '导赏',
    scriptEn: 'Guided Appreciation',
    intro: '',
    keywordsLabel: '看点关键词',
    lyricsLabel: '唱词 · Libretto',
    entries: [],
  }
}

export function blankPageContent(
  type: SpecialPageType,
  event?: { titleZh?: string; titleEn?: string },
): SpecialPageContent {
  switch (type) {
    case 'booklet':
      return blankBooklet(event)
    case 'programme':
      return blankProgramme(event)
    case 'appreciation':
      return blankAppreciation(event)
  }
}

/** A single act/entry row, used by the admin "add" button on those lists. */
export const BLANK_PROGRAMME_ACT = {
  no: '',
  category: '',
  titleZh: '',
  titleEn: '',
  performers: '',
  performersEn: '',
  note: '',
  noteEn: '',
}

export const BLANK_APPRECIATION_ENTRY = {
  no: '',
  category: '',
  titleZh: '',
  titleEn: '',
  performers: '',
  keywords: '',
  lead: '',
  sections: [{ heading: '', body: [''] }],
}

export function blankPage(
  type: SpecialPageType,
  id: string,
  event?: { titleZh?: string; titleEn?: string },
): SpecialPage {
  const meta = pageTypeMeta(type)
  return {
    id,
    type,
    zh: meta?.zh ?? id,
    en: meta?.en ?? id,
    tabEn: meta?.tabEn ?? '',
    ready: false,
    content: blankPageContent(type, event),
  }
}

export function blankEvent(slug: string, titleZh: string, titleEn: string): SpecialEvent {
  return {
    slug,
    titleZh,
    titleEn,
    published: false,
    inNav: false,
    seo: {
      title: [titleZh, titleEn].filter(Boolean).join(' · ') + ' — 孟伟越剧',
      description: '',
    },
    brand: { logoUrl: '', logoWidth: 0, logoHeight: 0, logoAlt: titleEn || titleZh },
    hub: {
      pageHead: { meta: '', titleZh, titleEn, tagline: '' },
      hubTab: { zh: '专场', en: 'Gala' },
    },
    pages: [],
  }
}
