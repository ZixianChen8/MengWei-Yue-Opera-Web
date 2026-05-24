# Design System: MengWei Eyewear (国风·鸽磁)

**Style:** Chinese Guofeng (国风) Ink Wash — traditional Chinese ink painting aesthetic applied to modern e-commerce for eyewear.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#F8F4EE` | Page background (parchment/cream) |
| `--color-surface` | `#FFFFFF` | Cards, elevated panels |
| `--color-ink` | `#1A1A1A` | Primary text (ink black) |
| `--color-ink-secondary` | `#4D4540` | Secondary text, captions |
| `--color-ink-muted` | `#8C847C` | Placeholder, disabled text |
| `--color-vermillion` | `#C03A2B` | Primary accent (Chinese red/seal) |
| `--color-vermillion-dark` | `#8B1E12` | Hover/active state for accent |
| `--color-rose-muted` | `#D4A5A5` | Floral decorative tint |
| `--color-burgundy` | `#6B2737` | Deep accent, leaf tones |
| `--color-sage` | `#7A8C6E` | Botanical green accent |
| `--color-border` | `#E2DAD1` | Dividers, card borders |
| `--color-overlay` | `rgba(248,244,238,0.72)` | Text-over-image overlays |

```css
:root {
  --color-bg:              #F8F4EE;
  --color-surface:         #FFFFFF;
  --color-ink:             #1A1A1A;
  --color-ink-secondary:   #4D4540;
  --color-ink-muted:       #8C847C;
  --color-vermillion:      #C03A2B;
  --color-vermillion-dark: #8B1E12;
  --color-rose-muted:      #D4A5A5;
  --color-burgundy:        #6B2737;
  --color-sage:            #7A8C6E;
  --color-border:          #E2DAD1;
  --color-overlay:         rgba(248, 244, 238, 0.72);
}
```

---

## Typography

### Font Stack

| Role | Font | Weights | CSS |
|---|---|---|---|
| Display / Heading | Noto Serif SC | 400, 600, 700 | `font-family: 'Noto Serif SC', 'Source Han Serif SC', serif` |
| Body / UI | Noto Sans SC | 300, 400, 500 | `font-family: 'Noto Sans SC', 'Source Han Sans SC', sans-serif` |
| Price / Numerals | — | — | `font-variant-numeric: tabular-nums` applied to price elements |

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500&family=Noto+Serif+SC:wght@400;600;700&display=swap');
```

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-display` | 48px | 700 | 1.2 | Brand name hero |
| `--text-h1` | 32px | 600 | 1.3 | Section headings (Serif) |
| `--text-h2` | 24px | 600 | 1.4 | Sub-headings (Serif) |
| `--text-h3` | 18px | 500 | 1.4 | Product titles |
| `--text-body` | 16px | 400 | 1.75 | Body copy |
| `--text-caption` | 13px | 300 | 1.6 | Price secondary, labels |
| `--text-price` | 20px | 500 | 1.2 | Price display |

---

## Spacing System

8pt base grid:

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;
  --space-10: 128px;
}
```

---

## Layout

| Token | Value | Usage |
|---|---|---|
| `--container-max` | `1200px` | Max content width |
| `--container-gutter` | `48px` (desktop) / `20px` (mobile) | Horizontal padding |
| `--grid-cols-product` | `4` (desktop) / `2` (mobile) | Product listing grid |
| `--grid-gap` | `24px` | Gap between product cards |
| `--section-spacing` | `80px` (desktop) / `48px` (mobile) | Vertical section rhythm |

---

## Border & Radius

```css
:root {
  --radius-sm:   4px;    /* buttons, inputs */
  --radius-md:   8px;    /* cards */
  --radius-lg:   16px;   /* modals, panels */
  --radius-pill: 999px;  /* tags, badges */

  --border-default: 1px solid var(--color-border);
  --border-accent:  1px solid var(--color-vermillion);
}
```

---

## Elevation & Shadow

Very minimal — the aesthetic uses botanical illustration as depth, not drop shadows:

```css
:root {
  --shadow-card:  0 1px 4px rgba(0, 0, 0, 0.06);
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.10);
  --shadow-none:  none; /* default for most elements */
}
```

---

## Decorative System (Ink Wash Specific)

These define the guofeng character of the design:

| Element | Implementation |
|---|---|
| **Botanical overlays** | `<img>` or `background-image` with `mix-blend-mode: multiply` on cream bg |
| **Red seal stamp** | Square element with `background: var(--color-vermillion)`, rotated `~-3deg`, white Chinese character inside |
| **Vertical text** | `writing-mode: vertical-rl; text-orientation: mixed;` on decorative copy |
| **Section dividers** | Thin `1px` line at `0.3` opacity, or ink-brush SVG stroke |
| **Background texture** | Subtle noise/grain overlay at 3–5% opacity for parchment feel |
| **Butterfly/bird motifs** | Absolutely positioned PNG with `pointer-events: none; mix-blend-mode: multiply` |

```css
/* Botanical illustration overlay */
.botanical-decor {
  position: absolute;
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: 0.85;
}

/* Red seal stamp */
.seal-stamp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-vermillion);
  color: #fff;
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  transform: rotate(-3deg);
}
```

---

## Component Tokens

### Product Card

```css
.product-card {
  background: var(--color-surface);
  border: var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-card);
}

.product-card__name {
  font-family: 'Noto Serif SC', serif;
  font-size: 15px;
  color: var(--color-ink);
}

.product-card__price {
  font-size: var(--text-price);
  color: var(--color-vermillion);
  font-variant-numeric: tabular-nums;
}
```

### CTA Button — Primary

```css
.btn-primary {
  background: var(--color-vermillion);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 28px;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: background 200ms ease-out;
}

.btn-primary:hover {
  background: var(--color-vermillion-dark);
}
```

### CTA Button — Ghost / Outline

```css
.btn-outline {
  background: transparent;
  color: var(--color-vermillion);
  border: 1px solid var(--color-vermillion);
  border-radius: var(--radius-sm);
  padding: 9px 28px;
  font-size: 14px;
  transition: background 200ms ease-out, color 200ms ease-out;
}

.btn-outline:hover {
  background: var(--color-vermillion);
  color: #fff;
}
```

---

## Animation

```css
:root {
  --duration-micro:    150ms;
  --duration-base:     250ms;
  --duration-slow:     400ms;
  --easing-enter:      cubic-bezier(0.0, 0.0, 0.2, 1);
  --easing-exit:       cubic-bezier(0.4, 0.0, 1, 1);
  --easing-standard:   cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

Animations are **restrained** — only entrance of product sections (fade + slight translate-y), hover on cards (shadow lift), and image hover (subtle scale). No decorative motion.

---

## Breakpoints

```css
:root {
  --bp-sm:  375px;
  --bp-md:  768px;
  --bp-lg:  1024px;
  --bp-xl:  1440px;
}
```

---

## Anti-Patterns

Avoid these patterns to preserve the ink wash aesthetic:

- No heavy drop shadows or glassmorphism effects
- No bright saturated colors (neon, vibrant blue, etc.)
- No geometric/angular decorative shapes — all decoration is organic/botanical
- No emoji as icons — use SVG or Chinese character glyphs
- No dense, cluttered layouts — generous whitespace is essential
- Do not mix Latin-only fonts for Chinese copy; always use CJK-compatible typefaces
