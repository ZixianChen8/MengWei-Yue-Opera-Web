'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'

export type MenuMotionState = 'closed' | 'opening' | 'open' | 'closing'

type Opts = {
  overlayRef: React.RefObject<HTMLElement | null>
  panelRef: React.RefObject<HTMLElement | null>
  state: MenuMotionState
  setState: (s: MenuMotionState) => void
  enabled: boolean
  isOpenClass: string
  onClosed?: () => void
}

gsap.registerPlugin(CustomEase)

/** cubic-bezier(0.76, 0, 0.24, 1) — continuous ease-in-out, no mid flat. */
const CURTAIN_EASE =
  typeof window !== 'undefined'
    ? CustomEase.create('menuCurtain', 'M0,0 C0.76,0 0.24,1 1,1')
    : 'power2.inOut'

const CONTENT_EASE = 'power3.out'

/** Full curtain travel — content is nested inside so reverse never holds. */
const CURTAIN_DUR = 1.0

/** Reveal menu content at 70% of curtain travel. */
const CONTENT_AT = CURTAIN_DUR * 0.7

/** Bottom-edge samples (left → right) for a smooth rounded curtain. */
const CURTAIN_ARC_STEPS = 11

/**
 * Rounded curtain clip-path (half-sine bottom edge — not a sharp V).
 * Vertex count/order stay identical for every (sideY, apexY) pair.
 */
function curtainClip(sideY: number, apexY: number): string {
  const fmt = (n: number) => `${n.toFixed(2)}%`
  const bottomLtr: string[] = []
  for (let i = 0; i < CURTAIN_ARC_STEPS; i++) {
    const t = i / (CURTAIN_ARC_STEPS - 1)
    const y = sideY + (apexY - sideY) * Math.sin(Math.PI * t)
    bottomLtr.push(`${fmt(t * 100)} ${fmt(y)}`)
  }
  return `polygon(${fmt(0)} ${fmt(0)}, ${fmt(100)} ${fmt(0)}, ${[...bottomLtr].reverse().join(', ')})`
}

const CLIP_CLOSED = curtainClip(0, 0)
const CLIP_OPEN = curtainClip(100, 100)

/** Bow: sides sit higher than the soft center apex. */
const BOW_SIDE = 84
const BOW_APEX = 100

/**
 * Progress 0 → 1 expands closed → bowed round curtain.
 * Progress 1 → 2 flattens the arc into a full rectangle.
 */
function curtainFromProgress(progress: number): string {
  const p = Math.max(0, Math.min(2, progress))
  if (p <= 1) {
    return curtainClip(BOW_SIDE * p, BOW_APEX * p)
  }
  const t = p - 1
  return curtainClip(BOW_SIDE + (100 - BOW_SIDE) * t, BOW_APEX)
}

function applyCurtain(panel: HTMLElement, progress: number) {
  panel.style.clipPath = curtainFromProgress(progress)
}

