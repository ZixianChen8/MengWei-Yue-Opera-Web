# Desktop Full-Screen Navigation Menu — Design Spec

**Date:** 2026-07-11  
**Status:** Approved for planning  
**Scope:** Desktop (≥1024px) full-screen cinematic nav overlay, site-wide. Mobile/tablet BubbleMenu unchanged.

## Goal

When the user clicks the desktop menu button, open a bold, full-viewport navigation overlay that expands downward from the top of the screen. Interaction and layout are inspired by a reference full-screen menu (two-column media + nav, curved panel entrance, masked staggered reveals). All visual decisions use the Meng Wei Yue Opera design system (ink-wash / parchment / vermillion)—not the reference brand’s colors, typography, or motorsport aesthetic.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Architecture | Extend existing `Nav` (Approach 1) |
| Desktop chrome | Logo left, menu toggle **right**; replace inline link row |
| Mobile (≤1023px) | Unchanged — site-wide `BubbleMenu` |
| Left media | Up to 4 photos from `galleryPage.photos` |
| Supporting content | Footer contact mailto only |
| Animation | GSAP (already in project), single coordinated timeline |
| Home page | Replace stub `LandingMenu` with `<Nav />` |

## Current context

- **Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, GSAP.
- **Desktop today:** `Nav` shows inline bilingual links (`writing-mode: vertical-rl` on overlay variant; horizontal on `variant="horizontal"`). No hamburger ≥1024px.
- **Mobile today:** `Nav` hidden ≤1023px; `BubbleMenu` in `app/layout.tsx` provides navigation.
- **Home:** `app/page.tsx` uses unfinished `LandingMenu` instead of `Nav`.
- **Content:** `nav.links` in `content/data/home.json`; gallery photos in `content/data/gallery.json`; contact `mailto:mwyueos@gmail.com` under footer “To Reach Us · 留书”.
- **Tokens:** `--paper`, `--ink`, `--seal`, Chinese display/body + Latin display fonts in `globals.css`.

## Architecture

### Component ownership

All desktop overlay logic lives in `components/Nav/`:

- `Nav.tsx` — open state machine, toggle, overlay markup, a11y, GSAP timeline wiring
- `Nav.module.css` — desktop chrome + overlay layout; mobile rules remain BubbleMenu-gated (`display: none` on `.nav` ≤1023px)

Optional internal helpers (only if `Nav.tsx` becomes unwieldy):

- `useDesktopMenuMotion.ts` — timeline build / play / reverse / kill
- Small presentational fragments for media grid / link list (same folder)

Do **not** introduce a parallel `FullScreenMenu` route or a second site-wide desktop header.

### Page integration

- Every page that already mounts `<Nav />` inherits the new desktop behavior.
- `app/page.tsx`: remove `LandingMenu`; mount `<Nav />` (default overlay variant over the hero).
- `LandingMenu` can be deleted or left unused; prefer removal once Nav covers home.
- `/admin` is unchanged (no public Nav / BubbleMenu pattern today).

### Breakpoint contract

| Width | Navigation |
|---|---|
| ≥1024px | `Nav`: logo + right toggle + full-screen overlay |
| ≤1023px | `BubbleMenu` only; `Nav` stays hidden |

If the desktop menu is open and the viewport crosses below 1024px, force-close the overlay, clear scroll lock / focus trap, and leave mobile to BubbleMenu. Never show both menus.

## Desktop header chrome

- **Left:** Existing brand `Image` + `NAV_BRANDS` (`default` / `anniversary`).
- **Right:** Circular or icon button consistent with existing ink trigger language (adapt from current mobile trigger styling for desktop visibility on paper and on dark `horizontal` bars).
- **Center:** Empty — no inline `nav.links` row on desktop.
- Toggle remains visible above the overlay (`z-index` above panel). Icon morphs hamburger ↔ close.
- While open, keep sufficient contrast (ink on paper; on `horizontal` ink bar, keep paper-on-ink or invert as today for mobile trigger).
- No second duplicate header inside the panel unless required for focus order; prefer single persistent logo + toggle.

## Overlay structure

```
[fixed panel: paper surface, inset 0, 100dvh]
  [two-column body]
    [left ~45–52%: media grid]
    [right ~48–55%: primary nav + contact]
```

- `position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index` above page, below or coordinated with toggle/logo.
- Blocks pointer events to content underneath.
- Locks document scroll (and coordinates with Lenis if active: body overflow + any existing Lenis stop pattern used elsewhere).
- Background: `var(--paper)` (or a token-derived paper surface). No reference dark olive/charcoal.

### Left — media

