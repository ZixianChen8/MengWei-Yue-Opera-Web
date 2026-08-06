// ============================================================
// Event retirement — past flag OR day-after date → retired.
// Retired events leave the home/upcoming grids and fill the
// year-grouped past archive on /events.
// ============================================================

import type { EventStatus, SeasonEvent } from '@/content/home'
import { parseEventDate } from '@/lib/event-date'

export type CalendarDay = { year: number; month: number; day: number }

export function calendarDayFromDate(d: Date = new Date()): CalendarDay {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}

function dayKey(d: CalendarDay): number {
  return d.year * 10_000 + d.month * 100 + d.day
}

/** True when the calendar day is strictly after the event's ISO date. */
export function isPastEventDate(iso: string, today: CalendarDay = calendarDayFromDate()): boolean {
  const parsed = parseEventDate(iso)
  if (!parsed) return false
  return dayKey(today) > dayKey(parsed)
}

export function isRetired(
  event: Pick<SeasonEvent, 'past' | 'date'>,
  today: CalendarDay = calendarDayFromDate(),
): boolean {
  return event.past === true || isPastEventDate(event.date, today)
}

export function effectiveStatus(
  event: Pick<SeasonEvent, 'past' | 'date' | 'status'>,
  today: CalendarDay = calendarDayFromDate(),
): EventStatus {
  return isRetired(event, today) ? 'closed' : event.status
}

export function upcomingEvents(
  events: SeasonEvent[],
  today: CalendarDay = calendarDayFromDate(),
): SeasonEvent[] {
  return events.filter((e) => !isRetired(e, today))
}

export function retiredEvents(
  events: SeasonEvent[],
  today: CalendarDay = calendarDayFromDate(),
): SeasonEvent[] {
  return events.filter((e) => isRetired(e, today))
}

export type PastYearGroup = {
  year: string
  events: SeasonEvent[]
}

/** Group retired events by year of `date`, years descending, within-year newest first. */
export function groupPastByYear(
  events: SeasonEvent[],
  today: CalendarDay = calendarDayFromDate(),
): PastYearGroup[] {
  const past = retiredEvents(events, today)
  const byYear = new Map<number, SeasonEvent[]>()

  for (const ev of past) {
    const parsed = parseEventDate(ev.date)
    const year = parsed?.year ?? 0
    const list = byYear.get(year)
    if (list) list.push(ev)
    else byYear.set(year, [ev])
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({
      year: year === 0 ? '—' : String(year),
      events: list.sort((a, b) => {
        const da = parseEventDate(a.date)
        const db = parseEventDate(b.date)
        if (!da || !db) return 0
        return dayKey(db) - dayKey(da)
      }),
    }))
}
