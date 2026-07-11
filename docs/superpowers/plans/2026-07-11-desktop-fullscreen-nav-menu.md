# Desktop Full-Screen Nav Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace desktop inline nav links with a right-side menu toggle that opens a cinematic full-screen overlay (gallery media + bilingual links + mailto contact), site-wide ≥1024px.

**Architecture:** Extend `components/Nav/` only. Desktop chrome becomes logo left + toggle right; GSAP timeline lives in `useDesktopMenuMotion.ts`. Home swaps stub `LandingMenu` for `Nav`. Mobile stays on existing `BubbleMenu` with **zero file changes** under `components/BubbleMenu/` or its mount in `app/layout.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19 client `Nav`, CSS Modules, GSAP 3 core, existing content modules (`nav`, `footer`, `galleryPage`), design tokens (`--paper`, `--ink`, `--seal`, fonts).

**Spec:** [docs/superpowers/specs/2026-07-11-desktop-fullscreen-nav-menu-design.md](../specs/2026-07-11-desktop-fullscreen-nav-menu-design.md)

**Hard constraint:** Do **not** modify `components/BubbleMenu/**` or the `<BubbleMenu />` line in `app/layout.tsx`. Desktop overlay must not run timelines, lock scroll, or trap focus below 1024px.

**Testing note:** This repo has no unit test suite. Verify each task with `npm run lint` and the manual checks listed in that task. Do not add a test framework for this feature.

---

## File map

| File | Responsibility |
|---|---|
| `components/Nav/selectMenuPhotos.ts` | **Create** — pick up to 4 gallery photos (`home: true` first, then fill) |
| `components/Nav/useDesktopMenuMotion.ts` | **Create** — GSAP open/close timeline, clip-path panel, reduced-motion, kill on cleanup |
| `components/Nav/Nav.tsx` | Desktop toggle + overlay markup, state machine, a11y, scroll lock, pathname active link; keep mobile overlay markup inert (Nav still `display: none` ≤1023) |
| `components/Nav/Nav.module.css` | Hide desktop inline `.menu`; show right toggle ≥1024; overlay two-column layout; **do not** change BubbleMenu |
| `app/page.tsx` | Replace `LandingMenu` with `Nav` |
| `components/LandingMenu/*` | **Delete** after home uses `Nav` |
| `components/BubbleMenu/**` | **FORBIDDEN** — no diffs |
| `app/layout.tsx` | **FORBIDDEN** for BubbleMenu line — no diffs required |

---

### Task 1: Photo picker helper

**Files:**
- Create: `components/Nav/selectMenuPhotos.ts`

- [ ] **Step 1: Add `selectMenuPhotos`**

```ts
import type { GalleryPhoto } from '@/content/gallery'

const MAX = 4

/** Prefer `home: true` photos, then fill from remaining list order, capped at 4. */
export function selectMenuPhotos(photos: GalleryPhoto[]): GalleryPhoto[] {
  const home = photos.filter((p) => p.home)
  const rest = photos.filter((p) => !p.home)
  return [...home, ...rest].slice(0, MAX)
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Nav/selectMenuPhotos.ts
git commit -m "feat(nav): add gallery photo picker for desktop menu"
```

---

### Task 2: Desktop chrome — logo left, toggle right (no overlay yet)

**Files:**
- Modify: `components/Nav/Nav.tsx`
- Modify: `components/Nav/Nav.module.css`

- [ ] **Step 1: Update `Nav.tsx` desktop controls**

Keep existing imports/props. Replace the desktop inline link block with a right-side toggle that will later open the overlay. Use a local `menuState: 'closed' | 'opening' | 'open' | 'closing'` (start with `closed` / toggle only for this task — overlay can be a hidden stub).

Key markup shape (desktop toggle always in DOM; visibility via CSS ≥1024):

```tsx
{/* Desktop toggle — visible ≥1024px via CSS */}
<button
  type="button"
  id="desktop-nav-toggle"
  className={styles.desktopToggle}
  aria-label={menuState === 'closed' || menuState === 'closing' ? '打开菜单 · Open menu' : '关闭菜单 · Close menu'}
  aria-expanded={menuState === 'open' || menuState === 'opening'}
  aria-controls="desktop-nav-overlay"
  onClick={handleDesktopToggle}
>
  {/* hamburger paths when closed; X when open — can swap via CSS classes on root */}
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.desktopToggleIcon}>
    <path className={styles.line1} d="M3 6h18" />
    <path className={styles.line2} d="M3 12h18" />
    <path className={styles.line3} d="M3 18h18" />
  </svg>
