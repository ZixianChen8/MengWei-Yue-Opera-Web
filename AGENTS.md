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

Special-event hubs (the 10th-anniversary template) live under `/special/[slug]`:

- `app/special/[slug]/page.tsx` — hub
- `app/special/[slug]/booklet|programme|appreciation/page.tsx` — optional sub-pages
- `generateStaticParams()` maps `specials.items[].slug` (sub-pages only emit enabled tabs)
- Disabled tabs 404; `/anniversary` and `/anniversary/:path*` permanently redirect to `/special/10th-anniversary`

Static sub-pages (events, gallery, about) share the same shell as the home page: `<SmoothScroll />`, then a `position: relative` wrapper containing `<Nav />` and the page content, then `<Footer />`.

`app/layout.tsx` loads four Google Fonts via `next/font/google` and one local font via `next/font/local`, attaching CSS variables (`--font-ma-shan`, `--font-noto-serif-sc`, `--font-cormorant`, `--font-jetbrains`, `--font-bei-shi-da-shuo-wen-xiao-zhuan`) on `<html>`. `globals.css` maps these to semantic aliases (`--font-chinese-display`, `--font-chinese-body`, etc.) and defines all design tokens.

**Component structure:** Each component lives in `components/<Name>/` with a collocated `<Name>.module.css`. There are no shared layout primitives — each component handles its own spacing and positioning.

**Client boundary:** Components that use scroll/resize listeners or refs must have `'use client'` at the top. The landing sections `Overture`, `About`, `Season`, `Studio`, and `Repertoire` are `'use client'` because each mounts a GSAP scroll-storytelling context (see **Scroll/animation pattern**); they are imported **only** by `app/page.tsx`, so this does not affect the static sub-pages. Shared chrome (`Nav`, `Footer`) and other content components (`EventBanner`, `EventBody`, `Eyebrow`) remain server components with no `'use client'` directive.

**Nav state:** Nav, BubbleMenu, and Footer render `siteNavLinks` from `lib/nav-links.ts`. That helper starts from `nav.links` (admin → **导航**), strips leftover `/anniversary` or `/special/*` entries, and inserts specials with `showInNav` **before** `/about`. Special-event nav titles are edited on each special (admin → **特别活动**), not in `nav.links`. The logo is pinned to the left via `position: absolute`; menu items are centered. On `/special/[slug]` the logo/href come from that event (`logo` or the studio mark).

`globals.css` sets `scroll-behavior: smooth` on `html, body`. The nav is not fixed, so sections do not need `scroll-margin-top` to clear a persistent header. Any existing `scroll-margin-top` declarations in section module CSS are legacy and can be removed.

**Scroll/animation pattern:** `components/SmoothScroll/SmoothScroll.tsx` provides site-wide Lenis eased scrolling and, via its `LenisExtras` child, bridges Lenis to GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + `ScrollTrigger` refresh → `lenis.resize()`). Because Lenis only runs on desktop pointer devices (off below 768px, under `prefers-reduced-motion`, and on `/admin`), ScrollTrigger simply falls back to native scroll in those cases. `useScrollParallax` (`components/hooks/useScrollParallax.ts`) drives the Hero's multi-layer cloud transition with GSAP + ScrollTrigger, animating only transforms/opacity and respecting `prefers-reduced-motion`. Components that need small independent scroll effects (e.g. CloudBreak) may still use a local RAF + passive scroll listener pattern when GSAP orchestration is unnecessary.

**Landing scroll-storytelling layer:** The five landing sections share `components/hooks/scrollStory.ts` (motion tokens `STORY_EASE`/`REVEAL_DUR`/`REVEAL_Y`, the `revealBatch(scope, selector)` `ScrollTrigger.batch` fade/rise helper, and the three `matchMedia` breakpoint constants `MM_DESKTOP`/`MM_MOBILE`/`MM_REDUCED`). Every section runs its GSAP inside a `gsap.context(scope)` + `gsap.matchMedia()` and returns `ctx.revert()` + `media.revert()` on unmount, mirroring `useScrollParallax`. The three motion tiers are: **desktop** (`≥1024px`, no-preference) = full cinematic incl. pins; **mobile** (`≤1023px`, no-preference) = reveals + light parallax, **no pins**; **reduced-motion** = everything visible, no transforms/pins. Only transform/opacity are animated. Per section: Overture/About/Season are reveal + scrub-parallax (no pin); **Studio** is a desktop-pinned chapter (`start: 'top top'`, `end: '+=120%'`, `scrub`) whose timeline scrubs background parallax → title → body → the three program rows one-by-one → CTA; **Repertoire** is a desktop-pinned horizontal-scroll chapter that translates `.filmstrip` on `x` from vertical scroll (distance = `scrollWidth − clientWidth`, `scrub`, `invalidateOnRefresh`). While Repertoire's pin is active it stands the native scroller down (removes `data-lenis-prevent`, sets `overflow-x: hidden`, hides the RAF arrow controls); on mobile/reduced-motion the strip stays a normal horizontal scroller driven by the arrow buttons + RAF. On these landing sections GSAP fully owns the animated elements — they are **not** wrapped in `Reveal` (which stays intact for the shared chrome / sub-pages).

## Content

**Data lives in JSON; the `.ts` modules are typed re-exports.** The editable values live in `content/data/home.json`, `content/data/gallery.json`, and `content/data/specials.json`. `content/home.ts` imports `./data/home.json` and re-exports each section (`nav`, `hero`, `season`, …) with the project's TypeScript types; `content/gallery.ts` does the same for `galleryPage`; `content/specials.ts` exports `specials` plus helpers (`getSpecial`, `enabledTabs`, `specialHref`). Components import the named exports from those modules (never the JSON directly, never hardcoded strings). The `/admin` dashboard edits the JSON files (see **Admin dashboard**), so when adding a field, add it to the JSON **and** widen the matching type in the `.ts` module.

