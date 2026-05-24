# Repertoire Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Repertoire text-grid section with a horizontally scrollable filmstrip gallery: uniform cards that expand on hover, overlay captions, and a lightbox on click.

**Architecture:** `Repertoire.tsx` becomes a `'use client'` component that manages two pieces of state — drag-scroll tracking (via refs) and the open lightbox index (via `useState`). The CSS module handles all visual behaviour (accordion width transition, caption fade, lightbox opacity transition) with no keyframes — transitions only, consistent with the project's globals.css keyframe policy.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, `next/image`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `content/home.ts` | Modify | Add `image` field to each `works[]` entry |
| `public/assets/gallery/` | Create | Four placeholder JPG images |
| `components/Repertoire/Repertoire.module.css` | Rewrite | All filmstrip + lightbox styles |
| `components/Repertoire/Repertoire.tsx` | Rewrite | `'use client'` filmstrip + lightbox component |

---

## Task 1: Add placeholder images

**Files:**
- Create: `public/assets/gallery/he-wenxiu.jpg`
- Create: `public/assets/gallery/five-daughters.jpg`
- Create: `public/assets/gallery/west-chamber.jpg`
- Create: `public/assets/gallery/jade-hairpin.jpg`

- [ ] **Step 1: Download four portrait placeholder images from picsum.photos**

```bash
mkdir -p public/assets/gallery
curl -L "https://picsum.photos/seed/ink1/800/1200" -o public/assets/gallery/he-wenxiu.jpg
curl -L "https://picsum.photos/seed/ink2/800/1200" -o public/assets/gallery/five-daughters.jpg
curl -L "https://picsum.photos/seed/ink3/800/1200" -o public/assets/gallery/west-chamber.jpg
curl -L "https://picsum.photos/seed/ink4/800/1200" -o public/assets/gallery/jade-hairpin.jpg
```

Expected: four files present in `public/assets/gallery/`, each ~100–300 KB.

- [ ] **Step 2: Verify files exist**

```bash
ls -lh public/assets/gallery/
```

Expected: four `.jpg` files listed with non-zero sizes.

---

## Task 2: Add `image` field to content

**Files:**
- Modify: `content/home.ts` lines 111–116

- [ ] **Step 1: Add `image` field to each work in `content/home.ts`**

Replace the `works` array (currently lines 111–116):

```ts
works: [
  { year: '2019', zh: ['碧玉', '簪'],    en: 'The Jade Hairpin',           image: '/assets/gallery/jade-hairpin.jpg' },
  { year: '2021', zh: ['西厢', '记'],    en: 'Romance of the West Chamber', image: '/assets/gallery/west-chamber.jpg' },
  { year: '2023', zh: ['五女', '拜寿'],  en: "Five Daughters' Birthday",    image: '/assets/gallery/five-daughters.jpg' },
  { year: '2024', zh: ['何文', '秀'],    en: 'He Wenxiu',                   image: '/assets/gallery/he-wenxiu.jpg' },
],
```

- [ ] **Step 2: Confirm TypeScript is happy**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no errors mentioning `content/home.ts` or the `image` property.

---

## Task 3: Write the CSS module

**Files:**
- Rewrite: `components/Repertoire/Repertoire.module.css`

No keyframes — all motion via CSS `transition`. The lightbox uses `opacity` + `pointer-events` toggled by the `.lightboxOpen` class applied from React state.

- [ ] **Step 1: Replace the entire contents of `Repertoire.module.css`**

