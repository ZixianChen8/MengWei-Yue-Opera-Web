# Hero Redesign — Design Spec

**Date:** 2026-07-11  
**Status:** Approved (pending implementation plan)  
**Reference:** Arda Güler–style athlete hero (layering + poster composition), translated into Meng Wei Yue Opera 国风

---

## Context

The landing hero currently renders atmosphere (sun, `hero_characters` cutout, cloud parallax) but no brand wordmark in the live component. CSS remnants still describe the old vertical `titleChars` / poem / stamp pattern. The goal is a new first viewport that borrows the **reference’s design logic** (not its sports-white template): giant brand type behind a cutout figure, one poster composition, bold and clean — while preserving this site’s parchment, vermillion, CJK display type, and **existing cloud system unchanged**.

---

## Design language (from reference → project)

| Reference logic | Meng Wei translation |
|---|---|
| Z-axis: giant name behind subject | Bilingual org name behind `hero_characters` cutout |
| Corner utility modules (quote / video / next game) | **Omitted** — poster only |
| White field + flat sans | Parchment (`--paper`) + vermillion (`--seal`) + Ma Shan / Cormorant |
| Jersey number / single-glyph ornaments | **Forbidden** |
| Athlete cutout as depth cue | Existing character WebP as depth cue |
| Bold, clean, high whitespace | Hybrid editorial; no clutter |

---

## Locked decisions

1. **Atmosphere direction:** Hybrid editorial (cream + vermillion + cutout; not sports-white, not pure ink-wash vertical title).
2. **Secondary content:** Poster only — no quote, media teaser, or next-event card in the hero.
3. **Wordmark:** Bilingual stack — Chinese primary, English secondary underneath.
4. **Chinese font:** `--font-chinese-display` (Ma Shan Zheng) — same token as About `vertTitle`.
5. **English font:** `--font-latin-display` (Cormorant), uppercase, wide tracking.
6. **Copy:** Organization name only — `加拿大孟伟越剧艺术传习所` / `Meng Wei Yue Opera Studio Canada`. Do **not** use 秀灵南江 / 江南灵秀.
7. **Ornaments:** No single-character glyphs (e.g. 越), no seal stamp, no `titleRedIndex` vermillion character trick.
8. **Clouds:** Do not modify cloud assets, `cloudLayerConfig`, wisps, mist, or `useScrollParallax` behavior.
9. **Build approach:** Reference stack — parchment/sun → wordmark → cutout → existing clouds/mist/fade.
10. **Nav:** Unchanged; remains absolute over the hero and scrolls away with it.

---

## Composition & layering

### Desktop (≥1024px)

```
[ Nav — absolute overlay ]
[ Sun glow — z low ]
[ Bilingual wordmark — centered, mid-viewport ]
[ hero_characters cutout — in front of wordmark ]
[ Cloud layers / wisps / mist — unchanged, above cutout lower body ]
[ Bottom paper fade ::after — unchanged ]
```

- One composition: brand + cutout + clouds.
- Characters partially obscure the middle of the wordmark (Arda depth cue).
- Full-bleed hero plane; no inset cards.

### Z-index order (conceptual)

1. Sun  
2. Wordmark  
3. `.heroBg` cutout  
4. Clouds / wisps / mist (existing)  
5. Bottom paper fade  

Exact numeric z-index values should follow the current Hero module scale and only shift as needed so the wordmark sits **behind** the cutout and **below** the cloud stack.

---

## Typography & content

### Visual treatment

| Line | Token | Color | Notes |
|---|---|---|---|
| Chinese name | `--font-chinese-display` | `--seal` | Horizontal; one line when possible |
| English name | `--font-latin-display` | `--ink-soft` / `--ink-secondary` | Uppercase; tracking ~`.28em`–`.36em` |
| Optional meta | Latin display | `--ink-faint` | Default **off**; only if balance requires (e.g. Ottawa · Est. 2016) |

