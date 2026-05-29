# Mobile Design Principles
## Meng Wei Yue Opera Studio · Mobile Web

A condensed handoff for translating the existing site into mobile views.
This document specifies **visual system, structure, and component code only** — no copywriting. Pour your existing Chinese / English content into the structures below.

---

## 1. Foundations

### 1.1 Color tokens
Define once on `:root`. Every color in the design must come from this list.

```css
:root{
  --paper:       oklch(0.975 0.008 80);   /* page background */
  --paper-deep:  oklch(0.955 0.010 75);   /* tonal panels */
  --ink:         oklch(0.22 0.012 50);    /* primary text */
  --ink-soft:    oklch(0.42 0.012 50);    /* body text */
  --ink-faint:   oklch(0.62 0.010 50);    /* meta / EN caps */
  --seal:        oklch(0.48 0.16 30);     /* the red stamp / accent — sparingly */
  --gold:        oklch(0.68 0.10 75);     /* highlight in active nav */
  --rule:        oklch(0.82 0.01 70);     /* hairline dividers */
  --rule-soft:   oklch(0.88 0.01 70);     /* faintest dividers */
}
```

**Rule:** seal-red is reserved. Use it for the stamp, for one accent line per screen, for the active-state highlight in the bottom nav, and nowhere else. Never as a fill behind a block.

### 1.2 Typography pairing
Four faces, each with a strict job. Do not mix outside this matrix.

| Face | Role | Use cases |
|---|---|---|
| **Ma Shan Zheng** | Chinese display | Section titles, big page titles, stamp glyphs, the CN word in the bottom nav, the CN word in menu rows. **Brush character — only for headlines, never body.** |
| **Noto Serif SC** | Chinese body | Paragraphs of Chinese, quotes, blurbs. Weight 300 for body, 400 for emphasis. |
| **Cormorant Garamond** | English display & meta | English subheads under CN titles, eyebrows, nav labels, EN caps under bottom-nav glyphs. Italic 12.5px for poetic English body. |
| **JetBrains Mono** | Numerics / tags | N° 01, dimensions on placeholders, page counters (01/03), small data labels. Always uppercase, wide letter-spacing. |

Letter-spacing is part of the system, not decoration:
- Ma Shan Zheng Chinese: **letter-spacing 4–10px** (more spacing = larger size).
- Cormorant EN caps: **letter-spacing .32em–.42em**, always `text-transform:uppercase`.
- JetBrains Mono: **letter-spacing .22em–.35em**, always uppercase.

### 1.3 Scale (mobile, ~402px wide canvas)
- Hero vertical title: **54px**, ls 10px
- Page title (CN, Ma Shan Zheng): **38–44px**, ls 6px
- Page title EN small under it (Cormorant): **11–12px**, ls .36em
- Body (Noto Serif SC, 300): **13px**, line-height **1.95**
- Italic EN body (Cormorant): **12.5px**, line-height **1.8**
- Eyebrow (Cormorant uppercase): **10.5px**, ls .42em
- Meta / mono labels: **8.5–9.5px**, ls .3em
- **Minimum readable size: 8px.** Anything smaller is a bug.

### 1.4 Spacing & rhythm
- Screen side padding: **22–24px**
- Vertical gutter top of content (clears bar + eyebrow): **128px**
- Vertical gutter bottom of content (clears nav pill): **110px**
- Section divider rule: 1px `var(--rule)` between blocks, 1px `var(--seal)` to open a key section
- Block-to-block spacing: **22–24px**

### 1.5 Layout grain
Mobile is **a single column** — no side-by-side at this width. Variety comes from:
- vertical Chinese type as a graphic element (writing-mode: vertical-rl)
- placeholder images at fixed aspect ratios (4:5 for principals, 5:3 for environments)
- hairline rules, generous whitespace, one stamp per screen
- never gradients-as-decoration. Soft radial glow is okay around the hero figure only.

### 1.6 Placeholders
While the user wires in real imagery, every image slot must look intentional:
```css
.placeholder{
  background:
    repeating-linear-gradient(135deg, oklch(0.30 0.015 50 / .07) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, oklch(0.92 0.012 70 / .4), oklch(0.86 0.014 60 / .25));
  border:1px dashed oklch(0.40 0.014 50 / .35);
  position:relative; overflow:hidden;
}
```
With JetBrains Mono tags pinned top-left (subject) and bottom-right (dimension).

