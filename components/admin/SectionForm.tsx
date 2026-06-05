'use client'

import { useState, type ReactNode } from 'react'
import ImageUpload from './ImageUpload'
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
  statusType: ['open', 'free', 'soon', 'waitlist', 'members', 'closed'],
}

// Cross-item caps: at most `max` items in this array may have `key` truthy.
// Keyed by the array's key. Enforced in the array update path below, the only
// place with visibility over sibling items.
const ARRAY_LIMITS: Record<string, { key: string; max: number; hint: string; message: string }> = {
  events: {
    key: 'home',
    max: 3,
    hint: 'Tick "Home" on up to 3 events to choose which appear in the home page section.',
    message: 'At most 3 events can be shown on the home page. Untick another first.',
  },
}

// Shape used when adding the first item to an otherwise-empty array.
// Without this, "Add" has no sibling to clone and falls back to a bare
// string, so e.g. an emptied gallery would offer only a plain textbox
// instead of the image-upload + caption fields. Keyed by the array's key.
const NEW_ITEM_TEMPLATES: Record<string, JsonValue> = {
  photos: { image: '', title: '', description: '', date: '', home: false },
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

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

function labelFromValue(value: JsonValue): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as { [key: string]: JsonValue }
  const keys = ['titleEn', 'title', 'label', 'name', 'date', 'zh', 'en', 'id']

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
      {items.length === 0 && <div className={styles.arrayEmpty}>No items yet.</div>}
      {items.map((item, i) => {
        const primitive = typeof item !== 'object' || item === null
        const detail = labelFromValue(item)

        return (
          <div key={i} className={styles.arrayItem}>
            <Collapsible
              title={`${humanize(keyName)} ${i + 1}`}
              detail={detail ?? undefined}
              controls={
                <div className={styles.arrayControls}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                  >
                    ^
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                  >
                    v
                  </button>
                  <button type="button" className={styles.iconBtn} onClick={() => remove(i)} aria-label="Remove">
                    x
                  </button>
                </div>
              }
            >
              {primitive ? (
                <ValueNode value={item} keyName={keyName} onChange={(next) => update(i, next)} />
              ) : (
                <ObjectNode value={item as { [k: string]: JsonValue }} onChange={(next) => update(i, next)} />
              )}
            </Collapsible>
          </div>
        )
      })}
      <button type="button" className={styles.addBtn} onClick={add}>
        + Add {humanize(keyName).toLowerCase()}
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

  if (typeof value === 'string' && ENUM_OPTIONS[keyName]) {
    const options = ENUM_OPTIONS[keyName]
    const list = options.includes(value) ? options : [value, ...options]
    return (
      <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {list.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
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
        <span>{value ? 'Yes' : 'No'}</span>
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
}

function ObjectNode({ value, onChange }: ObjectNodeProps) {
  return (
    <>
      {Object.entries(value).map(([k, v]) => {
        const nested = v !== null && typeof v === 'object'
        const update = (next: JsonValue) => onChange({ ...value, [k]: next })

        if (nested) {
          return (
            <div key={k} className={styles.group}>
              <Collapsible title={humanize(k)} detail={labelFromValue(v) ?? undefined}>
                <ValueNode value={v} keyName={k} onChange={update} />
              </Collapsible>
            </div>
          )
        }

        return (
          <div key={k} className={styles.field}>
            <label className={styles.fieldLabel}>{humanize(k)}</label>
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
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return <ValueNode value={value} keyName="value" onChange={onChange} />
  }

  return <ObjectNode value={value as { [k: string]: JsonValue }} onChange={(next) => onChange(next)} />
}