```css
/* ── Section ── */
.section {
  padding: 0 80px 100px;
  position: relative;
  overflow: hidden;
}

.head {
  margin-bottom: 52px;
}

.title {
  font-family: var(--font-chinese-display);
  font-size: 48px;
  letter-spacing: 0.1em;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 8px;
  font-weight: 400;
}

.titleRed {
  color: var(--seal);
}

.titleEn {
  font-family: var(--font-latin-display);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
  text-transform: uppercase;
}

/* ── Filmstrip ── */
/* Outer wrapper: extends past section padding so the right-edge fade
   can sit flush with the viewport, while the scrollable content still
   starts at 80px from the left. */
.filmstripOuter {
  position: relative;
  margin: 0 -80px;
}

/* Right-edge gradient to hint at scrollable content */
.filmstripOuter::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 120px;
  background: linear-gradient(to right, transparent, var(--paper));
  pointer-events: none;
  z-index: 2;
}

.filmstripWrap {
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 80px;
  cursor: grab;
}

.filmstripWrap:active {
  cursor: grabbing;
}

.filmstripWrap::-webkit-scrollbar {
  display: none;
}

.filmstrip {
  display: flex;
  gap: 10px;
  height: 520px;
  min-width: max-content;
  padding-right: 80px;
}

/* ── Cards ── */
.filmCard {
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  width: 280px;
  transition: width 0.42s cubic-bezier(0.4, 0, 0.2, 1);
}

.filmCard:hover {
  width: 370px;
}

.filmImg {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.filmCard:hover .filmImg {
  transform: scale(1.03);
}

/* Always-present bottom gradient */
.filmGradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 35%,
    rgba(15, 10, 8, 0.25) 60%,
    rgba(15, 10, 8, 0.85) 100%
  );
  pointer-events: none;
}

/* Vermillion hover sheen */
.filmOverlay {
  position: absolute;
  inset: 0;
  background: rgba(192, 58, 43, 0.07);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.filmCard:hover .filmOverlay {
  opacity: 1;
}

/* ── Caption ── */
.filmCaption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 22px 24px;
  transform: translateY(6px);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.filmCard:hover .filmCaption {
  transform: translateY(0);
}

.year {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--seal);
  letter-spacing: 0.08em;
  margin-bottom: 8px;
  opacity: 0;
  transition: opacity 0.2s 0.06s;
}

.filmCard:hover .year {
  opacity: 1;
}

.cnTitle {
  font-family: var(--font-chinese-display);
  font-size: 26px;
  color: #f8f4ee;
  letter-spacing: 0.08em;
  line-height: 1.15;
  margin-bottom: 6px;
}

.enTitle {
  font-family: var(--font-latin-display);
  font-size: 10px;
  color: rgba(248, 244, 238, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0;
  transition: opacity 0.2s 0.1s;
}

.filmCard:hover .enTitle {
  opacity: 1;
}

/* Expand icon (top-right corner) */
.expandIcon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(248, 244, 238, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.2s, transform 0.2s;
}

.filmCard:hover .expandIcon {
  opacity: 1;
  transform: scale(1);
}

.expandIcon svg {
  width: 12px;
  height: 12px;
  stroke: #f8f4ee;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ── Scroll hint ── */
.scrollHint {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.scrollHint::before,
.scrollHint::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* ── Lightbox ── */
/* Always in DOM; toggled via .lightboxOpen class.
   Transitions handle both entry and exit. */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 10, 8, 0.92);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

.lightboxOpen {
  opacity: 1;
  pointer-events: all;
}

.lbContent {
  position: relative;
  display: flex;
  gap: 48px;
  align-items: center;
  max-width: 880px;
  padding: 24px;
  cursor: default;
  transform: translateY(16px);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.lightboxOpen .lbContent {
  transform: translateY(0);
}

.lbImgWrap {
  width: 460px;
  height: 560px;
  flex-shrink: 0;
  border-radius: 3px;
  overflow: hidden;
}

.lbImg {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

.lbMeta {
  flex: 1;
}

.lbYear {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--seal);
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Divider line after the year */
.lbYear::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(248, 244, 238, 0.15);
}

.lbCn {
  font-family: var(--font-chinese-display);
  font-size: 52px;
  color: #f8f4ee;
  letter-spacing: 0.1em;
  line-height: 1.1;
  margin-bottom: 14px;
  font-weight: 400;
}

.lbEn {
  font-family: var(--font-latin-display);
  font-size: 12px;
  color: rgba(248, 244, 238, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.lbClose {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(248, 244, 238, 0.2);
  border-radius: 50%;
  background: rgba(26, 26, 26, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #f8f4ee;
  transition: border-color 0.2s, background 0.2s;
}

.lbClose:hover {
  border-color: var(--seal);
  background: rgba(192, 58, 43, 0.2);
}
```

---

## Task 4: Rewrite the Repertoire component

**Files:**
- Rewrite: `components/Repertoire/Repertoire.tsx`

Key details:
- Default export (matches current `app/page.tsx` import pattern)
- `Eyebrow` is a default import with a `label` prop
- `zh.join('')` flattens the array (e.g. `['何文','秀']` → `'何文秀'`)
- Last character of `title.zh` gets `styles.titleRed` (vermillion), matching the Hero section pattern
- A `didDrag` ref prevents accidental lightbox opens when the user drag-scrolls over a card
- Lightbox is always rendered; `.lightboxOpen` class is toggled — this lets CSS transitions fire on both open and close

- [ ] **Step 1: Replace the entire contents of `Repertoire.tsx`**

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { repertoire } from '@/content/home'
import Eyebrow from '@/components/Eyebrow/Eyebrow'
import styles from './Repertoire.module.css'