---

## 2. Page chrome

### 2.1 Top bar (logo + menu button)
Floats over content. **Brand mark on the left, circular hamburger on the right.** No other elements.

> **⚠ Logo replacement note:** The mark currently rendered as a small red "孟" stamp + `孟伟越剧` / `Meng Wei · Ottawa` wordmark is a **placeholder**. Replace with the existing studio logo asset (SVG preferred). The slot should hold a ~26px square mark + an optional 2-line wordmark to its right; keep the total bar height at 54px and the overall vertical alignment unchanged.

```html
<div class="mv-bar">
  <div class="brand">
    <!-- ▼ REPLACE with existing logo SVG/IMG ▼ -->
    <div class="stamp">孟</div>
    <div>
      <div class="wm">孟伟越剧</div>
      <div class="en">Meng Wei · Ottawa</div>
    </div>
    <!-- ▲ REPLACE with existing logo SVG/IMG ▲ -->
  </div>
  <button class="hamb"><i></i><i></i><i></i></button>
</div>
```

```css
.mv-bar{
  position:absolute; top:60px; left:0; right:0; height:54px; z-index:20;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 22px; pointer-events:none;
}
.mv-bar .brand{ display:flex; align-items:center; gap:10px; }
.mv-bar .brand .stamp{
  width:26px; height:26px; background:var(--seal); color:#fff;
  font-family:"Ma Shan Zheng",serif; font-size:13px;
  display:flex; align-items:center; justify-content:center;
  box-shadow:inset 0 0 0 1px oklch(0.40 0.16 30);
}
.mv-bar .brand .wm{ font-family:"Ma Shan Zheng",serif; font-size:15px; letter-spacing:2px; color:var(--ink); }
.mv-bar .brand .en{ font-family:"Cormorant Garamond",serif; font-size:8.5px; letter-spacing:.34em; text-transform:uppercase; color:var(--ink-faint); margin-top:2px; }
.mv-bar .hamb{
  pointer-events:auto;
  width:36px; height:36px; border-radius:50%; border:1px solid var(--ink);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:4px; background:transparent;
}
.mv-bar .hamb i{ display:block; width:14px; height:1px; background:var(--ink); }
```

### 2.2 Bottom navigation pill — **bilingual (CN + EN), required**
The signature element. **Every item shows the Chinese glyph stacked over a small Cormorant uppercase English label.** Active item highlights the Chinese in gold; both CN and EN dim together when muted. Dots separate items.

```html
<div class="mv-pill">
  <div class="item active"><span class="cn">入云</span><span class="en">Enter</span></div>
  <span class="dot"></span>
  <div class="item muted"><span class="cn">序</span><span class="en">Overture</span></div>
  <span class="dot"></span>
  <div class="item muted"><span class="cn">时序</span><span class="en">Season</span></div>
  <span class="dot"></span>
  <div class="item muted"><span class="cn">传习</span><span class="en">Studio</span></div>
</div>
```

```css
.mv-pill{
  position:absolute; left:50%; bottom:48px; transform:translateX(-50%);
  z-index:30;
  display:flex; align-items:center; gap:14px;
  padding:9px 18px 8px; background:var(--ink); color:var(--paper); border-radius:99px;
  box-shadow:0 10px 30px -10px rgba(0,0,0,.45);
}
.mv-pill .item{
  display:flex; flex-direction:column; align-items:center; gap:2px;
  line-height:1;
}
.mv-pill .item .cn{
  font-family:"Ma Shan Zheng",serif; font-size:12px; letter-spacing:2px;
  color:var(--paper);
}
.mv-pill .item .en{
  font-family:"Cormorant Garamond",serif; font-size:7.5px; letter-spacing:.32em;
  text-transform:uppercase; color:var(--paper); opacity:.55;
}
.mv-pill .item.active .cn{ color:var(--gold); }
.mv-pill .item.active .en{ opacity:.85; }
.mv-pill .item.muted .cn{ opacity:.5; }
.mv-pill .item.muted .en{ opacity:.35; }
.mv-pill .dot{ width:3px; height:3px; border-radius:50%; background:var(--paper); opacity:.4; flex-shrink:0; }
```