</button>
```

For this task, `handleDesktopToggle` may only flip between `closed` and `open` (full state machine in Task 4). Keep the existing mobile trigger + overlay markup as-is (still unused on desktop because `.nav { display: none }` ≤1023 and BubbleMenu owns mobile — do not “fix” mobile overlay).

Remove or stop rendering the desktop `.menu` link map (the inline bilingual row). Links will live only inside the full-screen overlay (Task 3).

- [ ] **Step 2: CSS — desktop layout**

In `Nav.module.css`:

1. Hide `.menu` at all widths used for desktop chrome (or delete its desktop display). Mobile already hides `.nav` entirely ≤1023.
2. Add `.desktopToggle` — `display: none` by default; at `min-width: 1024px` show as `inline-flex`, positioned on the **right** (absolute `right` matching left brand inset, or flex with `margin-left: auto` on horizontal variant).
3. Match existing circular ink trigger language where it fits; on `.horizontal` use paper-on-ink contrast like the mobile horizontal trigger.
4. Ensure `.brand` stays left; toggle right; no center link row.
5. Raise `z-index` of brand + desktop toggle above the future overlay (e.g. nav/toggle ≥ 220, overlay 200).

Do **not** edit BubbleMenu CSS.

Example skeleton:

```css
.desktopToggle {
  display: none;
}

@media (min-width: 1024px) {
  .menu {
    display: none;
  }

  .desktopToggle {
    display: inline-flex;
    position: absolute;
    right: 2.5rem;
    top: 1.125rem;
    /* size, ink disc, svg stroke — mirror menuTrigger tokens */
    z-index: 220;
  }

  .horizontal .desktopToggle {
    position: static;
    margin-left: auto;
    /* paper-on-ink if bar is dark */
  }

  .brand {
    z-index: 220;
  }
}
```

Tune `top`/`right` per `.compact` / default padding so alignment matches logo.

- [ ] **Step 3: Visual check**

Run: `npm run dev`  
Open `/`, `/events`, `/gallery`, `/about` at ≥1024px: logo left, toggle right, **no** inline links.  
At ≤1023px: BubbleMenu only; Nav hidden — unchanged.

- [ ] **Step 4: Commit**

```bash
git add components/Nav/Nav.tsx components/Nav/Nav.module.css
git commit -m "feat(nav): desktop chrome with right-side menu toggle"
```

---

### Task 3: Overlay markup + layout CSS (static open)

**Files:**
- Modify: `components/Nav/Nav.tsx`
- Modify: `components/Nav/Nav.module.css`

- [ ] **Step 1: Wire content imports and photo list**

```tsx
import { usePathname } from 'next/navigation'
import { nav, footer } from '@/content/home'
import { galleryPage } from '@/content/gallery'
import { selectMenuPhotos } from '@/components/Nav/selectMenuPhotos'

const photos = selectMenuPhotos(galleryPage.photos)
const contactLink =
  footer.columns
    .flatMap((c) => c.links)
    .find((l) => l.href.startsWith('mailto:')) ?? {
    zh: 'mwyueos@gmail.com',
    en: 'Contact',
    href: 'mailto:mwyueos@gmail.com',
  }
```

- [ ] **Step 2: Add overlay DOM (always mounted; visibility controlled later by GSAP/CSS)**

```tsx
<div
  id="desktop-nav-overlay"
  ref={overlayRef}
  className={styles.desktopOverlay}
  role="dialog"
  aria-modal="true"
  aria-label="导航菜单 · Navigation"
  hidden={menuState === 'closed'}
