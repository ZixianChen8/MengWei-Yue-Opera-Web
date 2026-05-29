<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: 孟伟越剧 · Meng Wei Yue Opera Studio

**Official name:** 加拿大孟伟越剧艺术传习所 (Meng Wei Yue Opera Studio Canada)
**Year of establishment:** 2016

Website for Ottawa's only Yue Opera company. **Next.js 16 / React 19 / TypeScript.** No database, no API routes — static marketing site with scroll-driven animations.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint (eslint.config.mjs, next lint config)
npm run start    # serve production build
```

No test suite is configured.

## Architecture

**Single-page layout.** `app/page.tsx` composes the full page as a vertical stack of section components:

```
[Nav + Hero wrapper] → Overture → Season → CloudBreak → Studio → Repertoire → Footer
```

`<Nav />` and `<Hero />` are wrapped in a shared `position: relative` div so that Nav (which is `position: absolute`) overlays the top of the Hero and scrolls away with it — it is **not** a persistent/sticky header.

`app/layout.tsx` loads four Google Fonts via `next/font/google` and attaches them as CSS variables (`--font-ma-shan`, `--font-noto-serif-sc`, `--font-cormorant`, `--font-jetbrains`) on `<html>`. `globals.css` maps these to semantic aliases (`--font-chinese-display`, `--font-chinese-body`, etc.) and defines all design tokens.

**Component structure:** Each component lives in `components/<Name>/` with a collocated `<Name>.module.css`. There are no shared layout primitives — each component handles its own spacing and positioning.

**Client boundary:** Components that use scroll/resize listeners or refs must have `'use client'` at the top. Server components (Nav, Footer, Overture, Season, Studio, Repertoire, Eyebrow) have no `'use client'` directive.

**Nav scroll anchors:** Each section has an `id` attribute for in-page anchor navigation. The Nav renders links as `<a href="#id">` tags. Nav links are centered horizontally; the logo is pinned to the left via `position: absolute`. Mapping:

| Nav link | Section `id` |
|---|---|
| 关于本所 / About | `overture` |
| 演出剧目 / Performances | `season` |
| 传习课堂 / Studio | `studio` |
| 名家行迹 / Director | `repertoire` *(placeholder — no Director section yet)* |
| 近期消息 / Journal | `footer` *(placeholder — no Journal section yet)* |

`globals.css` sets `scroll-behavior: smooth` on `html, body`. The nav is not fixed, so sections do not need `scroll-margin-top` to clear a persistent header. Any existing `scroll-margin-top` declarations in section module CSS are legacy and can be removed.

**Parallax pattern:** `useScrollParallax` (`components/hooks/useScrollParallax.ts`) drives the Hero's multi-layer cloud system via `requestAnimationFrame` + direct DOM style mutation (no state updates). Components that need their own scroll effects (e.g. CloudBreak) implement the same RAF + passive scroll listener pattern inline rather than extending the hook.

## Content

All page copy lives in `content/home.ts` as named exports. Components import directly from there — never hardcode strings in components.

| Export | Used by | Shape notes |
|---|---|---|
| `nav` | Nav | `links[]` has `{ zh, en, href }` — `href` is the scroll anchor |
| `hero` | Hero | `titleChars[]` + `titleRedIndex` drive the vermillion character |
| `overture` | Overture | `stats[]` rendered as three figures |
| `season` | Season | `events[]` — set `feature: true` on the mainstage card |
| `studio` | Studio | `program[]` lists the three course levels |
| `repertoire` | Repertoire | `works[]` archive list |
| `footer` | Footer | `columns[]` for the two link columns |

When adding a new section, export its content from `content/home.ts` and add the section `id` + `href` to the `nav.links` array.

## Design System

`design-system/MASTER.md` is the canonical reference. The mobile design system is [`design-system/mobile-design-system.md`](design-system/mobile-design-system.md). The actual CSS tokens in `globals.css` are the source of truth — some names differ from MASTER.md (e.g. `--paper` instead of `--color-bg`, `--seal` instead of `--color-vermillion`).

**Aesthetic:** Chinese ink-wash (国风). Key constraints from the design system:

- Background is parchment cream (`--paper: #F8F4EE`), never white
- Accent is vermillion (`--seal: #C03A2B`), never bright or neon colors
- All decoration is organic/botanical — no geometric shapes, no glassmorphism
- No emoji as icons; use SVG or CJK glyphs
- Noise texture and radial gradient overlays are applied globally via `body::before` / `body::after` in `globals.css`

**Global keyframes** (`float`, `drop`) must stay in `globals.css` — CSS Modules mangles animation names, so any keyframe referenced across components belongs there.

**Fonts:** CJK copy always uses `--font-chinese-display` (Ma Shan Zheng, display/headings) or `--font-chinese-body` (Noto Serif SC, body). Never use Latin-only fonts for Chinese text.

## Assets

Cloud PNGs in `public/assets/` are very wide (≈3000px) and are sized with `sizes="110vw"` or `"120vw"` to allow overflow for parallax translation. `bg1-exp.png` is the hero background figure. Always provide explicit `width`/`height` to `<Image>` for these files — they do not use `fill` layout except for `bg1-exp.png`.

## Next.js 16 Notes

- App Router only — no `pages/` directory
- `allowedDevOrigins` in `next.config.ts` permits LAN preview from `192.168.2.159`
- Check `node_modules/next/dist/docs/01-app/` for App Router API reference before using any Next.js APIs
