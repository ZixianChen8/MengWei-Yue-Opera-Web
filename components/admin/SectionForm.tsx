'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import ImageUpload from './ImageUpload'
import { EVENT_STATUS_META, EVENT_STATUS_VALUES } from '@/lib/event-status'
import styles from './admin.module.css'

// A JSON-ish value tree. Mirrors what lives in content/data/*.json.
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

// Constrained-choice fields get a dropdown instead of free text so an
// admin can't accidentally break styling that keys off these values.
const ENUM_OPTIONS: Record<string, string[]> = {
  status: [...EVENT_STATUS_VALUES],
}

// Chinese display text for enum values. The stored value stays the English
// identifier (styling keys off it); only the dropdown label is translated.
const ENUM_LABELS: Record<string, Record<string, string>> = {
  status: Object.fromEntries(
    EVENT_STATUS_VALUES.map((key) => [key, EVENT_STATUS_META[key].label]),
  ),
}

// Chinese labels for JSON field keys. Keys not listed fall back to humanize().
// Translating these keeps the data keys (and the JSON on disk) untouched while
// giving the Chinese operator readable field names.
const FIELD_LABELS: Record<string, string> = {
  // Shared bilingual-pair keys
  zh: '中文',
  en: '英文',
  cn: '中文',
  href: '链接',
  // Brand / nav
  brand: '品牌标识',
  markPre: '标识·前',
  markAccent: '标识·重点字',
  markPost: '标识·后',
  seal: '印章字',
  sub: '副标题',
  links: '菜单链接',
  // Hero
  nameZh: '机构中文名',
  nameEn: '机构英文名',
  // Shared / other sections
  meta: '小标题',
  stamp: '印章',
  // Overture
  title: '标题',
  quote: '引言',
  text: '正文',
  attr: '出处',
  body: '正文',
  stats: '数据',
  value: '数值',
  label: '标签',
  // Season / events
  eyebrow: '眉标',
  aside: '旁注',
  events: '活动',
  tag: '类别标签',
  titleZh: '中文标题',
  titleEn: '英文标题',
  blurb: '简介',
  description: '详细介绍',
  date: '日期',
  time: '时间',
  duration: '时长',
  venue: '地点',
  venueAddress: '详细地址',
  venueEn: '地点（英文）',
  home: '首页展示',
  past: '往迹 / 已结束',
  status: '状态',
  formUrl: '报名链接',
  imageUrl: '横幅图片',
  cardImageUrl: '卡片图片',
  // Studio
  level: '班级',
  program: '课程',
  cta: '行动按钮',
  // About (home block)
  verse: '诗句',
  verseEn: '诗句（英文）',
  vertMeta: '竖排小标',
  vertTitle: '竖排标题',
  before: '前段',
  red: '红色字',
  after: '后段',
  mission: '宗旨',
  // Gallery page
  charsTop: '大字',
  charsRed: '大字（红）',
  crumbsTop: '面包屑（上）',
  plain: '普通文字',
  bold: '加粗文字',
  enTitle: '英文标题',
  crumbsBottom: '面包屑（下）',
  photos: '照片',
  image: '图片',
  eventId: '所属活动',
  // Contact (single source)
  email: '邮箱',
  // About page + contact form
  pageHead: '页头',
  charsZh: '中文大字',
  subtitle: '副标题',
  crumb: '面包屑',
  bio: '简介',
  vertZh: '竖排中文',
  paragraphs: '段落',
  contact: '联络',
  lede: '导语',
  channels: '联络方式',
  val: '内容',
  form: '表单',
  sealGlyph: '印章字',
  intro: '引导语',
  subjects: '主题选项',
  fields: '表单字段',
  name: '姓名',
  subject: '主题',
  phone: '电话',
  message: '留言',
  ph: '占位提示',
  privacy: '隐私声明',
  submit: '提交按钮',
  sending: '提交中文字',
  error: '错误提示',
  sent: '提交成功提示',
  // Special-event booklet / programme / appreciation
  posterImage: '海报图片',
  presents: '呈献',
  wordmark: '主标题',
  scriptEn: '英文手写标题',
  tagline: '标语',
  organizer: '主办',
  cover: '封面',
  preface: '序言',
  signoff: '落款',
  org: '机构',
  letters: '贺信',
  team: '主创',
  members: '成员',
  role: '职务',
  credits: '履历',
  acts: '曲目',
  performers: '演员',
  performersEn: '演员（英文）',
  note: '说明',
  noteEn: '说明（英文）',
  no: '序号',
  category: '类别',
  committee: '组委会',
  crew: '演职人员',
  groups: '分组',
  names: '名单',
  closing: '结尾',
  organizerTitleEn: '主办标题',
  supportingTitleEn: '支持单位标题',
  supporting: '支持单位',
  emcee: '主持',
  emceeLabel: '主持标签',
  entries: '导赏条目',
  keywords: '关键词',
  lead: '导语',
  sections: '段落',
  sectionsEn: '段落（英文）',
  heading: '小标题',
  lyrics: '唱词',
  keywordsLabel: '关键词标签',
  lyricsLabel: '唱词标签',
  items: '条目',
}

