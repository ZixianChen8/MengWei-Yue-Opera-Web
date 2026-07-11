# Mobile Hero Layout — Design Spec

**Date:** 2026-07-11  
**Status:** Approved (awaiting implementation plan)  
**Scope:** Mobile hero only (`max-width: 767px`, aligned with `HERO_MOTION_MIN_WIDTH`)  
**Out of scope:** Desktop/tablet hero composition, Nav chrome, cloud parallax system, new content fields

---

## Problem

On mobile, the first viewport fails as one composition:

1. **Title** — Horizontal bilingual wordmark is centered, undersized (~clamp down to ~20px), and floats in the upper third with a large CN↔EN gap.
2. **Figure** — Character cutout sits too low (docked at the footer), leaving a dead cream band through the middle of the viewport.
3. **Result** — Title and image read as two disconnected layers, not one poster.

Desktop (≥768px) remains the existing artboard / wordmark-behind-cutout system and must not regress.

---

## Locked decisions

| Decision | Choice |
|---|---|
| Title orientation | **Horizontal** bilingual stack (CN primary, EN secondary) — mirror desktop wordmark, denser |
| Title placement | **Right-aligned**, under the top bar / hamburger row |
| Poem / right vertical rail | **None** — org name only (`nameZh` / `nameEn`) |
| Figure treatment | **Full-bleed mid→bottom** — enlarge/raise so principals occupy roughly mid viewport to bottom; title overlaps the figure |
| Mobile clouds | **Stay off** (current behavior below 768) |
| Content / copy | No new fields; no new strings |
| Desktop | Untouched |

---

## Target composition (mobile ≤767px)

```
┌──────────────────────────────┐
│ logo                  [≡]    │  ← existing Nav (unchanged)
│                              │
│        加拿大孟伟越剧艺术传习所 │  ← right-aligned CN (~38–44px)
│        MENG WEI YUE…         │  ← right-aligned EN caps, tight gap
│              ╱╲    ╱╲        │
│             ╱  ╲  ╱  ╲       │  ← figure mid→bottom, oversized
│            │    ││    │      │     title overlaps shoulders/mid
│            │    ││    │      │
│~~~~~~~~~~~~│~~~~││~~~~│~~~~~~│  ← soft paper fade at base
└──────────────────────────────┘
```

One composition rules (from project frontend guidance):

- Brand name is a hero-level signal, not a thin eyebrow.
- First viewport = brand + dominant image only (no stats, cards, or secondary marketing).
- No detached badges/chips over the figure beyond the existing nav.

---

## Typography (mobile)

Align with `design-system/mobile-design-system.md` scale where it does not conflict with the locked horizontal wordmark:

| Element | Spec |
|---|---|
| CN (`nameZh`) | Ma Shan / `--font-hero-title`; target **~38–44px** (use a clamp that does not collapse below ~1.75rem / 28px on narrow phones); letter-spacing modest (≈0.04–0.08em); `white-space: nowrap` preferred — if overflow on ~320px, allow a controlled wrap of the org name rather than shrinking below readable |
| EN (`nameEn`) | Cormorant / `--font-latin-display`; **11–12px**; `letter-spacing: ~0.36em`; uppercase; right-aligned under CN |
| CN↔EN gap | Tighten from the current large gap — target **~0.35–0.5rem** margin-top on EN (not 1.75rem desktop spacing) |
| Alignment | Wordmark block `text-align: right`; horizontal inset **22–24px** from the right edge |

Wordmark vertical position: below the floating top bar (logo + hamburger). Approximate `top` in the **12–18%** band or equivalent padding under the 54px bar — enough clearance that type does not collide with the hamburger, low enough that it overlaps the raised figure.

---

## Figure / cutout (mobile)

Tune via existing `HERO_BG.placementMobile` in `components/Hero/heroBgConfig.ts` (and mobile CSS only if the container needs a clipped artboard):

| Knob | Intent |
|---|---|
| Scale | Larger than current mobile `1.75` if needed so figures fill mid→bottom |
| `objectFit` | Prefer `cover` or a higher `contain` scale so the dead mid-gap disappears |
| `positionY` / `offsetY` | Raise heads toward vertical center; avoid “feet-only at the fold” |
| `originY` | Keep bottom-biased so scaling grows upward into the title zone |
| Base fade | Keep hero `::after` paper gradient so the section still dissolves into Overture |

Do **not** re-enable cloud layers, wisps, or dive mist on mobile.

Z-order stays: sun → wordmark → cutout → (no clouds) → veil. On mobile, wordmark may sit **over** the cutout visually via positioning/overlap even if z-index still places cutout above wordmark — if overlap readability fails (type buried under opaque pixels), raise wordmark `z-index` above the cutout **on mobile only**. Prefer readability over strict desktop stacking.

---

## Files expected to change

| File | Responsibility |
|---|---|
| `components/Hero/Hero.module.css` | Mobile `@media (max-width: 767px)` wordmark position, size, alignment, gap |
| `components/Hero/heroBgConfig.ts` | `placementMobile` retune (scale / position / offset / objectFit) |
| `components/Hero/Hero.tsx` | Only if structure needs a mobile-safe composition wrapper tweak; prefer CSS + config |

No changes to `content/data/home.json`, Nav, Overture, or cloud configs.

---

## Acceptance criteria

1. On a ~390×844 viewport, the cream mid-gap is gone — figure and title share one continuous hero plane.
2. CN wordmark is clearly larger than today’s undersized clamp and right-aligned.
3. EN sits tightly under CN, right-aligned, readable (≥11px).
4. Character heads sit near/above vertical mid; figures are not stuck only at the bottom edge.
5. Title overlaps the figure without colliding with the hamburger.
6. Soft fade into the next section still works.
7. Desktop (≥768px) screenshot/behavior unchanged.
8. `prefers-reduced-motion` and existing mobile cloud-off behavior unchanged.

---

## Verification

- Manual: Chrome/Safari device mode at 390×844 and 320×568.
- Compare before/after against the current “title high / figure low” screenshot.
- Spot-check desktop at 1280×800 and 1440×900 for no regression.
- Optional: Playwright screenshot under `.qa-screenshots/` if the existing QA harness is used in this worktree.

---

## Non-goals

- Vertical Chinese title rail (left or right)
- Mobile bottom nav pill
- Restoring mobile clouds
- New hero copy, poem, or stamp
- Desktop artboard / entrance motion redesign
