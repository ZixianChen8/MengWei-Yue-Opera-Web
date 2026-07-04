import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ---------------------------------------------------------------------------
// Shared scroll-storytelling primitives for the landing page.
//
// Every landing section wires its GSAP work inside a `gsap.context(scope)` and
// a `gsap.matchMedia()` (mirroring the hero's `useScrollParallax`), returning
// `ctx.revert()` + `media.revert()` on unmount. The tokens and helpers here
// keep the motion language (ease/duration/travel) and the responsive
// breakpoints consistent across sections.
//
// Only transform/opacity are ever animated, and reduced-motion is a hard
// no-transform / no-pin path (see the MM_* queries below).
// ---------------------------------------------------------------------------

/** Shared cinematic ease for story reveals/timelines. */
export const STORY_EASE = 'power3.out'

/** Default duration (seconds) for a reveal fade/rise. */
export const REVEAL_DUR = 0.9

/** Default upward travel (px) an element rises through as it reveals. */
export const REVEAL_Y = 28

// matchMedia breakpoints, used per-section so the three motion tiers stay
// identical everywhere:
//   - MM_DESKTOP: full cinematic incl. pinned chapters.
//   - MM_MOBILE : reveals + light parallax, NO pins.
//   - MM_REDUCED: everything visible, no transforms/pins.
export const MM_DESKTOP =
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
export const MM_MOBILE =
  '(max-width: 1023px) and (prefers-reduced-motion: no-preference)'
export const MM_REDUCED = '(prefers-reduced-motion: reduce)'

export interface RevealBatchOptions {
  /** Trigger line for each element (default 'top 82%'). */
  start?: string
  /** Per-item stagger in seconds (default 0.12). */
  stagger?: number
  /** Upward travel in px (default REVEAL_Y). */
  y?: number
  /** Reveal duration in seconds (default REVEAL_DUR). */
  duration?: number
}

/**
 * Fade/rise a group of elements in with a stagger the first time each enters
 * the viewport. Uses `ScrollTrigger.batch` so elements that are already grouped
 * on-screen reveal together rather than one ScrollTrigger firing per element.
 *
 * Reveal-once (`once: true`); elements are set hidden immediately so there's no
 * flash of the final state before the trigger fires. Must be called inside a
 * `gsap.context(scope)` so the created ScrollTriggers are reverted on unmount.
 *
 * @param scope    the section root the selector is queried within
 * @param selector CSS selector (relative to scope) for the elements to reveal
 */
export function revealBatch(
  scope: Element,
  selector: string,
  options: RevealBatchOptions = {},
) {
  const targets = gsap.utils.toArray<HTMLElement>(scope.querySelectorAll(selector))
  if (targets.length === 0) return

  const { start = 'top 82%', stagger = 0.12, y = REVEAL_Y, duration = REVEAL_DUR } =
    options

  gsap.set(targets, { autoAlpha: 0, y, willChange: 'transform, opacity' })

  ScrollTrigger.batch(targets, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration,
        ease: STORY_EASE,
        stagger,
        overwrite: true,
        onComplete: () => gsap.set(batch, { clearProps: 'willChange' }),
      }),
  })
}
