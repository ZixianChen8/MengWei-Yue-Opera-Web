'use client'

import { useState, type ReactNode } from 'react'
import ImageUpload from './ImageUpload'
import { EVENT_STATUS_META, EVENT_STATUS_VALUES } from '@/lib/event-status'
import type { JsonValue } from './SectionForm'
import styles from './admin.module.css'

const HOME_MAX = 3

const BLANK_EVENT: { [key: string]: JsonValue } = {
  tag: '演出',
  titleZh: [''],
  titleEn: '',
  blurb: '',
  description: '',
  date: '',
  time: '',
  duration: '',
  venue: '',
  venueAddress: '',
  home: false,
  past: false,
  status: 'soon',
  venueEn: '',
  formUrl: '',
  imageUrl: '',
  cardImageUrl: '',
}

type RecordValue = { [key: string]: JsonValue }

function isRecord(value: JsonValue | undefined): value is RecordValue {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function asText(value: JsonValue | undefined): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.filter((part): part is string => typeof part === 'string').join('')
  }
  return ''
}

function asBool(value: JsonValue | undefined): boolean {
  return value === true
}

function nestedText(parent: JsonValue | undefined, key: string): string {
  if (!isRecord(parent)) return ''
  return asText(parent[key])
}

function eventTitle(event: RecordValue): string {
  return asText(event.titleZh) || asText(event.titleEn) || '未命名活动'
}