- No `writing-mode: vertical-rl` for the hero wordmark.
- Soft wrap on narrow desktop/tablet only at a natural break: `加拿大孟伟越剧` / `艺术传习所`.

### Content model

Replace the current `Hero` shape in `content/home.ts` + `content/data/home.json`:

```ts
type Hero = {
  nameZh: string
  nameEn: string
  meta?: string  // optional; unused in UI unless explicitly enabled
}
```

**Retire from hero JSON/types:** `titleChars`, `titleRedIndex`, `poem` (including `stamp`).

**Admin:** `lib/content-config.ts` hero blurb should describe the bilingual wordmark. Update `SectionForm` field labels (`titleChars` / `titleRedIndex` → `nameZh` / `nameEn`) so the editor stays coherent.

**Defaults:**

- `nameZh`: `加拿大孟伟越剧艺术传习所`
- `nameEn`: `Meng Wei Yue Opera Studio Canada`

---

## Motion

- **Clouds / parallax:** Untouched.
- **Wordmark:** Optional load entrance only (`opacity` + slight `translateY`). Duration ~400–700ms, ease-out. No scroll scrub on the type.
- **Cutout:** Keep current `heroBgConfig` behavior; no new parallax on the figure unless already present.
- **`prefers-reduced-motion`:** Skip wordmark entrance; show final state immediately.

---

## Mobile (≤767px)

Follow ui-ux-pro-max + `design-system/mobile-design-system.md`:

| Rule | Spec |
|---|---|
| Viewport | `min-height: 100dvh` (prefer over `100vh`) |
| Layout | Single column; same hierarchy as desktop (name + cutout only) |
| Side padding | 22–24px |
| Nav clearance | Wordmark starts below nav bar zone (~54px + breathing room) |
| Chinese | Ma Shan ≈ 32–38px; letter-spacing ~4–6px; wrap to 2 lines |
| English | Cormorant caps 11–12px; tracking ~`.36em`; never &lt; 11px for this line |
| Stacking | Prefer wordmark in **upper third**, cutout bottom-anchored — legibility over maximum occlusion |
| Clouds | Existing hide ≤767 remains; soft paper fade at bottom into Overture |
| Overflow | No horizontal scroll |
| A11y | Org name is the page `h1` (Chinese primary; English secondary within/near heading). Cutout `alt=""` |

Tablet (768–1023): scale type between mobile and desktop; keep horizontal wordmark; preserve cloud behavior as today.

---

## Technical scope

### In scope

- `components/Hero/Hero.tsx` — render bilingual wordmark behind cutout
- `components/Hero/Hero.module.css` — wordmark styles, z-index, responsive type, `100dvh`
- `content/data/home.json` — new hero fields
- `content/home.ts` — update `Hero` type + export
- Admin labels/blurb for hero fields (`SectionForm` / `content-config` as needed)
- Remove dead vertical title/poem/stamp CSS if no longer referenced

### Out of scope

- Cloud system (`cloudLayerConfig`, assets, `useScrollParallax`)
- `heroBgConfig` retuning (unless required for z-index/stacking only)
- Nav redesign
- Corner cards, quote, video, next-event modules
- Overture or any section below the hero
- New assets beyond existing `hero_characters.webp`

---

## Accessibility & quality bar

- Vermillion large type on parchment must remain readable (large-text contrast).
- Semantic `h1` for the organization name.
- Decorative imagery stays empty-alt.
- Reduced-motion path for any entrance animation.
- Verify at ~375px, 768px, 1024px, 1440px: no clipping, no overlap with nav, no horizontal overflow.

---

## Success criteria

1. First viewport reads as one bold poster: org name behind characters, clouds as today.
2. No 秀灵南江, no single-glyph ornaments, no hero corner widgets.
3. Chinese wordmark uses the same font token as About `vertTitle`.
4. Mobile is legible and coherent per the mobile rules above.
5. Cloud parallax behavior is identical to pre-change behavior.