**Rules:**
- Always exactly 4 items.
- The CN label is the navigational glyph; the EN label is its translation/clarifier.
- Active state: gold CN + brightened EN. One active item at a time.
- The pill is fixed-position relative to the screen, **floating** above content with a soft drop shadow.

---

## 3. Menu screen — full code

A full-screen drawer triggered by the hamburger. Replaces the bottom pill (no pill while menu is open). Six rows, each: monospaced N°, Ma Shan Zheng CN, right-aligned Cormorant EN. A footer pairs a calligraphic quote (your content) with the seal stamp.

```html
<div class="mv s-menu">
  <div class="header">
    <div style="display:flex;align-items:center;gap:10px;">
      <!-- ▼ REPLACE with existing logo SVG/IMG ▼ -->
      <div style="width:26px;height:26px;background:var(--seal);color:#fff;font-family:'Ma Shan Zheng',serif;font-size:13px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px oklch(0.40 0.16 30);">孟</div>
      <!-- ▲ REPLACE with existing logo SVG/IMG ▲ -->
      <div class="label">Index · 目录</div>
    </div>
    <button class="close">×</button>
  </div>

  <div class="nav-list">
    <div class="nav-row active">
      <div class="num">N° 01</div>
      <div class="cn"><!-- CN label --></div>
      <div class="en"><!-- EN label --></div>
    </div>
    <div class="nav-row">
      <div class="num">N° 02</div>
      <div class="cn"></div><div class="en"></div>
    </div>
    <div class="nav-row">
      <div class="num">N° 03</div>
      <div class="cn"></div><div class="en"></div>
    </div>
    <div class="nav-row">
      <div class="num">N° 04</div>
      <div class="cn"></div><div class="en"></div>
    </div>
    <div class="nav-row">
      <div class="num">N° 05</div>
      <div class="cn"></div><div class="en"></div>
    </div>
    <div class="nav-row">
      <div class="num">N° 06</div>
      <div class="cn"></div><div class="en"></div>
    </div>
  </div>

  <div class="foot">
    <div class="quote">
      <!-- one short calligraphic CN line -->
      <span class="en"><!-- one-line EN gloss --></span>
    </div>
    <div class="stamp">孟</div>
  </div>
</div>
```

```css
.s-menu{
  height:100%; background:var(--paper); position:relative;
}
.s-menu .header{
  display:flex; align-items:center; justify-content:space-between;
  padding:0 22px; height:54px;
  border-bottom:1px solid var(--rule-soft);
}
.s-menu .header .close{
  width:36px; height:36px; border-radius:50%; border:1px solid var(--ink);
  background:var(--ink); color:var(--paper);
  font-family:"Cormorant Garamond",serif; font-size:14px;
  display:flex; align-items:center; justify-content:center;
}
.s-menu .header .label{
  font-family:"Cormorant Garamond",serif; font-size:10px; letter-spacing:.42em;
  color:var(--ink-faint); text-transform:uppercase;
}
.s-menu .nav-list{ padding:20px 22px 0; }
.s-menu .nav-row{
  display:flex; align-items:baseline; justify-content:space-between;
  gap:18px; padding:22px 0; border-bottom:1px solid var(--rule-soft);
  cursor:pointer;
}
.s-menu .nav-row.active .cn{ color:var(--seal); }
.s-menu .nav-row .num{
  font-family:"JetBrains Mono",monospace; font-size:9px; letter-spacing:.35em;
  color:var(--ink-faint); text-transform:uppercase; width:34px;
}
.s-menu .nav-row .cn{
  flex:1; font-family:"Ma Shan Zheng",serif; font-size:28px; letter-spacing:6px;
  color:var(--ink); line-height:1;
}
.s-menu .nav-row .en{
  font-family:"Cormorant Garamond",serif; font-size:10.5px; letter-spacing:.35em;
  color:var(--ink-faint); text-transform:uppercase; text-align:right;
}
.s-menu .foot{
  position:absolute; left:22px; right:22px; bottom:90px;
  display:flex; align-items:flex-end; justify-content:space-between; gap:18px;
}
.s-menu .foot .quote{
  font-family:"Noto Serif SC",serif; font-size:11.5px; line-height:1.8;
  color:var(--ink-soft); font-weight:300; max-width:200px;
}
.s-menu .foot .quote .en{
  display:block; font-family:"Cormorant Garamond",serif; font-size:9px;
  letter-spacing:.35em; color:var(--ink-faint); text-transform:uppercase; margin-top:8px;
}
.s-menu .foot .stamp{
  width:34px; height:34px; background:var(--seal); color:#fff;
  font-family:"Ma Shan Zheng",serif; font-size:14px;
  display:flex; align-items:center; justify-content:center;
  box-shadow:inset 0 0 0 1px oklch(0.40 0.16 30);
  flex-shrink:0;
}
```