- Up to four images from `galleryPage.photos` (prefer photos flagged `home: true` when present, then fill from remaining list order; if fewer than four, render available cells without empty placeholders).
- Layout: 2×2 when four; adapt to 2 / 1 columns when fewer.
- `next/image`, `object-fit: cover`, meaningful `alt` from photo title/description.
- No desaturation, olive tint, or motorsport crop language. Match site image treatment (no new card chrome).

### Right — navigation

- Semantic `<nav>` listing `nav.links`.
- Large bilingual labels: Chinese (`--font-chinese-display` or body display role used for section titles) primary; English (`--font-latin-display`) secondary, following existing casing (English uppercase where the site already does).
- Active route: `usePathname()` + `aria-current="page"`; visual vermillion indicator (underline or seal-line), animated after the active label reveals—not neon.
- Below stack: single supporting link from footer contact — label e.g. “留书 · Contact” / email text, `href` = `mailto:mwyueos@gmail.com`. Use existing link/hover tokens; smaller than primary items.
- No decorative social row, store button, or fake emblem unless already in content (out of scope).

## Motion

Library: **GSAP** (already used in `BubbleMenu` and landing scroll stories). Prefer one timeline with labels; respect `prefers-reduced-motion`.

### State machine

`closed` | `opening` | `open` | `closing`

- Ignore or debounce toggles while `opening`/`closing`, or safely reverse the same timeline—never leave scroll locked or focus trapped after close.
- Single timeline instance; kill/rebuild on unmount; no duplicate timelines across re-renders.

### Open sequence (~700–900ms panel)

1. Toggle → close icon  
2. Panel moves down from above viewport; lower edge slightly bowed (animated `clip-path` or SVG path), flattens at rest  
3. Media cells reveal from compressed masks (overflow hidden), stagger ~70–90ms, subtle translate/scale  
4. Nav labels rise through overflow-hidden masks, stagger ~60–80ms  
5. Active indicator animates in  
6. Contact link reveals last  

Ease: strong ease-out akin to `cubic-bezier(0.76, 0, 0.24, 1)` / GSAP `power3.out`–`power4.out`. Prefer animating `transform`, `opacity`, `clip-path`, `autoAlpha`—not layout geometry.

### Close sequence (slightly faster)

1. Hide contact  
2. Retract active indicator  
3. Mask-hide nav labels (reverse stagger)  
4. Collapse media masks  
5. Panel retracts upward with bow reintroduced  
6. Restore hamburger  
7. Unlock scroll; restore focus to toggle  

### Reduced motion

No curved panel motion (or instantaneous panel); short fades; minimal/no stagger; full functionality preserved.

## Accessibility

- Toggle: accessible name (bilingual), `aria-expanded`, `aria-controls` pointing at overlay id  
- Overlay: `role="dialog"`, `aria-modal="true"`, labeled  
- Escape closes  
- Focus trap while open; restore focus to toggle on close  
- Keyboard-reachable links; visible `:focus-visible` using existing seal outline pattern  
- Selecting a nav link closes the menu (coordinate with route change)  
- Sufficient contrast on paper / ink / seal  

## Edge cases

| Case | Behavior |
|---|---|
| 0–3 gallery photos | Render available; grid adapts |
| Long Chinese labels (e.g. anniversary) | Wrap or scale within nav column; no overflow past viewport |
| Rapid clicks | State machine + one timeline |
| Resize across 1024px while open | Force close; BubbleMenu owns mobile |
| `horizontal` / anniversary brand | Same desktop chrome pattern; brand image from `NAV_BRANDS` |
| Slow image load | Masks still animate; images can appear into already-open cells |

## Out of scope

- Redesigning or replacing `BubbleMenu` / mobile navigation  
- New color system, fonts, or icon libraries  
- Character-by-character text animation  
- Social link rows or reference-site decorative graphics  
- Admin dashboard navigation  

## Verification checklist

- [ ] Open / close on desktop all public pages (home, events, gallery, about, anniversary)  
- [ ] Rapid toggle does not stick open, frozen, or scroll-locked  
- [ ] Escape, focus trap, focus restore  
- [ ] Active link + mailto contact  
- [ ] Gallery media (including &lt;4 photos)  
- [ ] Resize desktop ↔ mobile while open  
- [ ] `prefers-reduced-motion`  
- [ ] Mobile BubbleMenu unchanged  
- [ ] Home no longer mounts `LandingMenu` stub  

## Implementation notes (non-binding)

Suggested order when planning:

1. Desktop chrome: hide inline menu, add right toggle (≥1024 only)  
2. Overlay markup + CSS two-column layout + a11y shell  
3. GSAP open/close timeline + state machine + scroll lock  
4. Gallery media wiring + contact link from footer content  
5. Home: swap `LandingMenu` → `Nav`; remove stub if unused  
6. Cross-breakpoint close + reduced motion + polish  

Exact file split and task breakdown belong in the implementation plan after this spec is accepted.
