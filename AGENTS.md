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

## Current Stack

- Next.js `16.2.6` with App Router only
- React `19.2.4` / React DOM `19.2.4`
- TypeScript `^5` with `strict: true`
- ESLint `^9` with `eslint-config-next` `16.2.6`
- Playwright `^1.60.0` is installed for QA/screenshot work, but there are no configured tests
- Styling uses CSS Modules plus global design tokens in `app/globals.css`
- Fonts are loaded via `next/font/google` plus one local font from `fonts/`

## Architecture

**Main marketing page.** `app/page.tsx` composes the home page as a vertical stack of section components:

```
[Nav + Hero wrapper] → Overture → About → Season → CloudBreak → Studio → Repertoire → Footer
```

`<Nav />` and `<Hero />` are wrapped in a shared `position: relative` div so that Nav (which is `position: absolute`) overlays the top of the Hero and scrolls away with it — it is **not** a persistent/sticky header.

There are also static event pages:

- `app/events/page.tsx` renders the full events listing via `components/EventsListing/EventsListing.tsx`
- `app/events/[id]/page.tsx` renders event detail pages from `season.events`
- `generateStaticParams()` maps `season.events[].id` to `/events/[id]`
- Next.js 16 passes route `params` as a Promise in this codebase; follow the existing `async` pattern in `app/events/[id]/page.tsx`
- `app/gallery/page.tsx` renders the photo gallery (剧照) via `components/Gallery/Gallery.tsx`

Static sub-pages (events, gallery, about) share the same shell as the home page: `<SmoothScroll />`, then a `position: relative` wrapper containing `<Nav />` and the page content, then `<Footer />`.

`app/layout.tsx` loads four Google Fonts via `next/font/google` and one local font via `next/font/local`, attaching CSS variables (`--font-ma-shan`, `--font-noto-serif-sc`, `--font-cormorant`, `--font-jetbrains`, `--font-bei-shi-da-shuo-wen-xiao-zhuan`) on `<html>`. `globals.css` maps these to semantic aliases (`--font-chinese-display`, `--font-chinese-body`, etc.) and defines all design tokens.

**Component structure:** Each component lives in `components/<Name>/` with a collocated `<Name>.module.css`. There are no shared layout primitives — each component handles its own spacing and positioning.

**Client boundary:** Components that use scroll/resize listeners or refs must have `'use client'` at the top. Server components such as Nav, Footer, Overture, About, Season, Studio, Repertoire, EventBanner, EventBody, and Eyebrow have no `'use client'` directive.

**Nav state:** Nav imports `nav.links` from `content/home.ts` and renders them with `next/link`. Current links are Home (`/`), Events (`/events`), Gallery (`/gallery`), Learn (`/#studio`), and About (`/about`). The logo also links to `/`. The logo is pinned to the left via `position: absolute`; menu items are centered.

`globals.css` sets `scroll-behavior: smooth` on `html, body`. The nav is not fixed, so sections do not need `scroll-margin-top` to clear a persistent header. Any existing `scroll-margin-top` declarations in section module CSS are legacy and can be removed.

**Scroll/animation pattern:** `components/SmoothScroll/SmoothScroll.tsx` intercepts wheel events and drives eased scrolling with `requestAnimationFrame`. `useScrollParallax` (`components/hooks/useScrollParallax.ts`) drives the Hero's multi-layer cloud system via `requestAnimationFrame` + direct DOM style mutation (no state updates). Components that need their own scroll effects (e.g. CloudBreak) implement the same RAF + passive scroll listener pattern inline rather than extending the hook.

## Content

Most page copy lives in `content/home.ts` as named exports. The gallery page is the exception: its copy lives in `content/gallery.ts` (`galleryPage` export). Components import directly from these files — never hardcode strings in components.

