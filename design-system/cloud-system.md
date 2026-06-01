# Cloud System — Design & Implementation Spec

A portable reference for reproducing the ink-wash **cloud parallax** used on this
site (the Hero cloud bank + the `CloudBreak` divider band) on another project,
and for **swapping cloud images** without breaking the look.

It is written so an engineer or another AI can recreate the effect from scratch,
in any framework. Code samples are vanilla — translate to React/Vue/Svelte as
needed. The reference implementation lives in:

- `components/Hero/Hero.tsx` + `Hero.module.css`
- `components/hooks/useScrollParallax.ts`
- `components/CloudBreak/CloudBreak.tsx` + `CloudBreak.module.css`

---

## 1. The look in one paragraph

Stacked, ultra-wide PNG cloud strips with transparent backgrounds are layered
back-to-front along the bottom of a full-height hero. Each layer sits at a
different vertical offset and base opacity. As the user scrolls, every layer
drifts **upward** and **scales up** at a rate set by its "depth," and fades
toward a per-layer target opacity — producing a slow parallax of clouds parting
and rising as you descend the page. Blend modes (`lighten` for bright puffs,
`multiply` for ink washes) fuse the strips with the cream background so they read
as painted mist, not pasted PNGs. A soft sun glow and three blurred CSS "wisps"
add atmosphere. The `CloudBreak` band reuses the same strips as a shorter
decorative divider with a gentler scroll-progress parallax.

---

## 2. Core principles (keep these or it breaks)

1. **Depth ordering.** Layers are ordered back → front. Back layers are smaller
   on-screen, fainter, and move/scale **less**; front layers are larger, more
   opaque, and move/scale **more**. This monotonic relationship is what sells the
   parallax.
2. **Motion is upward + scale-up.** On scroll, clouds translate up (negative Y)
   and grow. They never move down or shrink.
3. **Opacity eases toward a target.** Each layer starts at a CSS base opacity and
   eases (smoothstep) toward a per-layer `fade` value as scroll progresses.
4. **Blend modes do the compositing**, not hard edges. `mix-blend-mode: lighten`
   for luminous foreground puffs; `multiply` for receding ink washes.
5. **Animation runs off the main thread budget**: a single `requestAnimationFrame`
   loop writes `transform`/`opacity` directly to DOM nodes — **no per-frame
   state/React re-render**. Only `transform` and `opacity` are animated (both
   GPU-compositable). `will-change: transform, opacity` is set on each layer.
6. **Overflow is hidden** on the container so oversized, translated strips are
   clipped cleanly. Strips are intentionally wider than the viewport
   (`width: 110–120%`, `left`/`right` negative insets) so horizontal parallax and
   scale never expose an edge.

---

## 3. Layer model & tuning constants

### Hero cloud layers

Six layers, each defined by `{ depth, scale, fade }` plus a CSS base position +
base opacity. From the reference (`Hero.tsx`):

| # | depth | scale (max add) | fade (target opacity) | CSS class | bottom | base opacity | blend |
|---|-------|-----------------|-----------------------|-----------|--------|--------------|-------|
| 1 | 0.15  | 0.35 | 1.0 | `cloudL1` | 34% | .55 | lighten |
| 2 | 0.22  | 0.50 | 0.5 | `cloudLw` | 18% | .70 | multiply (wash) |
| 3 | 0.30  | 0.70 | 0.7 | `cloudL2` | 22% | .70 | lighten |
| 4 | 0.50  | 1.00 | 0.5 | `cloudL3` | 10% | .90 | lighten |
| 5 | 0.80  | 1.50 | 0.3 | `cloudL4` | -2% | 1.0 | lighten |
| 6 | 1.10  | 2.40 | 0.1 | `cloudL5` | -12% | 1.0 | lighten (mirrored) |

- `depth` — how far the layer translates up: `translateY = -p * depth * viewportHeight`.
- `scale` — additive scale at full scroll: `scale = 1 + p * scale`.
- `fade` — opacity the layer eases **toward** as you scroll (front layers fade
  most, so the foreground dissolves and reveals the page).
- `p` — scroll progress `0…1`, computed as `clamp(scrollY / (viewportHeight * 0.9), 0, 1)`.

### Three CSS wisps (atmosphere, not images)

Pure CSS radial-gradient blobs, blurred, that drift horizontally apart and up,
fading out as you scroll. Base opacities `[0.7, 0.55, 0.4]`. Even-index wisps go
left, odd go right: `x = dir * p * (80 + i*40)`, `y = -p * 80`, `opacity = (1-p)*base`.

### CloudBreak divider band

