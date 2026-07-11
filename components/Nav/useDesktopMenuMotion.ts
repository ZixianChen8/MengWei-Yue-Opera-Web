'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

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

const PANEL_EASE = 'power4.inOut'
const CONTENT_EASE = 'power3.out'

const CLIP_CLOSED = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
const CLIP_BOW = 'polygon(0% 0%, 100% 0%, 100% 88%, 50% 100%, 0% 88%)'
const CLIP_OPEN = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

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
  const onClosedRef = useRef(onClosed)

  useEffect(() => {
    onClosedRef.current = onClosed
  }, [onClosed])

  useEffect(() => {
    if (!enabled) {
      tlRef.current?.kill()
      tlRef.current = null
      return
    }

    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) return

    const mediaMasks = gsap.utils.toArray<HTMLElement>(
      overlay.querySelectorAll('[data-menu-media-mask]'),
    )
    const linkInners = gsap.utils.toArray<HTMLElement>(
      overlay.querySelectorAll('[data-menu-link-mask] > *'),
    )
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
      overlay.classList.add(isOpenClass)

      if (reduce) {
        gsap.set(panel, { clipPath: CLIP_OPEN })
        gsap.set([...mediaMasks, ...linkInners], { clearProps: 'clipPath,transform,opacity,visibility' })
        if (activeMark) gsap.set(activeMark, { scaleX: 1, clearProps: 'transform' })
        if (support) gsap.set(support, { autoAlpha: 1, y: 0 })
        setState('open')
        return kill
      }

      gsap.set(panel, { clipPath: CLIP_CLOSED })
      gsap.set(mediaMasks, { clipPath: 'inset(0 0 100% 0)', y: 12 })
      gsap.set(linkInners, { yPercent: 110 })
      if (activeMark) gsap.set(activeMark, { scaleX: 0, transformOrigin: 'left center' })
      if (support) gsap.set(support, { autoAlpha: 0, y: 12 })

      const tl = gsap.timeline({
        defaults: { ease: CONTENT_EASE },
        onComplete: () => setState('open'),
      })
      tlRef.current = tl

      tl.to(panel, { clipPath: CLIP_BOW, duration: 0.55, ease: PANEL_EASE }, 0)
      tl.to(panel, { clipPath: CLIP_OPEN, duration: 0.3, ease: PANEL_EASE }, 0.45)
      tl.to(
        mediaMasks,
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.55, stagger: 0.08 },
        0.35,
      )
      tl.to(linkInners, { yPercent: 0, duration: 0.55, stagger: 0.07 }, 0.45)
      if (activeMark) tl.to(activeMark, { scaleX: 1, duration: 0.35 }, '>-0.1')
      if (support) tl.to(support, { autoAlpha: 1, y: 0, duration: 0.35 }, '>-0.05')
    }

    if (state === 'closing') {
      kill()

      if (reduce) {
        overlay.hidden = true
        overlay.classList.remove(isOpenClass)
        setState('closed')
        onClosedRef.current?.()
        return kill
      }

      const tl = gsap.timeline({
        defaults: { ease: CONTENT_EASE },
        onComplete: () => {
          overlay.hidden = true
          overlay.classList.remove(isOpenClass)
          setState('closed')
          onClosedRef.current?.()
        },
      })
      tlRef.current = tl

      if (support) tl.to(support, { autoAlpha: 0, y: 8, duration: 0.2 }, 0)
      if (activeMark) tl.to(activeMark, { scaleX: 0, duration: 0.2 }, 0)
      tl.to(
        linkInners,
        { yPercent: 110, duration: 0.35, stagger: { each: 0.05, from: 'end' } },
        0.05,
      )
      tl.to(
        mediaMasks,
        {
          clipPath: 'inset(0 0 100% 0)',
          y: 8,
          duration: 0.35,
          stagger: { each: 0.05, from: 'end' },
        },
        0.1,
      )
      tl.to(panel, { clipPath: CLIP_BOW, duration: 0.25, ease: PANEL_EASE }, 0.25)
      tl.to(panel, { clipPath: CLIP_CLOSED, duration: 0.45, ease: PANEL_EASE }, 0.4)
    }

    return kill
  }, [state, enabled, overlayRef, panelRef, setState, isOpenClass])
}