// Cross-item caps: at most `max` items in this array may have `key` truthy.
// Keyed by the array's key. Enforced in the array update path below, the only
// place with visibility over sibling items.
const ARRAY_LIMITS: Record<string, { key: string; max: number; hint: string; message: string }> = {
  events: {
    key: 'home',
    max: 3,
    hint: '最多可在 3 个活动上勾选"首页展示"，决定哪些显示在首页板块。',
    message: '首页最多显示 3 个活动，请先取消勾选其他活动。',
  },
  photos: {
    key: 'home',
    max: 10,
    hint: '最多可在 10 张照片上勾选"首页展示"，决定哪些显示在首页往年活动板块。',
    message: '首页往年活动最多显示 10 张照片，请先取消勾选其他照片。',
  },
}

// Shape used when adding the first item to an otherwise-empty array.
// Without this, "Add" has no sibling to clone and falls back to a bare
// string, so e.g. an emptied gallery would offer only a plain textbox
// instead of the image-upload + caption fields. Keyed by the array's key.
const NEW_ITEM_TEMPLATES: Record<string, JsonValue> = {
  photos: { image: '', title: '', description: '', date: '', home: false, eventId: '' },
  events: {
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
  },
  items: { name: '', role: '', image: '' },
  members: { name: '', role: '', image: '', bio: [''], credits: [] },
  acts: {
    no: '',
    category: '',
    titleZh: '',
    titleEn: '',
    performers: '',
    performersEn: '',
    note: '',
    noteEn: '',
  },
  entries: {
    no: '',
    category: '',
    titleZh: '',
    titleEn: '',
    performers: '',
    keywords: '',
    lead: '',
    sections: [{ heading: '', body: [''] }],
  },
  groups: { role: '', names: '' },
  sections: { heading: '', body: [''] },
  lines: { role: '', zh: '', en: '' },
}

function isImageKey(key: string): boolean {
  return /image|imageurl|imgurl/i.test(key)
}

// The event `date` is a machine-readable ISO field (YYYY-MM-DD), so it gets a
// native date picker that forces the format. Scoped by both key name and an
// ISO/empty value check so loosely-typed `date` fields elsewhere (gallery /
// repertoire use free text like "2024") keep their plain text box.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
function isIsoDateKey(key: string, value: string): boolean {
  return key === 'date' && (value === '' || ISO_DATE.test(value))
}

// Keys kept in JSON for the site but not exposed in the admin form.
const HIDDEN_ADMIN_KEYS = new Set(['lightbox', 'albums'])
const HIDDEN_EVENT_KEYS = new Set(['id', 'num', 'listNum', 'statusType', 'statusLabel'])

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

// Chinese field label, falling back to a humanized English key for anything
// not yet translated in FIELD_LABELS.
function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? humanize(key)
}

type EventOption = { id: string; label: string }

const EventOptionsContext = createContext<EventOption[]>([])

function eventLabel(event: { id?: unknown; titleZh?: unknown; titleEn?: unknown }): EventOption | null {
  if (typeof event.id !== 'string' || !event.id) return null
  const zh = Array.isArray(event.titleZh)
    ? event.titleZh.filter((part): part is string => typeof part === 'string').join('')
    : typeof event.titleZh === 'string'
      ? event.titleZh
      : ''
  const en = typeof event.titleEn === 'string' ? event.titleEn.trim() : ''
  const label = [zh, en].filter(Boolean).join(' · ') || event.id
  return { id: event.id, label }
}

