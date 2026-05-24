# Repertoire Gallery — Design Spec
**Date:** 2026-05-13
**Status:** Approved

---

## Context

The current Repertoire section renders a 4-column text grid of opera works (year + Chinese title + English title). It contains no imagery and reads more like a data table than a showcase. The goal is to replace it with a visual gallery that puts performance photography front and centre while preserving the bilingual titling and the site's ink-wash (国风) aesthetic.

---

## Layout

**Horizontal filmstrip** with drag-to-scroll. All cards are uniform width; the strip overflows the section horizontally, allowing any number of works to be added without layout changes.

- Section padding: `0 80px 100px` — matching existing sections
- Filmstrip wrapper: `overflow-x: auto`, hidden scrollbar, drag-to-scroll via mouse events
- Right edge fades to `--paper` (`#F8F4EE`) with a CSS gradient overlay to hint at more cards
- Filmstrip inner: `display: flex; gap: 10px; min-width: max-content; padding-right: 80px`
- Strip height: `520px` fixed

---

## Cards

Each card is uniform: **280px wide × 520px tall**, `border-radius: 3px`, `overflow: hidden`.

### Hover — accordion expand
- Width transitions from `280px` → `370px` over `0.42s cubic-bezier(0.4, 0, 0.2, 1)`
- Other cards are pushed right (natural flex/scroll behaviour — no compression needed)
- Image subtly scales to `1.03` (`transform: scale`) on hover
- Vermillion sheen overlay fades in (`rgba(192,58,43,0.07)`)

### Caption (overlay)
Always-present gradient (`transparent → rgba(15,10,8,0.85)`) covers the bottom 65% of the card.
Caption content sits at the bottom of the card and slides up 6px on hover:

| Element | Style |
|---|---|
| Year | `10px`, `--font-mono`, `--seal` red, fades in on hover |
| Chinese title | `26px`, `--font-chinese-display`, `#F8F4EE`, always visible |
| English title | `10px`, uppercase, `rgba(248,244,238,0.65)`, fades in on hover |

An expand icon (SVG arrows, circular border) appears top-right on hover.

---

## Images

Placeholder images sourced from **Unsplash** — search query `"chinese opera performance"` or `"yue opera"`. One image per work, `object-fit: cover`.

In code, use Next.js `<Image>` with explicit `width={280}` `height={520}` and `sizes="370px"`. Alt text: Chinese title joined + English title.

Content shape in `content/home.ts` — add an `image` field to each work entry. The existing `zh` field is an array (e.g. `['何文', '秀']`) used for multi-line text rendering in the old layout. In the gallery component, join the array with `zh.join('')` to produce a single string (`何文秀`) for card and lightbox titles.

```ts
works: [
  { year: '2024', zh: ['何文', '秀'], en: 'He Wenxiu', image: '/assets/gallery/he-wenxiu.jpg' },
  ...
]
```

---

## Lightbox

Clicking any card opens a full-screen lightbox overlay.

**Structure:**
- Fixed overlay, `z-index: 100`, `background: rgba(15,10,8,0.92)`, fade in/out (`opacity` transition `0.35s`)
- Content slides up on open (`translateY(16px) → 0`)
- Left: large image (`460×560px`)
- Right: year in `--seal` red + divider line, large Chinese title (`52px`), English title below
- Close: circular `✕` button top-right; also closes on backdrop click or `Escape` key

**Implementation:** `'use client'` component. `useState<number | null>` tracks the open card index (`null` = closed). No third-party library.

**Drag-to-scroll:** Mouse drag is wired via `mousedown`/`mousemove` JS event listeners on the wrapper. Touch devices use native CSS overflow scroll — no touch event listeners needed.

---

## Component changes

| File | Change |
|---|---|
| `components/Repertoire/Repertoire.tsx` | Full rewrite. Add `'use client'`. Replace text grid with filmstrip + lightbox. |
| `components/Repertoire/Repertoire.module.css` | Full rewrite to filmstrip + lightbox styles. |
| `content/home.ts` | Add `image` field to each `works[]` entry. |

`app/page.tsx` and `app/globals.css` — **no changes needed.**

---

## Scroll hint text

Replace current section footer (none) with a centered line:

```
drag to explore · click to expand
```

Styled: `10px`, uppercase, `letter-spacing: 0.1em`, `--ink-faint`, flanked by `1px solid --border` rules (matching other section footer patterns).

---

## Verification

1. `npm run dev` — visit `http://localhost:3000`, scroll to Repertoire section
2. Hover each card: confirm expand animation and caption fade-in
3. Drag filmstrip left/right: confirm smooth scroll, right fade, no layout break
4. Click a card: confirm lightbox opens with correct title + image
5. Press `Escape` and click backdrop: confirm lightbox closes
6. `npm run build` — confirm no TypeScript or lint errors