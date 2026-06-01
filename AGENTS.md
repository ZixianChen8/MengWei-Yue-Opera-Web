<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: 孟伟越剧 · Meng Wei Yue Opera Studio

**Official name:** 加拿大孟伟越剧艺术传习所 (Meng Wei Yue Opera Studio Canada)
**Year of establishment:** 2016

Website for Ottawa's only Yue Opera company. **Next.js 16 / React 19 / TypeScript.** No database. The public site is a statically-rendered marketing site with scroll-driven animations; there is also a password-gated `/admin` content dashboard backed by a small set of API route handlers (admin auth/content/upload plus a contact form) and a GitHub-commit persistence layer. See **Admin dashboard** below.

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

**Data lives in JSON; the `.ts` modules are typed re-exports.** The editable values live in `content/data/home.json` and `content/data/gallery.json`. `content/home.ts` imports `./data/home.json` and re-exports each section (`nav`, `hero`, `season`, …) with the project's TypeScript types; `content/gallery.ts` does the same for `galleryPage`. Components import the named exports from `content/home.ts` / `content/gallery.ts` (never the JSON directly, never hardcoded strings). The `/admin` dashboard edits the JSON files (see **Admin dashboard**), so when adding a field, add it to the JSON **and** widen the matching type in the `.ts` module.

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

**Events:** Upcoming/current events live in `season.events[]`. The same array powers homepage cards, `/events`, and `/events/[id]`. Required fields include `id`, display titles, description/blurb, date/time/venue, `statusType`, `statusLabel`, `formUrl`, and two images: `imageUrl` (the `/events/[id]` hero banner, via `EventBanner`) and `cardImageUrl` (the `/events` listing card; falls back to the CSS `evImg` placeholder when empty). Both image keys surface the admin upload widget automatically (their names match `isImageKey` in `SectionForm`). The event-detail **QR code is generated at build time** by `EventBody` (an async server component) from `event.formUrl` using the `qrcode` package — there is no QR image field; editing `formUrl` updates the QR. A placeholder `formUrl` of `#` (or empty) renders the decorative CSS QR placeholder instead.

**Gallery:** The `/gallery` page (`components/Gallery/Gallery.tsx`, a `'use client'` component) renders `galleryPage.photos[]` from `content/gallery.ts` as a CSS masonry grid (`column-count`) with a sticky filter rail (by `cat`) and a keyboard-navigable lightbox. Photos currently use placeholder frames (brush glyph + mono tags), not real images.

**Repertoire:** Past-event/repertoire items live in `repertoire.works[]`. Some images are local (`/assets/gallery/*.jpg`), while others are still external `https://picsum.photos/...` placeholders.

## Admin dashboard

A password-gated content editor is implemented (it replaces hand-editing the data files). It commits edits straight back to GitHub, which is what triggers a redeploy on a Git-backed host.

**Routes & components:**

- `app/admin/login/` — login screen (`LoginForm` posts to `/api/admin/login`).
- `app/admin/(protected)/page.tsx` — dashboard listing the editable sections.
- `app/admin/(protected)/edit/[target]/[section]/page.tsx` — the per-section editor (`components/admin/SectionEditor` + `SectionForm` + `ImageUpload`, `LogoutButton`).
- API route handlers under `app/api/admin/`: `login`, `logout`, `content` (GET/POST a section), `upload` (image upload). Plus `app/api/contact/` for the contact form.

**Auth:** `proxy.ts` (Next 16's renamed `middleware`) gates `/admin/:path*` and `/api/admin/:path*` — it verifies an HMAC-signed session cookie, redirecting unauthenticated page requests to `/admin/login` and returning 401 for API requests; `/admin/login` and `/api/admin/login` are public. `lib/auth.ts` holds the cookie/session logic (Web Crypto HMAC, no session store, 8h TTL, `verifyPassword` against `ADMIN_PASSWORD`). `lib/admin-guard.ts` exports `isAdmin()` for defense-in-depth re-checks inside route handlers and server components — **always call `isAdmin()` at the top of any new `/api/admin/*` handler.**

**What is editable:** `lib/content-config.ts` is the registry — `SECTIONS[]` maps each `(target, section)` pair to its data file (`DATA_FILES`) and dashboard label/group. The content API only writes sections found via `findSection`, so **a new editable section must be added to `SECTIONS` before it can be saved.** `SectionForm` auto-renders the section's JSON tree: string keys matching `/image|imageurl|imgurl/i` (`isImageKey`) get the `ImageUpload` widget; keys in `ENUM_OPTIONS` (e.g. `statusType`, `cat`) get a dropdown; everything else is a text/number/checkbox/array editor.

**Persistence:** `lib/github.ts` is the persistence layer (GitHub Contents API). `getJsonFile`/`putFile` read and commit `content/data/*.json`; `/api/admin/upload` commits images to `public/assets/uploads/` and returns the path. Requires env vars `AUTH_SECRET`, `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` (and optional `GITHUB_BRANCH`, default `main`). Because the runtime filesystem on Vercel is read-only/ephemeral, edits are **not** written to disk — they are committed to the repo, and the live site updates only after the resulting redeploy (≈1–2 min). Uploads are capped at ~4 MB (Vercel body limit) and limited to jpeg/png/webp/gif/avif.

## Production / hosting notes

No production deploy config is committed yet. Use a managed Git-connected host (Vercel/Netlify) so the admin's GitHub-commit model triggers redeploys; set the env vars above. For larger/more frequent image uploads than the ~4 MB inline-commit path comfortably handles, move to blob/media storage (Vercel Blob, Cloudflare R2, Cloudinary) and keep URLs in content. A persistent Node server/VPS is only worth it if the client accepts owning backups, monitoring, and rollback.

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