export default function Repertoire() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const didDrag = useRef(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenIndex(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openIndex])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stripRef.current) return
    isDragging.current = true
    didDrag.current = false
    dragStart.current = {
      x: e.pageX - stripRef.current.offsetLeft,
      scrollLeft: stripRef.current.scrollLeft,
    }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !stripRef.current) return
    e.preventDefault()
    const x = e.pageX - stripRef.current.offsetLeft
    const dx = x - dragStart.current.x
    if (Math.abs(dx) > 5) didDrag.current = true
    stripRef.current.scrollLeft = dragStart.current.scrollLeft - dx
  }

  const stopDrag = () => { isDragging.current = false }

  const titleBody = repertoire.title.zh.slice(0, -1)
  const titleLast = repertoire.title.zh.slice(-1)

  // Safe fallback: while openIndex is null the lightbox is hidden,
  // but we still need a valid work object to avoid conditional Image renders.
  const openWork = repertoire.works[openIndex ?? 0]

  return (
    <section id="repertoire" className={styles.section}>
      <div className={styles.head}>
        <Eyebrow label={repertoire.eyebrow} />
        <h2 className={styles.title}>
          {titleBody}<span className={styles.titleRed}>{titleLast}</span>
        </h2>
        <p className={styles.titleEn}>{repertoire.title.en}</p>
      </div>

      <div className={styles.filmstripOuter}>
        <div
          ref={stripRef}
          className={styles.filmstripWrap}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <div className={styles.filmstrip}>
            {repertoire.works.map((work, i) => (
              <div
                key={work.year}
                className={styles.filmCard}
                onClick={() => { if (!didDrag.current) setOpenIndex(i) }}
              >
                <Image
                  src={work.image}
                  alt={`${work.zh.join('')} – ${work.en}`}
                  width={280}
                  height={520}
                  className={styles.filmImg}
                  sizes="370px"
                />
                <div className={styles.filmGradient} />
                <div className={styles.filmOverlay} />
                <div className={styles.expandIcon}>
                  <svg viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
                <div className={styles.filmCaption}>
                  <div className={styles.year}>{work.year}</div>
                  <div className={styles.cnTitle}>{work.zh.join('')}</div>
                  <div className={styles.enTitle}>{work.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.scrollHint}>drag to explore · click to expand</p>

      {/* Lightbox — always rendered, toggled via .lightboxOpen */}
      <div
        className={`${styles.lightbox}${openIndex !== null ? ` ${styles.lightboxOpen}` : ''}`}
        onClick={() => setOpenIndex(null)}
      >
        <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
          <div className={styles.lbImgWrap}>
            <Image
              src={openWork.image}
              alt={`${openWork.zh.join('')} – ${openWork.en}`}
              width={460}
              height={560}
              className={styles.lbImg}
              sizes="460px"
            />
          </div>
          <div className={styles.lbMeta}>
            <div className={styles.lbYear}>{openWork.year}</div>
            <div className={styles.lbCn}>{openWork.zh.join('')}</div>
            <div className={styles.lbEn}>{openWork.en}</div>
          </div>
          <button className={styles.lbClose} onClick={() => setOpenIndex(null)}>✕</button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add content/home.ts public/assets/gallery/ components/Repertoire/Repertoire.tsx components/Repertoire/Repertoire.module.css
git commit -m "feat: replace Repertoire text grid with horizontal gallery filmstrip

- Horizontal filmstrip with uniform cards (280px → 370px accordion on hover)
- Overlay captions: year, Chinese title, English title fade in on hover
- Lightbox opens on card click; closes on backdrop click or Escape
- Drag-to-scroll for mouse; native touch scroll for mobile
- Placeholder images from picsum.photos

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Verify in browser

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000` and scroll to the Repertoire section.

- [ ] **Step 2: Check accordion hover**

Hover each card — confirm it expands from ~280px to ~370px and the other cards are pushed right. Year and English title should fade in. Expand icon should appear top-right.

- [ ] **Step 3: Check drag-to-scroll**

Click and drag the filmstrip left — confirm the cards scroll without opening the lightbox.

- [ ] **Step 4: Check lightbox open/close**

Click a card — confirm the lightbox fades in with the correct title and image. Test three close methods:
1. Click the `✕` button
2. Click the dark backdrop
3. Press `Escape`

All three should fade the lightbox out smoothly.

- [ ] **Step 5: Production build**

```bash
npm run build
```

Expected: no TypeScript errors, no lint errors, build completes successfully.