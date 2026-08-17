import type {
  AppreciationPage,
  Booklet,
  ProgrammePage,
  SpecialEvent,
  SpecialTab,
  SpecialTabKey,
} from '@/content/specials'
import { SPECIAL_TAB_KEYS } from '@/content/specials'

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const DEFAULT_TABS: Record<SpecialTabKey, Omit<SpecialTab, 'enabled'>> = {
  booklet: { navZh: '场刊', navEn: 'Book', menuZh: '场刊', menuEn: 'Program Booklet' },
  programme: { navZh: '节目单', navEn: 'Acts', menuZh: '节目单', menuEn: 'Programme' },
  appreciation: { navZh: '导赏', navEn: 'Guide', menuZh: '导赏', menuEn: 'Guided Appreciation' },
}

function blankBooklet(): Booklet {
  return {
    pageHead: { meta: '', titleZh: '场刊', titleEn: 'Program Book', crumb: '' },
    cover: {
      posterImage: '',
      presents: '',
      wordmark: '场刊',
      scriptEn: 'Program Booklet',
      tagline: '',
      organizer: '',
      venue: '',
      date: '',
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
      supportingTitleEn: 'Supporting Organizations',
      supporting: [],
    },
  }
}

function blankProgramme(): ProgrammePage {
  return {
    pageHead: { meta: '', titleZh: '节目单', titleEn: 'Programme', crumb: '' },
    posterImage: '',
    presents: '',
    wordmark: '节目单',
    scriptEn: 'Programme',
    tagline: '',
    venue: '',
    date: '',
    emceeLabel: '主持',
    emcee: '',
    acts: [],
  }
}

function blankAppreciation(): AppreciationPage {
  return {
    pageHead: { meta: '', titleZh: '导赏', titleEn: 'Guided Appreciation', crumb: '' },
    posterImage: '',
    presents: '',
    wordmark: '导赏',
    scriptEn: 'Guided Appreciation',
    tagline: '',
    venue: '',
    date: '',
    intro: '',
    keywordsLabel: '关键词',
    lyricsLabel: '唱词',
    entries: [],
  }
}

export type SpecialCreateInput = {
  slug: string
  navZh: string
  navEn: string
  showInNav: boolean
  tabs: Record<SpecialTabKey, boolean>
}

export function blankSpecial(input: SpecialCreateInput): SpecialEvent {
  const tabs = Object.fromEntries(
    SPECIAL_TAB_KEYS.map((key) => [
      key,
      { ...DEFAULT_TABS[key], enabled: input.tabs[key] },
    ]),
  ) as SpecialEvent['tabs']

  return {
    slug: input.slug,
    showInNav: input.showInNav,
    navZh: input.navZh,
    navEn: input.navEn,
    hubTab: { zh: '专场', en: 'Gala' },
    logo: '',
    tabs,
    hub: {
      pageHead: {
        meta: '',
        titleZh: input.navZh,
        titleEn: input.navEn,
        tagline: '',
      },
    },
    booklet: blankBooklet(),
    programmePage: blankProgramme(),
    appreciationPage: blankAppreciation(),
  }
}
