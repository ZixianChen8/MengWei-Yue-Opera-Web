import type { SpecialEvent, SpecialsFile, SpecialTabKey } from '@/content/specials'
import { SPECIAL_TAB_KEYS } from '@/content/specials'
import { DATA_FILES } from '@/lib/content-config'
import { getJsonFile, putFile, utf8ToBase64 } from '@/lib/github'

export const SPECIAL_PARTS = ['hub', 'booklet', 'programmePage', 'appreciationPage'] as const
export type SpecialPartKey = (typeof SPECIAL_PARTS)[number]

export type SpecialSummary = {
  slug: string
  navZh: string
  navEn: string
  showInNav: boolean
  tabs: Record<SpecialTabKey, boolean>
}

export function summarizeSpecial(item: SpecialEvent): SpecialSummary {
  return {
    slug: item.slug,
    navZh: item.navZh,
    navEn: item.navEn,
    showInNav: item.showInNav,
    tabs: {
      booklet: item.tabs.booklet.enabled,
      programme: item.tabs.programme.enabled,
      appreciation: item.tabs.appreciation.enabled,
    },
  }
}

export async function loadSpecialsFile(): Promise<{ sha: string; data: SpecialsFile }> {
  const file = await getJsonFile<SpecialsFile>(DATA_FILES.specials)
  if (!file) {
    throw new Error('未找到特别活动数据文件')
  }
  if (!file.data || !Array.isArray(file.data.items)) {
    throw new Error('特别活动数据格式无效')
  }
  return file
}

export async function saveSpecialsFile(
  data: SpecialsFile,
  sha: string,
  message: string,
): Promise<{ commitSha: string }> {
  const content = JSON.stringify(data, null, 2) + '\n'
  return putFile({
    path: DATA_FILES.specials,
    contentBase64: utf8ToBase64(content),
    message,
    sha,
  })
}

export function isSpecialPart(value: string): value is SpecialPartKey {
  return (SPECIAL_PARTS as readonly string[]).includes(value)
}

export function isSpecialTabKey(value: string): value is SpecialTabKey {
  return (SPECIAL_TAB_KEYS as readonly string[]).includes(value)
}
