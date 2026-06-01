'use client'

import Image from 'next/image'
import { useScrollParallax, type CloudLayerConfig } from '@/components/hooks/useScrollParallax'
import { hero } from '@/content/home'
import styles from './Hero.module.css'

const CLOUD_LAYERS: CloudLayerConfig[] = [
  { depth: 0.15, scale: 0.35, fade: 1.0 },
  { depth: 0.22, scale: 0.50, fade: 0.5 },
  { depth: 0.30, scale: 0.70, fade: 0.7 },
  { depth: 0.50, scale: 1.00, fade: 0.5 },
  { depth: 0.80, scale: 1.50, fade: 0.3 },
  { depth: 1.10, scale: 2.40, fade: 0.1 },
]

const WISP_BASE_OPACITIES = [0.7, 0.55, 0.4]

type CloudImage = {
  src: string
  width: number
  height: number
  mirrored?: boolean
  shiftClass?: string
}

const CLOUD_IMAGES: CloudImage[] = [
  { src: '/assets/new_clouds/cloud1_tr.png', width: 2838, height: 364 },
  { src: '/assets/new_clouds/cloud6_tr.png', width: 2992, height: 286 },
  { src: '/assets/new_clouds/cloud2_tr.png', width: 2838, height: 364 },
  { src: '/assets/new_clouds/cloud3_tr.png', width: 2992, height: 344 },
  { src: '/assets/new_clouds/cloud2_tr.png', width: 2838, height: 364, shiftClass: styles.cloudShiftLeft },
  { src: '/assets/new_clouds/cloud3_tr.png', width: 2992, height: 344, mirrored: true, shiftClass: styles.cloudShiftRight },
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
  const { titleBlockRef, titlePoemRef, setCloudRef, setWispRef } =
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
        ref={el => { setWispRef(0, el) }}
      />
      <div
        className={`${styles.cloudWisp} ${styles.wispB}`}
        ref={el => { setWispRef(1, el) }}
      />
      <div
        className={`${styles.cloudWisp} ${styles.wispC}`}
        ref={el => { setWispRef(2, el) }}
      />


      {/* Cloud layers */}
      <div className={styles.clouds} aria-hidden="true">
        {CLOUD_LAYERS.map((_, i) => (
          <div
            key={i}
            className={CLOUD_LAYER_CLASSES[i]}
            ref={el => { setCloudRef(i, el) }}
          >
            <Image
              src={CLOUD_IMAGES[i].src}
              alt=""
              width={CLOUD_IMAGES[i].width}
              height={CLOUD_IMAGES[i].height}
              className={[
                styles.cloudImg,
                CLOUD_IMAGES[i].mirrored ? styles.cloudImgMirrored : '',
                CLOUD_IMAGES[i].shiftClass ?? '',
              ].filter(Boolean).join(' ')}
              sizes="110vw"
            />
          </div>
        ))}
      </div>

    </section>
  )
}
