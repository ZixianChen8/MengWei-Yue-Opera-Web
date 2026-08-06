// ============================================================
// Event status — single `status` field maps to badge label + style.
// ============================================================

import type { EventStatus } from '@/content/home'

export type StatusStyle = 'red' | 'gold' | 'gray'

export type StatusMeta = {
  label: string
  style: StatusStyle
}

export const EVENT_STATUS_META: Record<EventStatus, StatusMeta> = {
  open: { label: '票务开放', style: 'red' },
  free: { label: '免费入场', style: 'red' },
  soon: { label: '即将开票', style: 'gold' },
  waitlist: { label: '候补名单', style: 'gold' },
  members: { label: '会员优先', style: 'gray' },
  closed: { label: '已截止', style: 'gray' },
}

export const EVENT_STATUS_VALUES = Object.keys(EVENT_STATUS_META) as EventStatus[]

export function statusLabel(status: EventStatus): string {
  return EVENT_STATUS_META[status].label
}

export function statusStyle(status: EventStatus): StatusStyle {
  return EVENT_STATUS_META[status].style
}

const STATUS_SET = new Set<string>(EVENT_STATUS_VALUES)

function isEventStatus(value: unknown): value is EventStatus {
  return typeof value === 'string' && STATUS_SET.has(value)
}

/** Drop legacy `statusType` / `statusLabel`; keep a single `status` enum. */
export function migrateEventStatus<T extends Record<string, unknown>>(event: T): Omit<T, 'statusType' | 'statusLabel'> & { status: EventStatus } {
  const { statusType, statusLabel: _statusLabel, status, ...rest } = event as T & {
    statusType?: unknown
    statusLabel?: unknown
    status?: unknown
  }

  const resolved = isEventStatus(status)
    ? status
    : isEventStatus(statusType)
      ? statusType
      : 'closed'

  return { ...rest, status: resolved } as Omit<T, 'statusType' | 'statusLabel'> & { status: EventStatus }
}