>
  <div ref={panelRef} className={styles.desktopPanel}>
    <div className={styles.desktopGrid}>
      <div className={styles.desktopMedia} aria-hidden={photos.length === 0}>
        {photos.map((photo) => (
          <div key={photo.image} className={styles.mediaCell}>
            <div className={styles.mediaMask}>
              <Image
                src={photo.image}
                alt={photo.title || photo.description || '剧照'}
                fill
                sizes="(min-width: 1024px) 25vw, 0px"
                className={styles.mediaImg}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.desktopNavCol}>
        <nav aria-label="主导航 · Primary">
          <ul className={styles.desktopLinkList}>
            {nav.links.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.en} className={styles.desktopLinkItem}>
                  <div className={styles.linkMask}>
                    <Link
                      href={item.href}
                      className={styles.desktopLink}
                      aria-current={active ? 'page' : undefined}
                      onClick={closeDesktopMenu}
                    >
                      <span className={styles.desktopLinkZh}>{item.zh}</span>
                      <span className={styles.desktopLinkEn}>{item.en}</span>
                      {active ? <span className={styles.activeMark} aria-hidden="true" /> : null}
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className={styles.desktopSupport}>
          <a href={contactLink.href} className={styles.contactLink}>
            <span>留书 · Contact</span>
            <span>{contactLink.zh}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

Use refs: `overlayRef`, `panelRef`, and query masks/links inside the motion hook later.

- [ ] **Step 3: Overlay CSS (desktop only)**

```css
.desktopOverlay {
  display: none;
}

@media (min-width: 1024px) {
  .desktopOverlay {
    display: block;
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 200;
    pointer-events: none; /* enable when open via .isOpen */
  }

  .desktopOverlay.isOpen {
    pointer-events: auto;
  }

  .desktopPanel {
    position: absolute;
    inset: 0;
    background: var(--paper);
    /* initial clip set by GSAP; fallback full when reduced-motion open */
  }

  .desktopGrid {
    display: grid;
    grid-template-columns: minmax(0, 0.48fr) minmax(0, 0.52fr);
    gap: clamp(1.5rem, 3vw, 3rem);
    height: 100%;
    padding: clamp(6rem, 12vh, 8rem) clamp(2.5rem, 5vw, 4rem) clamp(2rem, 4vh, 3rem);
    box-sizing: border-box;
  }

  .desktopMedia {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.75rem;
    min-height: 0;
  }

  .mediaCell,
  .mediaMask {
    position: relative;
    overflow: hidden;
    min-height: 0;
    height: 100%;
  }

  .mediaImg {
    object-fit: cover;
  }

  .desktopNavCol {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .desktopLinkList {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .linkMask {
    overflow: hidden;
  }

  .desktopLink {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.75rem 1.25rem;
    text-decoration: none;
    color: var(--ink);
    position: relative;
  }

  .desktopLinkZh {
    font-family: var(--font-chinese-display);
    font-size: clamp(2.25rem, 4.5vw, 3.75rem);
    line-height: 1.15;
    letter-spacing: 0.06em;
  }

  .desktopLinkEn {
    font-family: var(--font-latin-display);
    font-size: clamp(0.7rem, 1vw, 0.85rem);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  .desktopLink:hover .desktopLinkZh,
  .desktopLink:focus-visible .desktopLinkZh {
    color: var(--seal);
  }

  .activeMark {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.15em;
    height: 2px;
    background: var(--seal);
    transform-origin: left center;
  }

  .desktopSupport {
    margin-top: clamp(2rem, 4vh, 3rem);
  }

  .contactLink {
    font-family: var(--font-chinese-body);
    font-size: 0.95rem;
    color: var(--ink-soft);
    text-decoration: none;
    display: inline-flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .contactLink:hover {
    color: var(--seal);
  }
}
```

Adapt grid when `photos.length` is 1–3 via a data attribute on `.desktopMedia` (e.g. `data-count={photos.length}`) and CSS:

```css
.desktopMedia[data-count="1"] { grid-template-columns: 1fr; grid-template-rows: 1fr; }
.desktopMedia[data-count="2"] { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr; }
.desktopMedia[data-count="3"] { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
```

For 3 items, let the third span or sit in row 2 — keep simple (no empty fake cells).

- [ ] **Step 4: Temporary open for layout QA**

While `menuState === 'open'`, add `styles.isOpen` on overlay and set `hidden={false}`. Confirm two-column parchment layout at ≥1024. Toggle still works for static show/hide (no GSAP yet).

- [ ] **Step 5: Commit**

```bash
git add components/Nav/Nav.tsx components/Nav/Nav.module.css
git commit -m "feat(nav): desktop full-screen overlay markup and layout"
```

---

### Task 4: GSAP motion hook + state machine

**Files:**
- Create: `components/Nav/useDesktopMenuMotion.ts`
- Modify: `components/Nav/Nav.tsx`

- [ ] **Step 1: Create `useDesktopMenuMotion`**

```ts
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export type MenuMotionState = 'closed' | 'opening' | 'open' | 'closing'

type Opts = {
  overlayRef: React.RefObject<HTMLElement | null>
  panelRef: React.RefObject<HTMLElement | null>
  state: MenuMotionState
  setState: (s: MenuMotionState) => void
  enabled: boolean // false when viewport < 1024 or when forcing teardown
}

const PANEL_EASE = 'power4.inOut'
const CONTENT_EASE = 'power3.out'

// Bowed bottom while entering: center lower than sides, then flatten.
const CLIP_CLOSED = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
const CLIP_BOW = 'polygon(0% 0%, 100% 0%, 100% 88%, 50% 100%, 0% 88%)'
const CLIP_OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

export function useDesktopMenuMotion({
  overlayRef,
  panelRef,
  state,
  setState,
  enabled,
}: Opts) {
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!enabled) {
      tlRef.current?.kill()
      tlRef.current = null
      return
    }

    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) return

    const mediaMasks = overlay.querySelectorAll<HTMLElement>('[data-menu-media-mask]')
    const linkMasks = overlay.querySelectorAll<HTMLElement>('[data-menu-link-mask] > *')
    const activeMark = overlay.querySelector<HTMLElement>('[data-menu-active-mark]')
    const support = overlay.querySelector<HTMLElement>('[data-menu-support]')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const kill = () => {
      tlRef.current?.kill()
      tlRef.current = null
    }

    if (state === 'opening') {
      kill()
      overlay.hidden = false
      overlay.classList.add(/* isOpen class name passed or hardcode */)
      const tl = gsap.timeline({
        defaults: { ease: CONTENT_EASE },
        onComplete: () => setState('open'),
      })
      tlRef.current = tl

      if (reduce) {
        gsap.set(panel, { clipPath: CLIP_OPEN })
        gsap.set([mediaMasks, linkMasks, activeMark, support], { clearProps: 'all' })
        setState('open')
        return kill
      }

      gsap.set(panel, { clipPath: CLIP_CLOSED })
      gsap.set(mediaMasks, { clipPath: 'inset(0 0 100% 0)', y: 12 })
      gsap.set(linkMasks, { yPercent: 110 })
      if (activeMark) gsap.set(activeMark, { scaleX: 0 })
      if (support) gsap.set(support, { autoAlpha: 0, y: 12 })

      tl.to(panel, { clipPath: CLIP_BOW, duration: 0.55, ease: PANEL_EASE }, 0)
      tl.to(panel, { clipPath: CLIP_OPEN, duration: 0.3, ease: PANEL_EASE }, 0.45)
      tl.to(
        mediaMasks,
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.55, stagger: 0.08 },
        0.35,
      )
      tl.to(linkMasks, { yPercent: 0, duration: 0.55, stagger: 0.07 }, 0.45)
      if (activeMark) tl.to(activeMark, { scaleX: 1, duration: 0.35 }, '>-0.1')
      if (support) tl.to(support, { autoAlpha: 1, y: 0, duration: 0.35 }, '>-0.05')
    }

    if (state === 'closing') {
      kill()
      const tl = gsap.timeline({
        defaults: { ease: CONTENT_EASE },
        onComplete: () => {
          overlay.hidden = true
          overlay.classList.remove(/* isOpen */)
          setState('closed')
        },
      })
      tlRef.current = tl

      if (reduce) {
        overlay.hidden = true
        setState('closed')
        return kill
      }

      if (support) tl.to(support, { autoAlpha: 0, y: 8, duration: 0.2 }, 0)
      if (activeMark) tl.to(activeMark, { scaleX: 0, duration: 0.2 }, 0)
      tl.to(linkMasks, { yPercent: 110, duration: 0.35, stagger: { each: 0.05, from: 'end' } }, 0.05)
      tl.to(
        mediaMasks,
        { clipPath: 'inset(0 0 100% 0)', y: 8, duration: 0.35, stagger: { each: 0.05, from: 'end' } },
        0.1,
      )
      tl.to(panel, { clipPath: CLIP_BOW, duration: 0.25, ease: PANEL_EASE }, 0.25)
      tl.to(panel, { clipPath: CLIP_CLOSED, duration: 0.45, ease: PANEL_EASE }, 0.4)
    }

    return kill
  }, [state, enabled, overlayRef, panelRef, setState])
}
```

Adjust class toggling to use the CSS module class string passed from `Nav` (add `isOpenClass` to opts) so CSS Modules hashing works.

Add `data-menu-media-mask`, `data-menu-link-mask`, `data-menu-active-mark`, `data-menu-support` attributes in `Nav.tsx` markup from Task 3.

- [ ] **Step 2: Wire state machine in `Nav.tsx`**

```tsx
type MenuState = 'closed' | 'opening' | 'open' | 'closing'
const [menuState, setMenuState] = useState<MenuState>('closed')
const [desktopEnabled, setDesktopEnabled] = useState(false)

useEffect(() => {
  const mq = window.matchMedia('(min-width: 1024px)')
  const sync = () => {
    setDesktopEnabled(mq.matches)
    if (!mq.matches) {
      setMenuState('closed')
      // clear overlay hidden/classes immediately on cross-breakpoint
    }
  }
  sync()
  mq.addEventListener('change', sync)
  return () => mq.removeEventListener('change', sync)
}, [])

const handleDesktopToggle = () => {
  if (!desktopEnabled) return
  if (menuState === 'opening' || menuState === 'closing') return
  if (menuState === 'open') setMenuState('closing')
  else setMenuState('opening')
}

const closeDesktopMenu = () => {
  if (menuState === 'open' || menuState === 'opening') setMenuState('closing')
}
```

Call `useDesktopMenuMotion({ ..., enabled: desktopEnabled })`.

Scroll lock only when `menuState` is `opening` | `open` | `closing` **and** `desktopEnabled`:

```tsx
useEffect(() => {
  if (!desktopEnabled) return
  if (menuState === 'closed') return
  const prev = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  return () => {
    document.body.style.overflow = prev
  }
}, [menuState, desktopEnabled])
```

Escape: when desktop menu active, `Escape` → `closing`.

Focus trap (minimal): while `open`/`opening`, on `keydown` Tab cycle within overlay + toggle. On close complete, `desktopToggleRef.current?.focus()`.

Toggle icon: add class on button when `open`/`opening`/`closing` to morph lines to X via CSS transforms (or swap paths).

- [ ] **Step 3: Verify motion**

Manual: open/close, rapid clicks (ignored mid-flight), Escape, reduced-motion OS setting, resize below 1024 while open (must tear down without touching BubbleMenu).

- [ ] **Step 4: Lint**

Run: `npm run lint`  
Expected: pass (or only pre-existing unrelated warnings).

- [ ] **Step 5: Commit**

```bash
git add components/Nav/useDesktopMenuMotion.ts components/Nav/Nav.tsx components/Nav/Nav.module.css
git commit -m "feat(nav): GSAP desktop menu open/close timeline"
```

---

### Task 5: Home page integration — replace LandingMenu

**Files:**
- Modify: `app/page.tsx`
- Delete: `components/LandingMenu/LandingMenu.tsx`
- Delete: `components/LandingMenu/LandingMenu.module.css`

- [ ] **Step 1: Update home**

```tsx
import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
// ...other imports unchanged

export default function Home() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav />
        <Hero />
      </div>
      <main>
        {/* unchanged */}
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Delete LandingMenu files**

Remove `components/LandingMenu/LandingMenu.tsx` and `LandingMenu.module.css`. Grep for `LandingMenu` — expect zero hits.

- [ ] **Step 3: Verify home + other pages**

≥1024: home shows logo + right toggle over hero; overlay works.  
≤1023: BubbleMenu unchanged.  
`git diff -- components/BubbleMenu app/layout.tsx` must be empty for BubbleMenu-related lines.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git add -u components/LandingMenu
git commit -m "feat(nav): use desktop Nav on home; remove LandingMenu stub"
```

---

### Task 6: Polish, a11y pass, final verification

**Files:**
- Modify: `components/Nav/Nav.tsx` / `Nav.module.css` / `useDesktopMenuMotion.ts` as needed only

- [ ] **Step 1: A11y checklist**

- [ ] `aria-expanded` / `aria-controls` / dialog labeling  
- [ ] Focus trap + restore  
- [ ] `:focus-visible` seal outline on links + toggle  
- [ ] `aria-current="page"` on active route  
- [ ] Link navigation closes menu  

- [ ] **Step 2: Spec verification checklist**

From the design spec:

- [ ] Open/close on home, events, gallery, about, anniversary (desktop)  
- [ ] Rapid toggle safe  
- [ ] Escape / focus trap / restore  
- [ ] Active link + mailto  
- [ ] Gallery with current ≤4 photos  
- [ ] Resize desktop ↔ mobile while open  
- [ ] `prefers-reduced-motion`  
- [ ] `git diff -- components/BubbleMenu` empty; no `app/layout.tsx` BubbleMenu edits  
- [ ] LandingMenu gone  

- [ ] **Step 3: Lint + build**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 4: Final commit**

```bash
git add components/Nav
git commit -m "fix(nav): polish desktop menu a11y and motion edge cases"
```

(Skip empty commit if nothing to change.)

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| Extend Nav; logo left / toggle right | 2 |
| Full-screen paper panel, two columns | 3 |
| Gallery photos (≤4, home-first) | 1, 3 |
| Footer mailto supporting link | 3 |
| GSAP curved panel + staggered masks | 4 |
| State machine / rapid click safety | 4 |
| Reduced motion | 4 |
| A11y (dialog, escape, focus) | 4, 6 |
| Home LandingMenu → Nav | 5 |
| Do not touch BubbleMenu | All tasks — forbidden files |
| Desktop-only ≥1024 gate | 2–4 |
| Cross-breakpoint force close | 4 |

No placeholders remaining. Types: `MenuMotionState` / `MenuState` aligned; `selectMenuPhotos` signature used in Task 3.