function EventIdSelect({ value, onChange }: { value: string; onChange: (next: JsonValue) => void }) {
  const options = useContext(EventOptionsContext)
  const list = value && !options.some((opt) => opt.id === value)
    ? [{ id: value, label: value }, ...options]
    : options

  return (
    <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">未分类</option>
      {list.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

function labelFromValue(value: JsonValue): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as { [key: string]: JsonValue }
  const keys = ['titleEn', 'title', 'label', 'name', 'date', 'zh', 'en']

  for (const key of keys) {
    const candidate = record[key]
    if (typeof candidate === 'string' && candidate.trim()) return candidate
  }

  return null
}

type CollapsibleProps = {
  title: string
  detail?: string
  controls?: ReactNode
  children: ReactNode
}

function Collapsible({ title, detail, controls, children }: CollapsibleProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.collapsible}>
      <div className={styles.collapsibleHead}>
        <button
          type="button"
          className={styles.collapseToggle}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={styles.collapseIcon}>{open ? '-' : '+'}</span>
          <span>
            <span className={styles.collapseTitle}>{title}</span>
            {detail && <span className={styles.collapseDetail}>{detail}</span>}
          </span>
        </button>
        {controls}
      </div>
      {open && <div className={styles.collapsibleBody}>{children}</div>}
    </div>
  )
}

// Build an empty value with the same shape as a sample (for "add item").
function blankLike(sample: JsonValue): JsonValue {
  if (Array.isArray(sample)) return []
  if (sample === null) return ''
  switch (typeof sample) {
    case 'string':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'object': {
      const out: { [k: string]: JsonValue } = {}
      for (const [k, v] of Object.entries(sample)) out[k] = blankLike(v)
      return out
    }
    default:
      return ''
  }
}

function isPlainObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

type ArrayNodeProps = {
  items: JsonValue[]
  keyName: string
  onChange: (next: JsonValue) => void
}

function ArrayNode({ items, keyName, onChange }: ArrayNodeProps) {
  const [warn, setWarn] = useState<string | null>(null)
  const limit = ARRAY_LIMITS[keyName]

  const update = (i: number, next: JsonValue) => {
    // Enforce a cross-item cap (e.g. at most 3 events flagged for the home page).
    if (limit && isPlainObject(next) && isPlainObject(items[i])) {
      const wasOn = !!items[i][limit.key]
      const nowOn = !!next[limit.key]
      if (!wasOn && nowOn) {
        const count = items.filter((it) => isPlainObject(it) && !!it[limit.key]).length
        if (count >= limit.max) {
          setWarn(limit.message)
          return
        }
      }
    }
    setWarn(null)
    const copy = items.slice()
    copy[i] = next
    onChange(copy)
  }
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const copy = items.slice()
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    onChange(copy)
  }
  const add = () => {
    const fallback = NEW_ITEM_TEMPLATES[keyName]
    const template =
      items.length > 0
        ? blankLike(items[items.length - 1])
        : fallback
          ? blankLike(fallback)
          : ''
    onChange([...items, template])
  }

  return (
    <div>
      {limit && <div className={styles.arrayEmpty}>{limit.hint}</div>}
      {warn && <div className={`${styles.status} ${styles.statusErr}`}>{warn}</div>}
      {items.length === 0 && <div className={styles.arrayEmpty}>暂无条目。</div>}
      {items.map((item, i) => {
        const primitive = typeof item !== 'object' || item === null
        const detail = labelFromValue(item)

        return (
          <div key={i} className={styles.arrayItem}>
            <Collapsible
              title={`${fieldLabel(keyName)} ${i + 1}`}
              detail={detail ?? undefined}
              controls={
                <div className={styles.arrayControls}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="上移"
                  >
                    ^
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="下移"
                  >
                    v
                  </button>
                  <button type="button" className={styles.iconBtn} onClick={() => remove(i)} aria-label="删除">
                    x
                  </button>
                </div>
              }
            >
              {primitive ? (
                <ValueNode value={item} keyName={keyName} onChange={(next) => update(i, next)} />
              ) : (
                <ObjectNode
                  value={item as { [k: string]: JsonValue }}
                  onChange={(next) => update(i, next)}
                  hiddenKeys={keyName === 'events' ? HIDDEN_EVENT_KEYS : HIDDEN_ADMIN_KEYS}
                  ensureFields={keyName === 'photos' ? { eventId: '' } : undefined}
                />
              )}
            </Collapsible>
          </div>
        )
      })}
      <button type="button" className={styles.addBtn} onClick={add}>
        + 添加{fieldLabel(keyName)}
      </button>
    </div>
  )
}

