import type { CSSProperties } from 'react'

/**
 * Central tuning surface for the Hero character cutout.
 *
 * Edit `placement` (desktop) and `placementMobile` below — Hero.tsx applies
 * these via getHeroBgImageStyle(). Clouds / wordmark are unchanged.
 */

export type HeroBgPlacement = {
  /** contain = fit whole figure; cover = fill box (may crop) */
  objectFit: 'contain' | 'cover'
  /** object-position horizontal: left | center | right | e.g. 45% */
  positionX: string
  /** object-position vertical: top | center | bottom | e.g. 85% */
  positionY: string
  /** Zoom after object-fit (1 = no extra scale) */
  scale: number
  /** transform-origin horizontal */
  originX: string
  /** transform-origin vertical — usually bottom when figures sit on clouds */
  originY: string
  /** Nudge after scale — CSS length, e.g. 0%, -4%, 12px */
  offsetX: string
  offsetY: string
}

export const HERO_BG = {
  src: '/assets/hero_characters.webp',
  width: 3072,
  height: 2048,
  priority: true,

  /**
   * Next/Image `sizes` — tells the browser how wide the image renders for
   * srcset selection. Does NOT change on-screen size (use placement.scale).
   */
  sizes: '140vw',

  /** Fill behind the WebP — keep transparent so wordmark shows through alpha */
  background: 'transparent',

  /** 0 = invisible, 1 = full opacity */
  opacity: 1,

  /** Desktop / default character sizing & position */
  placement: {
    objectFit: 'contain',
    positionX: 'center',
    positionY: 'bottom',
    scale: 1,
    originX: 'center',
    originY: 'bottom',
    offsetX: '0%',
    offsetY: '-10%',
  } satisfies HeroBgPlacement,

  /**
   * Mobile (≤767px) overrides — only listed keys replace desktop values.
   * Leave empty `{}` to use desktop placement on mobile.
   */
  placementMobile: {
    scale: 1.75,
    positionY: 'bottom',
    offsetY: '0%',
  } satisfies Partial<HeroBgPlacement>,

  tint: {
    sepia: '0%',
    saturate: '60%',
    hueRotate: '40deg',
    brightness: '.9',
    contrast: '1',
  },

  /** Bottom fade into the cloud stack */
  gradientFade: {
    start: '40%',
    endColor: 'var(--cloud)',
  },
} as const

function resolvePlacement(mobile: boolean): HeroBgPlacement {
  const base = HERO_BG.placement
  if (!mobile) return base
  return { ...base, ...HERO_BG.placementMobile }
}

function buildTransform(p: HeroBgPlacement): string | undefined {
  const parts: string[] = []
  if (p.offsetX !== '0%' && p.offsetX !== '0') parts.push(`translateX(${p.offsetX})`)
  if (p.offsetY !== '0%' && p.offsetY !== '0') parts.push(`translateY(${p.offsetY})`)
  if (p.scale !== 1) parts.push(`scale(${p.scale})`)
  return parts.length > 0 ? parts.join(' ') : undefined
}

export function getHeroBgContainerStyle(): CSSProperties {
  return {
    background: HERO_BG.background,
  }
}

export function getHeroBgImageStyle(mobile = false): CSSProperties {
  const p = resolvePlacement(mobile)
  const { tint, opacity } = HERO_BG

  return {
    objectFit: p.objectFit,
    objectPosition: `${p.positionX} ${p.positionY}`,
    transformOrigin: `${p.originX} ${p.originY}`,
    transform: buildTransform(p),
    opacity,
    filter: [
      `sepia(${tint.sepia})`,
      `saturate(${tint.saturate})`,
      `hue-rotate(${tint.hueRotate})`,
      `brightness(${tint.brightness})`,
      `contrast(${tint.contrast})`,
    ].join(' '),
  }
}

export function getHeroBgFadeStyle(): CSSProperties {
  const { gradientFade } = HERO_BG

  return {
    background: `linear-gradient(to bottom, transparent ${gradientFade.start}, ${gradientFade.endColor} 100%)`,
  }
}
