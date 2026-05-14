'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import styles from './CloudBreak.module.css'

export default function CloudBreak() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const backLayerRef = useRef<HTMLDivElement>(null)
  const frontLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number | null = null

    function update() {
      const section = sectionRef.current
      const backLayer = backLayerRef.current
      const frontLayer = frontLayerRef.current

      if (!section || !backLayer || !frontLayer) {
        raf = null
        return
      }

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height)
      const progress = Math.max(0, Math.min(1, rawProgress))
      const ease = progress * progress * (3 - 2 * progress)

      backLayer.style.transform =
        `translate3d(${ease * 26}px, ${ease * -42}px, 0) scale(${1 + ease * 0.035})`
      backLayer.style.opacity = String(0.45 + ease * 0.1)

      frontLayer.style.transform =
        `translate3d(${ease * -38}px, ${ease * -82}px, 0) scale(${1 + ease * 0.06})`
      frontLayer.style.opacity = String(0.95 - ease * 0.12)

      raf = null
    }

    function scheduleUpdate() {
      if (raf === null) {
        raf = requestAnimationFrame(update)
      }
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
      <div className={`${styles.layer} ${styles.cb2}`} ref={backLayerRef}>
        <Image
          src="/assets/cloud-6.png"
          alt=""
          width={2992}
          height={286}
          className={`${styles.img} ${styles.mirrored}`}
          sizes="120vw"
        />
      </div>
      <div className={`${styles.layer} ${styles.cb1}`} ref={frontLayerRef}>
        <Image
          src="/assets/cloud-3.png"
          alt=""
          width={2992}
          height={344}
          className={styles.img}
          sizes="120vw"
        />
      </div>
    </div>
  )
}