**Menu behavior:**
- Opens from the hamburger; covers the entire viewport.
- Closes via the dark `×` button (top right) — same target size as the hamburger.
- The current page's row gets `.active` (its CN label turns seal-red).
- Hide the bottom pill while the menu is open.

---

## 4. Repeating components

### 4.1 Eyebrow
Section opener — dash + uppercase Cormorant. One per screen at most.
```html
<div class="eyebrow"><span class="dash"></span><span><!-- LABEL · 中文 --></span></div>
```
```css
.eyebrow{
  display:flex; align-items:center; gap:10px; color:var(--seal);
  font-family:"Cormorant Garamond",serif; font-size:10.5px; letter-spacing:.42em;
  text-transform:uppercase;
}
.eyebrow .dash{ width:28px; height:1px; background:var(--seal); }
```

### 4.2 Title block (CN + EN small)
```html
<h2 class="title">中文标题<small>english subtitle</small></h2>
```
Ma Shan Zheng 38–44px CN; Cormorant 11–12px uppercase EN under it. EN always small-caps style with .36em tracking.

### 4.3 Body
- Chinese body paragraphs: Noto Serif SC, 13px, weight 300, line-height 1.95.
- English alternate paragraph: italic Cormorant 12.5px, line-height 1.8.
- Use `text-wrap:pretty;` on body containers.

### 4.4 Pull quote
1px seal-red left border, tonal panel background, attribution in Cormorant uppercase.

### 4.5 Stamp glyph
26–34px red square, single Ma Shan Zheng character in `#fff`, inset 1px darker red ring. Used:
- Top bar (as logo placeholder)
- Menu footer
- Once per long-form screen as a closer
Never larger than 36px on mobile.

### 4.6 CTA pill button
```html
<button class="cta">
  <span>中文</span>
  <span class="en">English helper</span>
  <span class="arr">→</span>
</button>
```
Outline pill, 1px ink border, 99px radius, divider line between CN and EN labels.

---

## 5. Screen archetypes (structure only)

Use these as scaffolds — drop in your existing content.

1. **Hero** — vertical CN title at left, vertical poem at right, principal figure centered, soft sun glow behind, cloud band near bottom, "scroll" hint above the pill.
2. **Section page** (About / Studio / Repertoire / Contact) — top bar, eyebrow, title block, body, optional pull quote, optional meta strip, then content. Always ends above the pill with no element flush to it.
3. **Card/list page** (Season, Journal) — pager `01 / 03` row, seal-red top rule on the lead card, placeholder image at 4:5, CN title + EN subtitle + blurb + date/venue line.
4. **Menu** — full-screen drawer (see §3).

---

## 6. Do / don't

**Do**
- Treat whitespace as a material. Aim for 30–45% empty area on every screen.
- Mix vertical and horizontal Chinese type for graphic rhythm.
- Keep one — and only one — seal-red accent per screen (the stamp + an eyebrow counts as a paired unit).
- Use dashed placeholders any time real imagery is missing.

**Don't**
- Don't introduce new fonts, colors, or radii.
- Don't fill anything with seal-red. It's a stamp color, not a fill.
- Don't drop shadows on text. Shadows are for the bottom pill only.
- Don't pack more than 4 items into the bottom nav pill, or remove the English labels.
- Don't show the bottom pill while the menu drawer is open.
