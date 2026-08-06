// Slug helpers for season events. IDs are derived from the event title on save
// so admins never need to edit them manually.

import { migrateEventStatus } from '@/lib/event-status'
type EventLike = {
  id?: string
  titleEn?: string
  titleZh?: string[]
  date?: string
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** First meaningful title segment — English before a subtitle delimiter, else Chinese. */
export function eventTitleSource(titleEn: string, titleZh: string[]): string {
  const en = titleEn.trim()
  if (en) {
    const primary = en.split(/[:：—–-]/)[0]?.trim()
    return primary || en
  }
  return titleZh.join('').trim()
}

/** True when an event has neither a title nor an ISO date — the default "Add" template. */
export function isBlankEvent(event: EventLike): boolean {
  const hasTitle = !!eventTitleSource(event.titleEn ?? '', event.titleZh ?? [])
  const hasDate = !!(event.date?.trim())
  return !hasTitle && !hasDate
}

export function findBlankEventIndexes(events: EventLike[]): number[] {
  return events.flatMap((event, index) => (isBlankEvent(event) ? [index] : []))
}

export function blankEventsError(indexes: number[]): string {
  const nums = indexes.map((i) => i + 1).join('、')
  return `无法保存：活动 ${nums} 缺少标题和日期，请填写或删除后再保存。`
}

export function assertNoBlankEvents(events: EventLike[]): void {
  const blank = findBlankEventIndexes(events)
  if (blank.length > 0) throw new Error(blankEventsError(blank))
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function fallbackId(event: EventLike, index: number): string {
  const date = event.date?.trim() ?? ''
  if (ISO_DATE.test(date)) return date
  return `event-${index + 1}`
}

/** Build a URL-safe id from an event's titles (and date when needed). */
export function eventIdFromTitle(event: EventLike, index: number): string {
  const slug = slugify(eventTitleSource(event.titleEn ?? '', event.titleZh ?? []))
  if (slug) return slug

  const existing = event.id?.trim()
  if (existing) return existing

  return fallbackId(event, index)
}

/** Assign unique ids and drop legacy numbering fields before persisting. */
export function normalizeSeasonEvents<T extends EventLike>(events: T[]): T[] {
  const used = new Set<string>()

  return events.map((event, index) => {
    let id = eventIdFromTitle(event, index)

    let candidate = id
    let suffix = 2
    while (used.has(candidate)) {
      candidate = `${id}-${suffix++}`
    }
    used.add(candidate)

    const { num: _num, listNum: _listNum, ...rest } = event as T & {
      num?: string
      listNum?: string
    }
    return migrateEventStatus({ ...rest, id: candidate }) as unknown as T
  })
}