export function useDesktopMenuMotion({
  overlayRef,
  panelRef,
  state,
  setState,
  enabled,
  isOpenClass,
  onClosed,
}: Opts) {
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const curtainRef = useRef({ p: 0 })
  const onClosedRef = useRef(onClosed)
  const setStateRef = useRef(setState)
  const phaseRef = useRef<MenuMotionState>('closed')
  const isOpenClassRef = useRef(isOpenClass)

  useEffect(() => {
    onClosedRef.current = onClosed
  }, [onClosed])

  useEffect(() => {
    setStateRef.current = setState
  }, [setState])

  useEffect(() => {
    isOpenClassRef.current = isOpenClass
  }, [isOpenClass])

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
      tlRef.current = null
      phaseRef.current = 'closed'
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      tlRef.current?.kill()
      tlRef.current = null
      phaseRef.current = 'closed'
      curtainRef.current.p = 0
      const overlay = overlayRef.current
      const panel = panelRef.current
      if (overlay) {
        overlay.hidden = true
        overlay.classList.remove(isOpenClass)
      }
      if (panel) gsap.set(panel, { clipPath: CLIP_CLOSED })
      return
    }

    if (state === phaseRef.current) return
    if (state !== 'opening' && state !== 'closing') {
      phaseRef.current = state
      return
    }

    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const mediaItems = gsap.utils.toArray<HTMLElement>(
      overlay.querySelectorAll('[data-menu-media-mask]'),
    )
    const linkItems = gsap.utils.toArray<HTMLElement>(
      overlay.querySelectorAll('[data-menu-link-mask]'),
    )
    const activeMark = overlay.querySelector<HTMLElement>('[data-menu-active-mark]')
    const support = overlay.querySelector<HTMLElement>('[data-menu-support]')
    const content = [...mediaItems, ...linkItems, ...(support ? [support] : [])]

    const setContentHidden = () => {
      gsap.set(mediaItems, { autoAlpha: 0, y: 16, clearProps: 'clipPath' })
      gsap.set(linkItems, { autoAlpha: 0, y: 14, clearProps: 'clipPath' })
      if (activeMark) gsap.set(activeMark, { scaleX: 0, transformOrigin: 'left center' })
      if (support) gsap.set(support, { autoAlpha: 0, y: 12 })
    }

    const setContentVisible = () => {
      gsap.set(content, { autoAlpha: 1, y: 0, clearProps: 'clipPath' })
      if (activeMark) gsap.set(activeMark, { scaleX: 1, clearProps: 'transform' })
    }

    const settleOpen = () => {
      applyCurtain(panel, 2)
      phaseRef.current = 'open'
      setStateRef.current('open')
    }

    const settleClosed = () => {
      overlay.hidden = true
      overlay.classList.remove(isOpenClassRef.current)
      applyCurtain(panel, 0)
      setContentHidden()
      phaseRef.current = 'closed'
      setStateRef.current('closed')
      onClosedRef.current?.()
    }

    if (reduce) {
      phaseRef.current = state
      if (state === 'opening') {
        overlay.hidden = false
        overlay.classList.add(isOpenClass)
        gsap.set(panel, { clipPath: CLIP_OPEN })
        setContentVisible()
        settleOpen()
      } else {
        settleClosed()
      }
      return
    }

    const ensureTimeline = () => {
      if (tlRef.current) return tlRef.current

      const curtain = curtainRef.current
      curtain.p = 0
      applyCurtain(panel, 0)
      setContentHidden()

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: CONTENT_EASE },
        onComplete: settleOpen,
        onReverseComplete: settleClosed,
      })

      // One continuous curtain motion across the full timeline (single ease).
      tl.fromTo(
        curtain,
        { p: 0 },
        {
          p: 2,
          duration: CURTAIN_DUR,
          ease: CURTAIN_EASE,
          onUpdate: () => applyCurtain(panel, curtain.p),
        },
        0,
      )

      // Content fits in the final 30% so open never holds on empty black,
      // and close never holds a full curtain while content exits alone.
      tl.to(
        mediaItems,
        { autoAlpha: 1, y: 0, duration: 0.24, stagger: { amount: 0.06 } },
        CONTENT_AT,
      )
      tl.to(
        linkItems,
        { autoAlpha: 1, y: 0, duration: 0.24, stagger: { amount: 0.06 } },
        CONTENT_AT,
      )
      if (activeMark) {
        tl.to(activeMark, { scaleX: 1, duration: 0.2 }, CONTENT_AT + 0.08)
      }
      if (support) {
        tl.to(support, { autoAlpha: 1, y: 0, duration: 0.2 }, CONTENT_AT + 0.1)
      }

      tlRef.current = tl
      return tl
    }

    phaseRef.current = state

    if (state === 'opening') {
      overlay.hidden = false
      overlay.classList.add(isOpenClass)
      ensureTimeline().play()
      return
    }

    // closing — reverse from current progress; content exit overlaps curtain retract
    const tl = tlRef.current
    if (!tl) {
      settleClosed()
      return
    }
    tl.reverse()
  }, [state, enabled, overlayRef, panelRef, isOpenClass])
}
