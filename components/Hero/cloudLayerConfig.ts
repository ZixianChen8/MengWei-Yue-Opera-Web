import type { CSSProperties } from 'react'
import type { CloudLayerConfig } from '@/components/hooks/useScrollParallax'

type CssVariableStyle = CSSProperties & Record<`--${string}`, string | number>

type CloudLayerVariant = 'puff' | 'wash'

type CloudLayerImage = {
  src: string
  width: number
  height: number
  mirrored?: boolean
  shiftX?: string
}

type CloudLayerTint = {
  sepia: string
  saturate: string
  hue: string
  brightness: string
  contrast?: string
}

type CloudLayerLayout = {
  bottom: string
  mobileBottom: string
  opacity: number
}

export type HeroCloudLayer = {
  id: string
  variant: CloudLayerVariant
  image: CloudLayerImage
  layout: CloudLayerLayout
  tint: CloudLayerTint
  animation: CloudLayerConfig
}

export type HeroCloudWisp = {
  id: string
  baseOpacity: number
}

/**
 * Central tuning surface for the Hero cloud stack.
 *
 * Edit layer.layout for placement, layer.tint for color/filter balance,
 * and layer.animation for scroll-driven depth, scale, fade, and drift.
 */
export const CLOUD_LAYERS: HeroCloudLayer[] = [
  {
    id: 'back-pale-puff',
    variant: 'puff',
    image: { src: '/assets/new_clouds/cloud1_tr.png', width: 2838, height: 364 },
    layout: { bottom: '34%', mobileBottom: '22%', opacity: 0.3 },
    tint: { sepia: '6%', saturate: '12%', hue: '2deg', brightness: '.98', contrast: '1.16' },
    animation: { depth: 0.14, scale: 0.28, fade: 0.82, drift: -2, duration: 1, at: 0 },
  },
  {
    id: 'rear-ink-wash',
    variant: 'wash',
    image: { src: '/assets/new_clouds/cloud6_tr.png', width: 2992, height: 286 },
    layout: { bottom: '18%', mobileBottom: '14%', opacity: 0.46 },
    tint: { sepia: '8%', saturate: '14%', hue: '3deg', brightness: '.88', contrast: '1.24' },
    animation: { depth: 0.24, scale: 0.46, fade: 0.56, drift: 3, duration: 1, at: 0 },
  },
  {
    id: 'middle-cream-puff',
    variant: 'puff',
    image: { src: '/assets/new_clouds/cloud2_tr.png', width: 2838, height: 364 },
    layout: { bottom: '22%', mobileBottom: '11%', opacity: 0.62 },
    tint: { sepia: '10%', saturate: '16%', hue: '4deg', brightness: '.78', contrast: '1.3' },
    animation: { depth: 0.38, scale: 0.75, fade: 0.62, drift: -4, duration: 1, at: 0 },
  },
  {
    id: 'front-cream-pivot',
    variant: 'puff',
    image: { src: '/assets/new_clouds/cloud3_tr.png', width: 2992, height: 344 },
    layout: { bottom: '10%', mobileBottom: '5%', opacity: 0.8 },
    tint: { sepia: '12%', saturate: '18%', hue: '5deg', brightness: '.70', contrast: '1.36' },
    animation: { depth: 0.66, scale: 1.25, fade: 0.42, drift: 5, duration: 1, at: 0 },
  },
  {
    id: 'near-warm-puff',
    variant: 'puff',
    image: {
      src: '/assets/new_clouds/cloud2_tr.png',
      width: 2838,
      height: 364,
      shiftX: '-7%',
    },
    layout: { bottom: '-2%', mobileBottom: '-4%', opacity: 0.92 },
    tint: { sepia: '14%', saturate: '20%', hue: '6deg', brightness: '.62', contrast: '1.42' },
    animation: { depth: 1.02, scale: 2.05, fade: 0.18, drift: -7, duration: 1, at: 0 },
  },
  {
    id: 'nearest-warm-puff',
    variant: 'puff',
    image: {
      src: '/assets/new_clouds/cloud3_tr.png',
      width: 2992,
      height: 344,
      mirrored: true,
      shiftX: '4%',
    },
    layout: { bottom: '-12%', mobileBottom: '-12%', opacity: 1 },
    tint: { sepia: '16%', saturate: '24%', hue: '7deg', brightness: '.56', contrast: '1.48' },
    animation: { depth: 1.34, scale: 2.95, fade: 0.06, drift: 8, duration: 1, at: 0 },
  },
]

export const CLOUD_WISPS: HeroCloudWisp[] = [
  { id: 'wisp-a', baseOpacity: 0.7 },
  { id: 'wisp-b', baseOpacity: 0.55 },
  { id: 'wisp-c', baseOpacity: 0.4 },
]

export const CLOUD_LAYER_ANIMATIONS = CLOUD_LAYERS.map(layer => layer.animation)

export const WISP_BASE_OPACITIES = CLOUD_WISPS.map(wisp => wisp.baseOpacity)

export function getCloudLayerStyle(layer: HeroCloudLayer): CssVariableStyle {
  return {
    '--cloud-bottom': layer.layout.bottom,
    '--cloud-mobile-bottom': layer.layout.mobileBottom,
    '--cloud-opacity': layer.layout.opacity,
    '--cloud-shift-x': layer.image.shiftX ?? '0%',
    '--cloud-scale-x': layer.image.mirrored ? -1 : 1,
    '--tint-sepia': layer.tint.sepia,
    '--tint-saturate': layer.tint.saturate,
    '--tint-hue': layer.tint.hue,
    '--tint-brightness': layer.tint.brightness,
    '--tint-contrast': layer.tint.contrast ?? '2',
  }
}
