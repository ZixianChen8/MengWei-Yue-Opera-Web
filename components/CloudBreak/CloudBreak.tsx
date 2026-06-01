'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import styles from './CloudBreak.module.css'

const LAYERS = [
  { src: '/assets/new_clouds/cloud2_tr.png', width: 2838, height: 364, cls: 'l1', mirrored: false },
  { src: '/assets/new_clouds/cloud3_tr.png', width: 2992, height: 344, cls: 'l2', mirrored: false },
  { src: '/assets/new_clouds/cloud1_tr.png', width: 2838, height: 364, cls: 'l3', mirrored: false },
  { src: '/assets/new_clouds/cloud2_tr.png', width: 2838, height: 364, cls: 'l4', mirrored: true, shiftClass: styles.shiftLeft },
  { src: '/assets/new_clouds/cloud6_tr.png', width: 2992, height: 286, cls: 'l5', mirrored: true },
  { src: '/assets/new_clouds/cloud3_tr.png', width: 2992, height: 344, cls: 'l6', mirrored: false, shiftClass: styles.shiftRight },
] as const

// Per-layer parallax config: [xFactorPx, yFactorPx, scaleFactor]
const PARALLAX: Record<string, [number, number, number]> = {
  l1: [ 8, -5, 0.008],
  l2: [-9, -4, 0.006],
  l3: [12, -7, 0.01],
  l4: [-8, -8, 0.012],
  l5: [ 6, -4, 0.008],
  l6: [-14, -9, 0.015],
}

export default function CloudBreak() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let raf: number | null = null

    function update() {
      const section = sectionRef.current
      if (!section) { raf = null; return }

      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const raw = (vh - rect.top) / (vh + rect.height)
      const p = Math.max(0, Math.min(1, raw))
      const ease = p * p * (3 - 2 * p)

      layerRefs.current.forEach((el, i) => {
        if (!el) return
        const cls = LAYERS[i].cls
        const [xf, yf, sf] = PARALLAX[cls]
        el.style.transform = `translate3d(${ease * xf}px, ${ease * yf}px, 0) scale(${1 + ease * sf})`
      })

      raf = null
    }

    function scheduleUpdate() {
      if (raf === null) raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    update()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={styles.cloudBreak} ref={sectionRef} aria-hidden="true">
      {LAYERS.map((layer, i) => (
        <div
          key={layer.cls}
          ref={el => { layerRefs.current[i] = el }}
          className={`${styles.layer} ${styles[layer.cls]}`}
        >
          <Image
            src={layer.src}
            alt=""
            width={layer.width}
            height={layer.height}
            className={[
              styles.img,
              layer.mirrored ? styles.mirrored : '',
              'shiftClass' in layer ? layer.shiftClass : '',
            ].filter(Boolean).join(' ')}
            sizes="120vw"
          />
        </div>
      ))}
    </div>
  )
}