Same strips, six layers, but progress is **element-relative** (enters/leaves
viewport) and the parallax is small per-layer `[xFactor, yFactor, scaleFactor]`
nudges rather than full-height travel. Band is `480px` tall (`360`/`260` on
tablet/mobile), `overflow: hidden`, white background.

---

## 4. The scroll math (reference)

```js
// p: global scroll progress for the hero
const h = window.innerHeight;
const y = window.scrollY;
const p = Math.max(0, Math.min(1, y / (h * 0.9)));

// per cloud layer i with config {depth, scale: scaleMax, fade}
const translateY = -p * depth * h;
const scale      = 1 + p * scaleMax;
const ease       = p * p * (3 - 2 * p);          // smoothstep
// base = the layer's CSS opacity, read once via getComputedStyle and cached
layer.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
layer.style.opacity   = String(base * (1 - ease) + fade * ease);
```

Driver loop (coalesce scroll events into one rAF):

```js
let raf = null;
function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', update);
update(); // initial paint
```

`CloudBreak` differs only in how `p` is derived (element rect vs. window scroll):

```js
const rect = section.getBoundingClientRect();
const vh   = window.innerHeight;
const raw  = (vh - rect.top) / (vh + rect.height);
const p    = Math.max(0, Math.min(1, raw));
const ease = p * p * (3 - 2 * p);
el.style.transform =
  `translate3d(${ease*xf}px, ${ease*yf}px, 0) scale(${1 + ease*sf})`;
```

---

## 5. Required CSS scaffolding

```css
/* container clips oversized strips */
.clouds {
  position: absolute; left: 0; right: 0; bottom: 0;
  height: 55%;                /* clouds occupy lower portion of hero */
  pointer-events: none; z-index: 10;
}
.cloudLayer {
  position: absolute; left: -5%; right: -5%;   /* wider than viewport */
  will-change: transform, opacity;
}
.cloudLayer img {
  width: 110%; height: auto; display: block;
  filter: drop-shadow(0 -4px 18px rgba(255,255,255,.55)); /* soft top halo */
}
.puff img { mix-blend-mode: lighten; }          /* bright foreground puffs */
.wash img { mix-blend-mode: multiply; opacity: .85; } /* receding ink wash */
```

Hero also layers, bottom→top by `z-index`: background image (2) → sun glow (1,
behind bg actually) → title/poem (6) → wisps → clouds (10) → a bottom
`linear-gradient(transparent → --paper)` mask (20) that melts the cloud bank into
the page background. Reproduce that bottom fade — it hides the hard bottom edge of
the strips.

---

## 6. Swapping cloud images — how to keep it looking good

The single biggest risk when changing images is that new PNGs have the wrong
**aspect ratio, alpha, or value range**, which breaks the blend-mode compositing.
Follow this checklist.

### 6.1 Source-image requirements (hard rules)

| Property | Requirement | Why |
|---|---|---|
| Format | PNG (or WebP) with **real alpha transparency** | Layers must show through each other; a baked background will occlude everything below. |
| Background | Fully transparent, **no halo/matte** | A white or colored fringe ruins `multiply`/`lighten` blending and shows as a box. |
| Aspect ratio | Very wide strips, ~**8:1 to 11:1** (e.g. 2838×364, 2992×262) | They span >100% width and translate horizontally; tall images expose top/bottom edges when scaled. |
| Min width | ≥ **2400px**, ideally ~3000px | Rendered at `110–120vw` and scaled up to 3.4× — anything smaller goes soft/pixelated. |
| Subject placement | Cloud mass centered, **feathered/soft edges**, fading to nothing at left & right ends | Hard horizontal ends become visible seams during parallax. |
| Value range | Light, near-white puffs **or** soft mid-grey ink washes — avoid pure black and avoid hard high-contrast edges | `lighten` keeps the lightest pixels (white reads as glow); `multiply` keeps darks (grey reads as ink). Mid-tones blend; black under `multiply` punches holes. |
| Color | Neutral / warm-white. **No saturated colors** | Must sit in the cream ink-wash palette (`--paper #F8F4EE`, `--cloud #FFFFFF`). |

### 6.2 Decide each image's role: "puff" vs "wash"

For every layer you must classify the image and pick the matching blend mode:

- **Puff (foreground, luminous):** bright, near-white cloud → `mix-blend-mode: lighten`.
  Use for the prominent front layers.
- **Wash (background, ink):** soft grey, low-contrast → `mix-blend-mode: multiply`,
  ~0.85 opacity. Use for receding back layers.