| Export | Used by | Shape notes |
|---|---|---|
| `nav` | Nav | `links[]` has `{ zh, en, href }`; Nav renders `next/link` anchors |
| `hero` | Hero | `titleChars[]` + `titleRedIndex` drive the vermillion character |
| `overture` | Overture | `stats[]` rendered as three figures |
| `season` | Season | `events[]` — set `feature: true` on the mainstage card |
| `studio` | Studio | `program[]` lists the three course levels |
| `repertoire` | Repertoire | `works[]` archive list |
| `footer` | Footer | `columns[]` for the two link columns |
| `eventsListingPage` | EventsListing | listing page header, years, months, archive |
| `eventPage` | EventBody | event detail labels and signup/back-link text |
| `galleryPage` (in `content/gallery.ts`) | Gallery | header, filter chips, lightbox labels, and `photos[]` |

When adding a new section or page copy, export its content from `content/home.ts` and import it into the relevant component. When adding or changing top-level navigation, update `nav.links` and verify the corresponding route or section anchor exists.

**Events:** Upcoming/current events live in `season.events[]`. The same array powers homepage cards, `/events`, and `/events/[id]`. Required fields include `id`, display titles, description/blurb, date/time/venue, `statusType`, `statusLabel`, `formUrl`, and `imageUrl`.

**Gallery:** The `/gallery` page (`components/Gallery/Gallery.tsx`, a `'use client'` component) renders `galleryPage.photos[]` from `content/gallery.ts` as a CSS masonry grid (`column-count`) with a sticky filter rail (by `cat`) and a keyboard-navigable lightbox. Photos currently use placeholder frames (brush glyph + mono tags), not real images.

**Repertoire:** Past-event/repertoire items live in `repertoire.works[]`. Some images are local (`/assets/gallery/*.jpg`), while others are still external `https://picsum.photos/...` placeholders.

**Admin/auth:** No admin authentication exists. There is no `/admin` route, no login/logout flow, no `middleware.ts`, no API route handlers, no session/cookie/JWT logic, and no auth provider dependency. Content changes are currently made by editing `content/home.ts` directly.

## Production / Admin Editing Recommendation

No production deploy config exists yet. For a client site, prefer a managed static/serverless host such as Vercel or Netlify connected to GitHub instead of a hand-managed VPS.

If admin editing is added, do **not** assume runtime filesystem writes persist in production. On serverless/static hosts, writable filesystem state is read-only or ephemeral at runtime, so edits should be persisted by writing back to GitHub or to a real external store.

Recommended admin persistence model:

- Store structured site content in repo files (`content/*.ts` now; JSON/MD files may be introduced if an editor needs safer serialization).
- Commit admin edits back to GitHub with a scoped token, triggering a redeploy.
- For low-volume client image uploads, commit images into `public/assets/...`.
- For frequent or large image uploads, store images in blob/media storage (Vercel Blob, Cloudflare R2, Cloudinary, etc.) and keep URLs in content.
- Expect Git-backed edits to appear after redeploy latency, usually around 1-2 minutes, rather than instantly.

Only choose a persistent Node server/VPS model if the client explicitly accepts server operations and backups. In that model, local JSON/image writes can work, but the project must also define backup, deployment, monitoring, and rollback procedures.

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

Cloud PNGs in `public/assets/` are very wide (≈3000px) and are sized with `sizes="110vw"` or `"120vw"` to allow overflow for parallax translation. `bg1-exp.webp` is the hero background figure. Always provide explicit `width`/`height` to `<Image>` for these files unless a component already uses `fill` deliberately.

Local gallery media currently lives in `public/assets/gallery/`. `next.config.ts` permits remote images from `picsum.photos` for placeholder event/repertoire images; replace those URLs with local or final production assets when available.

## Next.js 16 Notes

- App Router only — no `pages/` directory
- `allowedDevOrigins` in `next.config.ts` permits LAN preview from `192.168.2.159`
- Check `node_modules/next/dist/docs/01-app/` for App Router API reference before using any Next.js APIs
