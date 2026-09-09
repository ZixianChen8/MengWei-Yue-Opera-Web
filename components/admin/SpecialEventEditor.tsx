'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ImageUpload from './ImageUpload'
import { PAGE_TYPES, pageTypeMeta } from '@/lib/special-templates'
import { isValidPageId } from '@/lib/special-paths'
import type { SpecialEvent, SpecialPageType } from '@/content/special'
import styles from './admin.module.css'

type LoadState = 'loading' | 'ready' | 'error'

export default function SpecialEventEditor({ slug }: { slug: string }) {
  const [event, setEvent] = useState<SpecialEvent | null>(null)
  const [snapshot, setSnapshot] = useState<string>('')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [newType, setNewType] = useState<SpecialPageType>('booklet')
  const [newId, setNewId] = useState('')
  const [newIdTouched, setNewIdTouched] = useState(false)

  const fetchEvent = useCallback(async (signal?: AbortSignal): Promise<SpecialEvent> => {
    const res = await fetch(`/api/admin/special?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      signal,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '加载专场失败')
    return json.event as SpecialEvent
  }, [slug])

  const load = useCallback(async () => {
    setLoadState('loading')
    setError(null)
    setSavedMsg(null)
    try {
      const next = await fetchEvent()
      setEvent(next)
      setSnapshot(serialize(next))
      setLoadState('ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载专场失败')
      setLoadState('error')
    }
  }, [fetchEvent])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    fetchEvent(controller.signal)
      .then((next) => {
        if (cancelled) return
        setEvent(next)
        setSnapshot(serialize(next))
        setLoadState('ready')
      })
      .catch((err) => {
        if (cancelled || controller.signal.aborted) return
        setError(err instanceof Error ? err.message : '加载专场失败')
        setLoadState('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [fetchEvent])

  const dirty = useMemo(
    () => !!event && serialize(event) !== snapshot,
    [event, snapshot],
  )

  // Warn before losing unsaved field edits on a browser navigation.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  function patch(next: Partial<SpecialEvent>) {
    setEvent((prev) => (prev ? { ...prev, ...next } : prev))
    setSavedMsg(null)
  }

  // The event logo is rendered by next/image, which needs the intrinsic size to
  // reserve space without distorting it — read it off the file instead of asking.
  function setLogo(logoUrl: string) {
    patch({ brand: { ...event!.brand, logoUrl } })
    if (!logoUrl) return
    const probe = new window.Image()
    probe.onload = () => {
      setEvent((prev) =>
        prev && prev.brand.logoUrl === logoUrl
          ? {
              ...prev,
              brand: {
                ...prev.brand,
                logoWidth: probe.naturalWidth,
                logoHeight: probe.naturalHeight,
              },
            }
          : prev,
      )
    }
    probe.src = logoUrl
  }

  async function post(body: Record<string, unknown>): Promise<boolean> {
    const res = await fetch('/api/admin/special', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...body }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || '操作失败')
    return true
  }

  // Field edits are batched behind 保存并发布; adding or removing a page changes
  // the file's structure and commits immediately, so pending edits are saved
  // first to avoid the reload throwing them away.
  const saveBody = useCallback(() => {
    if (!event) return null
    return {
      action: 'saveEvent',
      settings: {
        titleZh: event.titleZh,
        titleEn: event.titleEn,
        published: event.published,
        inNav: event.inNav,
        seo: event.seo,
        brand: event.brand,
        hub: event.hub,
      },
      pages: event.pages.map((page) => ({
        id: page.id,
        zh: page.zh,
        en: page.en,
        tabEn: page.tabEn ?? '',
        ready: page.ready,
      })),
    }
  }, [event])

  async function run(work: () => Promise<void>, okMsg: string) {
    setBusy(true)
    setError(null)
    setSavedMsg(null)
    try {
      await work()
      setSavedMsg(okMsg)
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setBusy(false)
    }
  }

  async function save() {
    const body = saveBody()
    if (!body) return
    await run(async () => {
      await post(body)
      setSnapshot(serialize(event!))
    }, '已保存并提交。网站将在重新部署完成后更新（约 1–2 分钟）。')
  }

  async function addPage() {
    const id = effectiveNewId
    await run(async () => {
      if (dirty) await post(saveBody()!)
      await post({ action: 'addPage', type: newType, pageId: id })
      await load()
      setNewId('')
      setNewIdTouched(false)
    }, `已添加页面 ${id}。请点击「编辑内容」填写，并勾选「已上线」后发布。`)
  }

  async function deletePage(pageId: string, name: string) {
    if (!window.confirm(`确定要删除页面「${name}」吗？该页面的全部内容都会被移除，且无法撤销。`)) {
      return
    }
    await run(async () => {
      if (dirty) await post(saveBody()!)
      await post({ action: 'deletePage', pageId })
      await load()
    }, `已删除页面 ${pageId}。`)
  }

  function movePage(index: number, delta: number) {
    if (!event) return
    const to = index + delta
    if (to < 0 || to >= event.pages.length) return
    const pages = [...event.pages]
    const [moved] = pages.splice(index, 1)
    pages.splice(to, 0, moved)
    patch({ pages })
  }

  function patchPage(index: number, next: Partial<SpecialEvent['pages'][number]>) {
    if (!event) return
    patch({
      pages: event.pages.map((page, i) => (i === index ? { ...page, ...next } : page)),
    })
  }

  const takenIds = new Set(event?.pages.map((page) => page.id) ?? [])
  const effectiveNewId = newIdTouched ? newId.trim() : newType
  const canAdd =
    !busy && isValidPageId(effectiveNewId) && !takenIds.has(effectiveNewId)

  return (
    <div>
      <div className={styles.editorHead}>
        <div>
          <Link href="/admin/special" className={styles.backLink}>← 返回专场列表</Link>
          <h1 className={styles.editorTitle}>
            {event ? event.titleZh || event.titleEn || slug : slug}
          </h1>
        </div>
        <div className={styles.toolbar}>
          <a
            className={styles.btn}
            href={`/special/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看页面
          </a>
          <button type="button" className={styles.btn} onClick={load} disabled={busy || loadState === 'loading'}>
            重新加载
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={save}
            disabled={busy || loadState !== 'ready'}
          >
            {busy ? '保存中…' : '保存并发布'}
          </button>
        </div>
      </div>

      {savedMsg && <div className={`${styles.status} ${styles.statusOk}`}>{savedMsg}</div>}
      {error && <div className={`${styles.status} ${styles.statusErr}`}>{error}</div>}
      {loadState === 'loading' && <div className={styles.loading}>正在加载专场…</div>}

      {loadState === 'ready' && event && (
        <>
          {/* ── Basics ─────────────────────────────────────── */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>基本信息</div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>中文名称</label>
              <input
                className={styles.input}
                type="text"
                value={event.titleZh}
                onChange={(e) => patch({ titleZh: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>英文名称</label>
              <input
                className={styles.input}
                type="text"
                value={event.titleEn}
                onChange={(e) => patch({ titleEn: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>网址</label>
              <input className={styles.input} type="text" value={`/special/${slug}`} readOnly />
              <span className={styles.uploadHint}>网址在创建时确定，不可更改。</span>
            </div>
            <div className={styles.checkboxRow}>
              <input
                id="special-published"
                type="checkbox"
                checked={event.published}
                onChange={(e) => patch({ published: e.target.checked })}
              />
              <label htmlFor="special-published">已发布（未发布的专场不会生成网页）</label>
            </div>
            <div className={styles.checkboxRow}>
              <input
                id="special-in-nav"
                type="checkbox"
                checked={event.inNav}
                onChange={(e) => patch({ inNav: e.target.checked })}
              />
              <label htmlFor="special-in-nav">在网站导航中显示（自动加入菜单，可在「导航菜单」中调整顺序）</label>
            </div>
          </div>

          {/* ── Hub masthead ───────────────────────────────── */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>专场首页</div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>小字（页眉）</label>
              <input
                className={styles.input}
                type="text"
                value={event.hub.pageHead.meta}
                onChange={(e) =>
                  patch({ hub: { ...event.hub, pageHead: { ...event.hub.pageHead, meta: e.target.value } } })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>大标题（中文）</label>
              <input
                className={styles.input}
                type="text"
                value={event.hub.pageHead.titleZh}
                onChange={(e) =>
                  patch({ hub: { ...event.hub, pageHead: { ...event.hub.pageHead, titleZh: e.target.value } } })
                }
              />
              <span className={styles.uploadHint}>用空格分隔可让标题换行显示。</span>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>大标题（英文）</label>
              <input
                className={styles.input}
                type="text"
                value={event.hub.pageHead.titleEn}
                onChange={(e) =>
                  patch({ hub: { ...event.hub, pageHead: { ...event.hub.pageHead, titleEn: e.target.value } } })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>标语</label>
              <input
                className={styles.input}
                type="text"
                value={event.hub.pageHead.tagline}
                onChange={(e) =>
                  patch({ hub: { ...event.hub, pageHead: { ...event.hub.pageHead, tagline: e.target.value } } })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>底部导航·专场（中文）</label>
              <input
                className={styles.input}
                type="text"
                value={event.hub.hubTab.zh}
                onChange={(e) =>
                  patch({ hub: { ...event.hub, hubTab: { ...event.hub.hubTab, zh: e.target.value } } })
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>底部导航·专场（英文）</label>
              <input
                className={styles.input}
                type="text"
                value={event.hub.hubTab.en}
                onChange={(e) =>
                  patch({ hub: { ...event.hub, hubTab: { ...event.hub.hubTab, en: e.target.value } } })
                }
              />
              <span className={styles.uploadHint}>手机底部导航空间有限，英文请用短词（如 Gala）。</span>
            </div>
          </div>

          {/* ── Logo ───────────────────────────────────────── */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>专场标识</div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>横幅标识（可留空）</label>
              <ImageUpload value={event.brand.logoUrl} onChange={setLogo} />
              <span className={styles.uploadHint}>
                留空则使用工作室通用标识。建议使用宽幅透明或深色底图片；尺寸会自动读取
                {event.brand.logoUrl && event.brand.logoWidth
                  ? `（当前 ${event.brand.logoWidth}×${event.brand.logoHeight}）`
                  : ''}
                。
              </span>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>标识替代文字</label>
              <input
                className={styles.input}
                type="text"
                value={event.brand.logoAlt}
                onChange={(e) => patch({ brand: { ...event.brand, logoAlt: e.target.value } })}
              />
            </div>
          </div>

          {/* ── SEO ────────────────────────────────────────── */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>搜索与分享</div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>浏览器标题</label>
              <input
                className={styles.input}
                type="text"
                value={event.seo.title}
                onChange={(e) => patch({ seo: { ...event.seo, title: e.target.value } })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>页面描述</label>
              <textarea
                className={styles.textarea}
                value={event.seo.description}
                onChange={(e) => patch({ seo: { ...event.seo, description: e.target.value } })}
              />
            </div>
          </div>

          {/* ── Pages ──────────────────────────────────────── */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>页面</div>
            <div className={styles.eventList}>
              {event.pages.length === 0 && (
                <div className={styles.arrayEmpty}>还没有页面。在下方添加第一个页面。</div>
              )}
              {event.pages.map((page, i) => (
                <div key={page.id} className={`${styles.eventRow} ${styles.eventRowOpen}`}>
                  <div className={styles.eventHead}>
                    <div className={styles.eventSummary}>
                      <span className={styles.eventName}>{page.zh || page.id}</span>
                      <span className={styles.eventMeta}>
                        <span>/{page.id}</span>
                        <span>{pageTypeMeta(page.type)?.zh ?? page.type}</span>
                        <span className={page.ready ? styles.eventChipOn : undefined}>
                          {page.ready ? '已上线' : '未上线'}
                        </span>
                      </span>
                    </div>
                    <div className={styles.arrayControls}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => movePage(i, -1)}
                        disabled={i === 0}
                        aria-label="上移"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => movePage(i, 1)}
                        disabled={i === event.pages.length - 1}
                        aria-label="下移"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => deletePage(page.id, page.zh || page.id)}
                        disabled={busy}
                        aria-label="删除页面"
                      >
                        x
                      </button>
                    </div>
                  </div>
                  <div className={styles.eventForm}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>中文名</label>
                      <input
                        className={styles.input}
                        type="text"
                        value={page.zh}
                        onChange={(e) => patchPage(i, { zh: e.target.value })}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>英文名</label>
                      <input
                        className={styles.input}
                        type="text"
                        value={page.en}
                        onChange={(e) => patchPage(i, { en: e.target.value })}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>底部导航英文（短）</label>
                      <input
                        className={styles.input}
                        type="text"
                        value={page.tabEn ?? ''}
                        placeholder="Book / Acts / Guide"
                        onChange={(e) => patchPage(i, { tabEn: e.target.value })}
                      />
                    </div>
                    <div className={`${styles.field} ${styles.eventChecks}`}>
                      <div className={styles.checkboxRow}>
                        <input
                          id={`ready-${page.id}`}
                          type="checkbox"
                          checked={page.ready}
                          onChange={(e) => patchPage(i, { ready: e.target.checked })}
                        />
                        <label htmlFor={`ready-${page.id}`}>已上线</label>
                      </div>
                      <Link className={styles.btn} href={`/admin/special/${slug}/${page.id}`}>
                        编辑内容
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.eventForm}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>添加页面 · 类型</label>
                <select
                  className={styles.select}
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as SpecialPageType)}
                >
                  {PAGE_TYPES.map((meta) => (
                    <option key={meta.type} value={meta.type}>
                      {meta.zh} · {meta.en}
                    </option>
                  ))}
                </select>
                <span className={styles.uploadHint}>{pageTypeMeta(newType)?.blurb}</span>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>页面网址</label>
                <input
                  className={styles.input}
                  type="text"
                  value={effectiveNewId}
                  onChange={(e) => {
                    setNewIdTouched(true)
                    setNewId(e.target.value)
                  }}
                />
                <span className={styles.uploadHint}>
                  /special/{slug}/{effectiveNewId || '…'}
                  {takenIds.has(effectiveNewId) ? ' — 该网址已被占用。' : ''}
                </span>
              </div>
              <div className={styles.eventSpan}>
                <button type="button" className={styles.addBtn} onClick={addPage} disabled={!canAdd}>
                  + 添加页面
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Page content is large and not edited here; exclude it so the dirty check
// stays cheap and only reflects the fields this screen owns.
function serialize(event: SpecialEvent | null): string {
  if (!event) return ''
  return JSON.stringify({
    ...event,
    pages: event.pages.map((page) => ({
      id: page.id,
      type: page.type,
      zh: page.zh,
      en: page.en,
      tabEn: page.tabEn ?? '',
      ready: page.ready,
    })),
  })
}
