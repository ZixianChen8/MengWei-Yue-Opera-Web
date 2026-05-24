'use client'

import Image from 'next/image'
import { useScrollParallax, type CloudLayerConfig } from '@/components/hooks/useScrollParallax'
import { hero } from '@/content/home'
import styles from './Hero.module.css'

const CLOUD_LAYERS: CloudLayerConfig[] = [
  { depth: 0.15, scale: 0.35, fade: 1.0 }, // cloud-1 / cloud-l1
  { depth: 0.22, scale: 0.50, fade: 0.5 }, // cloud-6 / cloud-lw
  { depth: 0.30, scale: 0.70, fade: 0.7 }, // cloud-5 / cloud-l2
  { depth: 0.50, scale: 1.00, fade: 0.5 }, // cloud-3 / cloud-l3
  { depth: 0.80, scale: 1.50, fade: 0.3 }, // cloud-4 / cloud-l4
  { depth: 1.10, scale: 2.40, fade: 0.1 }, // cloud-4 mirrored / cloud-l5
]

const WISP_BASE_OPACITIES = [0.7, 0.55, 0.4]

// Cloud layer image data: [src, width, height]
const CLOUD_IMAGES: [string, number, number][] = [
  ['/assets/cloud-1.png', 2838, 364],
  ['/assets/cloud-6.png', 2992, 286],
  ['/assets/cloud-5.png', 2992, 262],
  ['/assets/cloud-3.png', 2992, 344],
  ['/assets/cloud-4.png', 2992, 364],
  ['/assets/cloud-4.png', 2992, 364], // mirrored
]

const CLOUD_LAYER_CLASSES = [
  `${styles.cloudLayer} ${styles.puff} ${styles.cloudL1}`,
  `${styles.cloudLayer} ${styles.wash} ${styles.cloudLw}`,
  `${styles.cloudLayer} ${styles.puff} ${styles.cloudL2}`,
  `${styles.cloudLayer} ${styles.puff} ${styles.cloudL3}`,
  `${styles.cloudLayer} ${styles.puff} ${styles.cloudL4}`,
  `${styles.cloudLayer} ${styles.puff} ${styles.cloudL5}`,
]

export default function Hero() {
  const { cloudRefs, wispRefs, figureRef, titleBlockRef, titlePoemRef, scrollHintRef } =
    useScrollParallax(CLOUD_LAYERS, WISP_BASE_OPACITIES)

  return (
    <section className={styles.hero}>

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
      <div
        className={`${styles.cloudWisp} ${styles.wispA}`}
        ref={el => { wispRefs.current[0] = el }}
      />
      <div
        className={`${styles.cloudWisp} ${styles.wispB}`}
        ref={el => { wispRefs.current[1] = el }}
      />
      <div
        className={`${styles.cloudWisp} ${styles.wispC}`}
        ref={el => { wispRefs.current[2] = el }}
      />


      {/* Cloud layers */}
      <div className={styles.clouds} aria-hidden="true">
        {CLOUD_LAYERS.map((_, i) => (
          <div
            key={i}
            className={CLOUD_LAYER_CLASSES[i]}
            ref={el => { cloudRefs.current[i] = el }}
          >
            <Image
              src={CLOUD_IMAGES[i][0]}
              alt=""
              width={CLOUD_IMAGES[i][1]}
              height={CLOUD_IMAGES[i][2]}
              className={i === 5 ? styles.cloudImgMirrored : styles.cloudImg}
              sizes="110vw"
            />
          </div>
        ))}
      </div>

    </section>
  )
}
