'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  CLOUD_LAYER_ANIMATIONS,
  CLOUD_LAYERS,
  CLOUD_WISPS,
  WISP_BASE_OPACITIES,
  getCloudLayerStyle,
} from './cloudLayerConfig'
import {
  HERO_BG,
  getHeroBgContainerStyle,
  getHeroBgFadeStyle,
  getHeroBgImageStyle,
} from './heroBgConfig'
import { useScrollParallax } from '@/components/hooks/useScrollParallax'
import { HERO_MOTION_MIN_WIDTH, useHeroMotion } from '@/components/hooks/useHeroMotion'
import { hero } from '@/content/home'
import styles from './Hero.module.css'

const CLOUD_VARIANT_CLASSES = {
  puff: styles.puff,
  wash: styles.wash,
}

const WISP_CLASSES = [
  styles.wispA,
  styles.wispB,
  styles.wispC,
]

const MOBILE_QUERY = `(max-width: ${HERO_MOTION_MIN_WIDTH - 1}px)`

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const cutoutRef = useRef<HTMLDivElement>(null)
  const [showClouds, setShowClouds] = useState(true)

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY)
    const sync = () => setShowClouds(!mobile.matches)
    sync()
    mobile.addEventListener('change', sync)
    return () => mobile.removeEventListener('change', sync)
  }, [])

  const { entranceDone } = useHeroMotion({ heroRef, veilRef, wordmarkRef, cutoutRef })

  const { mistRef, setCloudRef, setWispRef } = useScrollParallax(
    heroRef,
    CLOUD_LAYER_ANIMATIONS,
    WISP_BASE_OPACITIES,
    showClouds,
    entranceDone && showClouds,
  )

  return (
    <section className={styles.hero} ref={heroRef}>

      <div className={styles.sun} />

      <h1 className={styles.wordmark} ref={wordmarkRef}>
        <span className={styles.nameBlock}>
          <span className={styles.nameZh}>{hero.nameZh}</span>
          <span className={styles.nameEn}>{hero.nameEn}</span>
        </span>
      </h1>

      {/* Hero background */}
      <div className={styles.heroBg} style={getHeroBgContainerStyle()} ref={cutoutRef}>
        <div className={styles.heroBgFade} style={getHeroBgFadeStyle()} aria-hidden="true" />
        <Image
          src={HERO_BG.src}
          alt=""
          fill
          className={styles.heroBgImg}
          style={getHeroBgImageStyle(!showClouds)}
          sizes={HERO_BG.sizes}
          priority={HERO_BG.priority}
        />
      </div>

      {/* Cloud wisps */}
      {showClouds && CLOUD_WISPS.map((wisp, i) => (
        <div
          key={wisp.id}
          className={`${styles.cloudWisp} ${WISP_CLASSES[i]}`}
          ref={el => { setWispRef(i, el) }}
        />
      ))}


      {/* Cloud layers */}
      {showClouds && (
        <div className={styles.clouds} aria-hidden="true">
          {CLOUD_LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              className={`${styles.cloudLayer} ${CLOUD_VARIANT_CLASSES[layer.variant]}`}
              style={getCloudLayerStyle(layer)}
              ref={el => { setCloudRef(i, el) }}
            >
              <Image
                src={layer.image.src}
                alt=""
                width={layer.image.width}
                height={layer.image.height}
                className={styles.cloudImg}
                sizes="110vw"
                loading={i === 0 ? 'eager' : undefined}
              />
            </div>
          ))}
        </div>
      )}

      {showClouds && (
        <div className={styles.cloudDiveMist} ref={mistRef} aria-hidden="true" />
      )}

      <div className={styles.veil} ref={veilRef} aria-hidden="true" />

    </section>
  )
}
