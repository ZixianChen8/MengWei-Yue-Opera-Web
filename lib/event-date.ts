// ============================================================
// Event date helpers.
//
// Event dates are stored as a single machine-readable ISO field
// (`YYYY-MM-DD`) — see season.events[].date. The Chinese display
// strings shown on cards and detail pages are derived from it here,
// and the /events month ribbon computes its per-month event counts
// by parsing the same field (components/EventsListing/MonthRibbon).
// ============================================================

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export type ParsedEventDate = { year: number; month: number; day: number }

// Strictly parse an ISO `YYYY-MM-DD` string. Returns null for anything
// that isn't a valid calendar-ish date (month 1-12, day 1-31), so callers
// can fall back gracefully on legacy/free-text values.
export function parseEventDate(iso: string): ParsedEventDate | null {
  const match = ISO_DATE.exec(iso)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  return { year, month, day }
}

// Render an ISO date as the Chinese display string, e.g.
// "2026-04-06" -> "2026年4月6日", or "4月6日" with { withYear: false }.
// Falls back to the raw input if it doesn't parse.
// Four-year window for the /events month ribbon, always anchored to the
// current calendar year (e.g. 2028 → 2028–2031).
export const RIBBON_YEAR_COUNT = 4

export function ribbonYears(startYear: number, count = RIBBON_YEAR_COUNT): string[] {
  return Array.from({ length: count }, (_, i) => String(startYear + i))
}

export function formatEventDateZh(iso: string, opts?: { withYear?: boolean }): string {
  const parsed = parseEventDate(iso)
  if (!parsed) return iso
  const { year, month, day } = parsed
  const withYear = opts?.withYear ?? true
  return `${withYear ? `${year}年` : ''}${month}月${day}日`
}