type NodeProps = {
  value: JsonValue
  keyName: string
  onChange: (next: JsonValue) => void
}

function ValueNode({ value, keyName, onChange }: NodeProps) {
  if (typeof value === 'string' && isImageKey(keyName)) {
    return <ImageUpload value={value} onChange={onChange} />
  }

  if (typeof value === 'string' && isIsoDateKey(keyName, value)) {
    return (
      <input
        className={styles.input}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  if (typeof value === 'string' && keyName === 'eventId') {
    return <EventIdSelect value={value} onChange={onChange} />
  }

  if (typeof value === 'string' && ENUM_OPTIONS[keyName]) {
    const options = ENUM_OPTIONS[keyName]
    const list = options.includes(value) ? options : [value, ...options]
    const labels = ENUM_LABELS[keyName]
    return (
      <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {list.map((opt) => (
          <option key={opt} value={opt}>
            {labels?.[opt] ?? opt}
          </option>
        ))}
      </select>
    )
  }

  if (typeof value === 'string') {
    const multiline = value.length > 60 || value.includes('\n')
    return multiline ? (
      <textarea className={styles.textarea} value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input className={styles.input} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    )
  }

  if (typeof value === 'number') {
    return (
      <input
        className={styles.input}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span>{value ? '是' : '否'}</span>
      </label>
    )
  }

  if (Array.isArray(value)) {
    return <ArrayNode items={value} keyName={keyName} onChange={onChange} />
  }

  if (value && typeof value === 'object') {
    return <ObjectNode value={value as { [k: string]: JsonValue }} onChange={onChange} />
  }

  return (
    <input
      className={styles.input}
      type="text"
      value={value === null ? '' : String(value)}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

type ObjectNodeProps = {
  value: { [key: string]: JsonValue }
  onChange: (next: { [key: string]: JsonValue }) => void
  hiddenKeys?: Set<string>
  ensureFields?: { [key: string]: JsonValue }
}

function ObjectNode({
  value,
  onChange,
  hiddenKeys = HIDDEN_ADMIN_KEYS,
  ensureFields,
}: ObjectNodeProps) {
  const entries = Object.entries(value)
  if (ensureFields) {
    for (const [key, fallback] of Object.entries(ensureFields)) {
      if (!(key in value)) entries.push([key, fallback])
    }
  }

  return (
    <>
      {entries.map(([k, v]) => {
        if (hiddenKeys.has(k)) return null
        const nested = v !== null && typeof v === 'object'
        const update = (next: JsonValue) => onChange({ ...value, [k]: next })

        if (nested) {
          return (
            <div key={k} className={styles.group}>
              <Collapsible title={fieldLabel(k)} detail={labelFromValue(v) ?? undefined}>
                <ValueNode value={v} keyName={k} onChange={update} />
              </Collapsible>
            </div>
          )
        }

        return (
          <div key={k} className={styles.field}>
            <label className={styles.fieldLabel}>{fieldLabel(k)}</label>
            <ValueNode value={v} keyName={k} onChange={update} />
          </div>
        )
      })}
    </>
  )
}

type Props = {
  value: JsonValue
  onChange: (next: JsonValue) => void
}

// Top-level section values are always objects in this content model.
export default function SectionForm({ value, onChange }: Props) {
  const [eventOptions, setEventOptions] = useState<EventOption[]>([])
  const hasPhotos = isPlainObject(value) && Array.isArray(value.photos)

  useEffect(() => {
    if (!hasPhotos) return
    const controller = new AbortController()
    fetch('/api/admin/content?target=home&section=season', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json: { data?: { events?: unknown } }) => {
        const events = json.data?.events
        if (!Array.isArray(events)) return
        setEventOptions(
          events
            .map((event) => eventLabel(event as { id?: unknown; titleZh?: unknown; titleEn?: unknown }))
            .filter((opt): opt is EventOption => opt !== null),
        )
      })
      .catch(() => {
        // Dropdown still works with 未分类 alone if the season list fails to load.
      })
    return () => controller.abort()
  }, [hasPhotos])

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return <ValueNode value={value} keyName="value" onChange={onChange} />
  }

  return (
    <EventOptionsContext.Provider value={eventOptions}>
      <ObjectNode value={value as { [k: string]: JsonValue }} onChange={(next) => onChange(next)} />
    </EventOptionsContext.Provider>
  )
}