| Export | Used by | Shape notes |
|---|---|---|
| `nav` | Nav | `links[]` has `{ zh, en, href }`; Nav renders `next/link` anchors |
| `hero` | Hero | `titleChars[]` + `titleRedIndex` drive the vermillion character |
| `overture` | Overture | `stats[]` rendered as three figures |
| `season` | Season | `events[]` — set `home: true` to pin an event to the home page section (max 3) |
| `studio` | Studio | `program[]` lists the three course levels |
| `repertoire` | Repertoire | `works[]` archive list |
| `footer` | Footer | `columns[]` for the two link columns |
| `eventsListingPage` | EventsListing | listing page header, years, months, archive |
| `eventPage` | EventBody | event detail labels and signup/back-link text |
| `galleryPage` (in `content/gallery.ts`) | Gallery | header, filter chips, lightbox labels, and `photos[]` |
| `specials` (in `content/specials.ts`) | `/special/[slug]` | `items[]` of anniversary-style hubs; each has slug, nav titles, tab toggles, hub / booklet / programme / appreciation |

When adding a new section or page copy, export its content from `content/home.ts` and import it into the relevant component. When adding or changing top-level navigation, edit `nav.links` (admin → **导航**) and/or a special's `showInNav` + `navZh`/`navEn`.

**Events:** Upcoming/current events live in `season.events[]`. The same array powers homepage cards, `/events`, and `/events/[id]`. Required fields include `id`, display titles, description/blurb, date/time/venue, `statusType`, `statusLabel`, `formUrl`, and two images: `imageUrl` (the `/events/[id]` hero banner, via `EventBanner`) and `cardImageUrl` (the `/events` listing card; falls back to the CSS `evImg` placeholder when empty). Both image keys surface the admin upload widget automatically (their names match `isImageKey` in `SectionForm`). The event-detail **QR code is generated at build time** by `EventBody` (an async server component) from `event.formUrl` using the `qrcode` package — there is no QR image field; editing `formUrl` updates the QR. A placeholder `formUrl` of `#` (or empty) renders the decorative CSS QR placeholder instead.

The home page **Season** section shows exactly 3 events via `selectHomeEvents` in `components/Season/Season.tsx`: events flagged `home: true` come first (in list order, capped at 3), then the earliest unflagged events fill the remaining slots up to 3. With 0 flagged it shows the first 3; with fewer than 3 events total it shows all. The admin "Events" editor caps `home` ticks at 3 (enforced by `ARRAY_LIMITS` in `SectionForm`).

**Gallery:** The `/gallery` page (`components/Gallery/Gallery.tsx`, a `'use client'` component) renders `galleryPage.photos[]` from `content/gallery.ts` as a CSS masonry grid (`column-count`) with a sticky filter rail (by `cat`) and a keyboard-navigable lightbox. Photos currently use placeholder frames (brush glyph + mono tags), not real images.

**Repertoire:** Past-event/repertoire items live in `repertoire.works[]`. Some images are local (`/assets/gallery/*.jpg`), while others are still external `https://picsum.photos/...` placeholders.

## Admin dashboard

A password-gated content editor is implemented (it replaces hand-editing the data files). It commits edits straight back to GitHub, which is what triggers a redeploy on a Git-backed host.

**Routes & components:**

- `app/admin/login/` — login screen (`LoginForm` posts to `/api/admin/login`).
- `app/admin/(protected)/page.tsx` — dashboard listing the editable sections.
- `app/admin/(protected)/edit/[target]/[section]/page.tsx` — the per-section editor (`components/admin/SectionEditor` + `SectionForm` + `ImageUpload`, `LogoutButton`).
- `app/admin/(protected)/specials/` — list / create / settings / per-part editors for special-event hubs.
- API route handlers under `app/api/admin/`: `login`, `logout`, `content` (GET/POST a section), `specials` (list/create/reorder/update/delete), `upload` (image upload). Plus `app/api/contact/` for the contact form.

**Auth:** `proxy.ts` (Next 16's renamed `middleware`) gates `/admin/:path*` and `/api/admin/:path*` — it verifies an HMAC-signed session cookie, redirecting unauthenticated page requests to `/admin/login` and returning 401 for API requests; `/admin/login` and `/api/admin/login` are public. `lib/auth.ts` holds the cookie/session logic (Web Crypto HMAC, no session store, 8h TTL, `verifyPassword` against `ADMIN_PASSWORD`). `lib/admin-guard.ts` exports `isAdmin()` for defense-in-depth re-checks inside route handlers and server components — **always call `isAdmin()` at the top of any new `/api/admin/*` handler.**

**What is editable:** `lib/content-config.ts` is the registry — `SECTIONS[]` maps each `(target, section)` pair to its data file (`DATA_FILES`) and dashboard label/group. The content API only writes sections found via `findSection`, so **a new editable section must be added to `SECTIONS` before it can be saved.** Special events are a dedicated flow (`/admin/specials` + `/api/admin/specials`) rather than a generic `SECTIONS` tree, because each item is a large hub + booklet + programme + appreciation document. `SectionForm` auto-renders JSON trees: string keys matching `/image|imageurl|imgurl/i` (`isImageKey`) get the `ImageUpload` widget; keys in `ENUM_OPTIONS` (e.g. `statusType`, `cat`) get a dropdown; everything else is a text/number/checkbox/array editor.

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
- For every visual modification, verify the mobile version looks polished and coherent, with no broken layout, cramped spacing, clipped text, or overlapping elements.
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