If a swapped image looks like a grey rectangle, it's probably a dark image under
`lighten` (use `multiply`) or vice-versa. **Match blend mode to the image's value,
not just its layer position.**

### 6.3 Wiring a new image in (reference data lives in code, not CSS)

Image src + intrinsic `width`/`height` are declared in arrays in the components
(`CLOUD_IMAGES` in `Hero.tsx`, `LAYERS` in `CloudBreak.tsx`). When you swap a file:

1. **Use the file's true pixel dimensions** for `width`/`height` (Next.js `<Image>`
   needs them; the wrong ratio causes layout jump / distortion). Don't copy the old
   numbers blindly.
2. Keep `sizes="110vw"` (hero) / `"120vw"` (CloudBreak) so the browser serves a
   large enough source for the overflow + scale.
3. If the new strip is a different height, re-check the per-layer `bottom:` values
   so layers still overlap pleasingly (see 6.5).
4. Provide explicit `width`/`height` — never let these strips be unsized.

### 6.4 Preserve the depth gradient

Whatever images you use, keep the **monotonic depth relationship** from §3:
back layers smaller-scale + lower opacity + smaller `depth`; front layers
larger-scale + higher opacity + larger `depth`. You can change which image is on
which layer freely, but don't, e.g., give a back wash a bigger `scale`/`depth`
than a front puff — that inverts the parallax and looks wrong.

### 6.5 Re-tune after a swap (quick procedure)

1. Drop new files in `public/assets/` with the same names, **or** update the src
   arrays. Update `width`/`height` to the real dimensions.
2. Load the hero at desktop width; **scroll slowly top→bottom.** Watch for:
   - Visible rectangular edges / halos → alpha or matte problem (re-export).
   - A layer that "pops" or disappears wrong → wrong blend mode (swap puff↔wash).
   - Hard seam at a strip's left/right end → image not feathered; add horizontal fade.
   - Gaps between layers / a layer floating alone → adjust that layer's `bottom:`%.
   - Blurriness when scrolled to bottom → source too low-res for the scale.
3. Tune **only** `bottom` (position), base `opacity`, and `fade` first; touch
   `depth`/`scale` only if the parallax feels too flat or too aggressive.
4. Verify the bottom `--paper` gradient still melts the bank into the page; if a
   new front layer is taller, extend the gradient height.
5. Check mobile (`@media max-width: 767px`): the hero raises the cloud band and
   re-stacks `bottom:` values; re-confirm nothing clips the title.

### 6.6 Don't break these invariants

- Keep `overflow: hidden` on hero + CloudBreak containers.
- Keep strips wider than the viewport (`width: 110–120%`, negative `left/right`).
- Animate only `transform` + `opacity`; keep `will-change` set.
- Keep `pointer-events: none` on the cloud container.
- Keep the single shared rAF loop; do not animate via per-frame framework state.
- Respect the palette: no saturated cloud colors; background stays cream, clouds
  stay white/grey.

---

## 7. Accessibility & performance notes

- Cloud containers are decorative: `aria-hidden="true"`, `pointer-events: none`.
- Consider honoring `prefers-reduced-motion`: skip the scroll transforms (render
  layers at their base position/opacity) for users who request reduced motion.
  The reference does not yet do this — add it on the new site.
- The rAF loop must be idempotent (one frame queued at a time) and cleaned up on
  unmount/page-leave. Reads (`getComputedStyle` for base opacity) are cached once
  per element to avoid layout thrash.
- Provide intrinsic `width`/`height` to avoid CLS; mark the hero background image
  `priority`/eager, but cloud strips can lazy-load.

---

## 8. Minimal portable recipe (framework-agnostic)

```
1. Container: position relative, full-height, overflow hidden, cream background.
2. Add N absolutely-positioned cloud <div>s along the bottom, back→front,
   each holding one wide transparent PNG strip (width ~110%).
3. Give each a base bottom%, base opacity, and blend mode (lighten=puff / multiply=wash).
4. Assign each {depth, scaleMax, fade} following the monotonic depth gradient.
5. One rAF loop: compute p = clamp(scrollY / (vh*0.9), 0..1); for each layer set
   transform = translate3d(0, -p*depth*vh, 0) scale(1 + p*scaleMax) and
   opacity = base*(1-ease) + fade*ease, ease = smoothstep(p).
6. Add a bottom-edge gradient mask (transparent → background) over the strips.
7. Optional: a sun-glow radial gradient + 2–3 blurred CSS wisp blobs for depth.
8. Clip everything with overflow:hidden; animate only transform/opacity.
```

That reproduces the current cloud style and behavior, and §6 keeps it looking
right when the cloud artwork changes.
