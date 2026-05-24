'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import styles from './CloudBreak.module.css'

const LAYERS = [
  { src: '/assets/cloud-2.png', width: 2838, height: 364, cls: 'l1', mirrored: true },
  { src: '/assets/cloud-5.png', width: 2992, height: 262, cls: 'l2', mirrored: false },
  { src: '/assets/cloud-1.png', width: 2838, height: 364, cls: 'l3', mirrored: false },
  { src: '/assets/cloud-4.png', width: 2992, height: 364, cls: 'l4', mirrored: true },
  { src: '/assets/cloud-6.png', width: 2992, height: 286, cls: 'l5', mirrored: true },
  { src: '/assets/cloud-3.png', width: 2992, height: 344, cls: 'l6', mirrored: false },
] as const

// Per-layer parallax config: [xFactor, yFactor, scaleFactor]
const PARALLAX: Record<string, [number, number, number]> = {
  l1: [ 18, -12, 0.02],
  l2: [-22,  -8, 0.015],
  l3: [ 28, -18, 0.025],
  l4: [-16, -22, 0.03],
  l5: [ 12, -10, 0.02],
  l6: [-32, -28, 0.05],
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
            className={`${styles.img}${layer.mirrored ? ' ' + styles.mirrored : ''}`}
            sizes="120vw"
          />
        </div>
      ))}
    </div>
  )
}
