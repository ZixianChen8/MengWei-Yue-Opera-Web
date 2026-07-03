'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  CLOUD_LAYER_ANIMATIONS,
  CLOUD_LAYERS,
  CLOUD_WISPS,
  WISP_BASE_OPACITIES,
  getCloudLayerStyle,
} from './cloudLayerConfig'
import { useScrollParallax } from '@/components/hooks/useScrollParallax'
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

const MOBILE_QUERY = '(max-width: 767px)'

export default function Hero() {
  const [showClouds, setShowClouds] = useState(true)

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE_QUERY)
    const sync = () => setShowClouds(!mobile.matches)
    sync()
    mobile.addEventListener('change', sync)
    return () => mobile.removeEventListener('change', sync)
  }, [])

  const { heroRef, titleBlockRef, titlePoemRef, mistRef, setCloudRef, setWispRef } =
    useScrollParallax(CLOUD_LAYER_ANIMATIONS, WISP_BASE_OPACITIES, showClouds)

  return (
    <section className={styles.hero} ref={heroRef}>

      <div className={styles.sun} />

      {/* Hero background */}
      <div className={styles.heroBg}>
        <Image
          src="/assets/bg1-exp.webp"
          alt=""
          fill
          className={styles.heroBgImg}
          sizes="100vw"
          priority
        />
      </div>

      {/* Title */}
      <div className={styles.titleBlock} ref={titleBlockRef}>
        <div className={styles.titleMeta}>{hero.meta}</div>
        <div className={styles.titleChars}>
          {hero.titleChars.map((char, i) => (
            <span key={i}>
              {i === hero.titleRedIndex
                ? <span className={styles.red}>{char}</span>
                : char}
              {i < hero.titleChars.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>

      {/* Poem */}
      <div className={styles.titlePoem} ref={titlePoemRef}>
        {hero.poem.zh}<br />
        <span className={styles.poemSmall}>{hero.poem.en}</span>
        <span className={styles.stamp}>
          <span className={styles.stampGlyph}>{hero.poem.stamp}</span>
        </span>
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

    </section>
  )
}