function Field({
  label,
  wide,
  children,
}: {
  label: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <div className={wide ? `${styles.field} ${styles.eventSpan}` : styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

type Props = {
  value: RecordValue
  onChange: (next: RecordValue) => void
}

export default function EventsForm({ value, onChange }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const [warn, setWarn] = useState<string | null>(null)

  const events = Array.isArray(value.events) ? value.events : []
  const title = isRecord(value.title) ? value.title : {}
  const aside = isRecord(value.aside) ? value.aside : {}

  const setEvents = (next: JsonValue[]) => onChange({ ...value, events: next })

  const patchSeasonText = (path: 'eyebrow' | 'title' | 'aside', key: string | null, next: string) => {
    if (path === 'eyebrow') {
      onChange({ ...value, eyebrow: next })
      return
    }
    const current = isRecord(value[path]) ? value[path] : {}
    onChange({ ...value, [path]: { ...current, [key!]: next } })
  }

  const patchEvent = (index: number, patch: RecordValue) => {
    const current = isRecord(events[index]) ? events[index] : {}
    if (patch.home === true && !asBool(current.home)) {
      const count = events.filter((item) => isRecord(item) && asBool(item.home)).length
      if (count >= HOME_MAX) {
        setWarn(`首页最多显示 ${HOME_MAX} 个活动，请先取消勾选其他活动。`)
        return
      }
    }
    setWarn(null)
    const copy = events.slice()
    copy[index] = { ...current, ...patch }
    setEvents(copy)
  }

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= events.length) return
    const copy = events.slice()
    ;[copy[index], copy[next]] = [copy[next], copy[index]]
    setEvents(copy)
    if (open === index) setOpen(next)
    else if (open === next) setOpen(index)
  }

  const remove = (index: number) => {
    setEvents(events.filter((_, i) => i !== index))
    if (open === index) setOpen(null)
    else if (open !== null && open > index) setOpen(open - 1)
  }

  const add = () => {
    setEvents([...events, { ...BLANK_EVENT }])
    setOpen(events.length)
  }

  return (
    <div>
      <details className={styles.pageCopy}>
        <summary>首页板块文字</summary>
        <div className={styles.eventForm}>
          <Field label="眉标" wide>
            <input
              className={styles.input}
              type="text"
              value={asText(value.eyebrow)}
              onChange={(e) => patchSeasonText('eyebrow', null, e.target.value)}
            />
          </Field>
          <Field label="标题（中文）">
            <input
              className={styles.input}
              type="text"
              value={nestedText(title, 'zh')}
              onChange={(e) => patchSeasonText('title', 'zh', e.target.value)}
            />
          </Field>
          <Field label="标题（英文）">
            <input
              className={styles.input}
              type="text"
              value={nestedText(title, 'en')}
              onChange={(e) => patchSeasonText('title', 'en', e.target.value)}
            />
          </Field>
          <Field label="旁注（中文）">
            <input
              className={styles.input}
              type="text"
              value={nestedText(aside, 'zh')}
              onChange={(e) => patchSeasonText('aside', 'zh', e.target.value)}
            />
          </Field>
          <Field label="旁注（英文）">
            <input
              className={styles.input}
              type="text"
              value={nestedText(aside, 'en')}
              onChange={(e) => patchSeasonText('aside', 'en', e.target.value)}
            />
          </Field>
        </div>
      </details>

      <p className={styles.arrayEmpty}>
        点开一条即可编辑。最多 3 个活动可勾选「首页展示」。
      </p>
      {warn && <div className={`${styles.status} ${styles.statusErr}`}>{warn}</div>}

      {events.length === 0 && <div className={styles.arrayEmpty}>暂无活动。</div>}

      <div className={styles.eventList}>
        {events.map((item, index) => {
          const event = isRecord(item) ? item : {}
          const isOpen = open === index
          const date = asText(event.date)
          const tag = asText(event.tag)
          const home = asBool(event.home)
          const past = asBool(event.past)

          return (
            <div key={index} className={isOpen ? `${styles.eventRow} ${styles.eventRowOpen}` : styles.eventRow}>
              <div className={styles.eventHead}>
                <button
                  type="button"
                  className={styles.eventSummary}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className={styles.eventName}>{eventTitle(event)}</span>
                  <span className={styles.eventMeta}>
                    {date && <span>{date}</span>}
                    {tag && <span>{tag}</span>}
                    {home && <span className={styles.eventChipOn}>首页</span>}
                    {past && <span>往迹</span>}
                  </span>
                </button>
                <div className={styles.arrayControls}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="上移"
                  >
                    ^
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => move(index, 1)}
                    disabled={index === events.length - 1}
                    aria-label="下移"
                  >
                    v
                  </button>
                  <button type="button" className={styles.iconBtn} onClick={() => remove(index)} aria-label="删除">
                    x
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className={styles.eventForm}>
                  <Field label="中文标题">
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.titleZh)}
                      onChange={(e) => patchEvent(index, { titleZh: [e.target.value] })}
                    />
                  </Field>
                  <Field label="英文标题">
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.titleEn)}
                      onChange={(e) => patchEvent(index, { titleEn: e.target.value })}
                    />
                  </Field>
                  <Field label="类别">
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.tag)}
                      onChange={(e) => patchEvent(index, { tag: e.target.value })}
                    />
                  </Field>
                  <Field label="状态">
                    <select
                      className={styles.select}
                      value={asText(event.status) || 'soon'}
                      onChange={(e) => patchEvent(index, { status: e.target.value })}
                    >
                      {EVENT_STATUS_VALUES.map((opt) => (
                        <option key={opt} value={opt}>
                          {EVENT_STATUS_META[opt].label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="简介" wide>
                    <textarea
                      className={styles.textarea}
                      value={asText(event.blurb)}
                      onChange={(e) => patchEvent(index, { blurb: e.target.value })}
                    />
                  </Field>
                  <Field label="详细介绍" wide>
                    <textarea
                      className={styles.textarea}
                      value={asText(event.description)}
                      onChange={(e) => patchEvent(index, { description: e.target.value })}
                    />
                  </Field>
                  <Field label="日期">
                    <input
                      className={styles.input}
                      type="date"
                      value={asText(event.date)}
                      onChange={(e) => patchEvent(index, { date: e.target.value })}
                    />
                  </Field>
                  <Field label="时间">
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.time)}
                      onChange={(e) => patchEvent(index, { time: e.target.value })}
                    />
                  </Field>
                  <Field label="时长">
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.duration)}
                      onChange={(e) => patchEvent(index, { duration: e.target.value })}
                    />
                  </Field>
                  <Field label="地点">
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.venue)}
                      onChange={(e) => patchEvent(index, { venue: e.target.value })}
                    />
                  </Field>
                  <Field label="地点（英文）">
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.venueEn)}
                      onChange={(e) => patchEvent(index, { venueEn: e.target.value })}
                    />
                  </Field>
                  <Field label="详细地址" wide>
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.venueAddress)}
                      onChange={(e) => patchEvent(index, { venueAddress: e.target.value })}
                    />
                  </Field>
                  <Field label="报名链接" wide>
                    <input
                      className={styles.input}
                      type="text"
                      value={asText(event.formUrl)}
                      onChange={(e) => patchEvent(index, { formUrl: e.target.value })}
                    />
                  </Field>
                  <Field label="展示" wide>
                    <div className={styles.eventChecks}>
                      <label className={styles.checkboxRow}>
                        <input
                          type="checkbox"
                          checked={home}
                          onChange={(e) => patchEvent(index, { home: e.target.checked })}
                        />
                        <span>首页展示</span>
                      </label>
                      <label className={styles.checkboxRow}>
                        <input
                          type="checkbox"
                          checked={past}
                          onChange={(e) => patchEvent(index, { past: e.target.checked })}
                        />
                        <span>往迹 / 已结束</span>
                      </label>
                    </div>
                  </Field>
                  <Field label="横幅图片" wide>
                    <ImageUpload
                      value={asText(event.imageUrl)}
                      onChange={(next) => patchEvent(index, { imageUrl: next })}
                    />
                  </Field>
                  <Field label="卡片图片" wide>
                    <ImageUpload
                      value={asText(event.cardImageUrl)}
                      onChange={(next) => patchEvent(index, { cardImageUrl: next })}
                    />
                  </Field>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button type="button" className={styles.addBtn} onClick={add}>
        + 添加活动
      </button>
    </div>
  )
}
