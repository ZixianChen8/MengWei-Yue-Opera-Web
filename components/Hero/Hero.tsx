'use client'

import Image from 'next/image'
import { useScrollParallax, type CloudLayerConfig } from '@/components/hooks/useScrollParallax'
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

      <div className={styles.mountains} aria-hidden="true">
        <svg viewBox="0 0 1600 240" preserveAspectRatio="none">
          <path
            d="M0,220 L0,150 C 80,130 140,90 220,110 C 300,130 360,80 460,95 C 540,108 600,70 700,85 C 800,100 880,60 980,80 C 1080,100 1160,70 1260,90 C 1360,110 1460,80 1600,100 L1600,240 L0,240 Z"
            fill="oklch(0.30 0.012 50)"
          />
          <path
            d="M0,240 L0,180 C 120,160 220,170 340,150 C 460,130 560,170 700,150 C 840,130 940,165 1080,148 C 1220,131 1340,165 1600,150 L1600,240 Z"
            fill="oklch(0.50 0.012 50)"
            opacity=".6"
          />
        </svg>
      </div>

      {/* Crane silhouettes */}
      <svg className={`${styles.crane} ${styles.c1}`} viewBox="0 0 80 30">
        <path d="M2,18 C 14,8 22,8 30,14 C 36,18 42,10 50,14 C 58,18 68,14 78,8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <svg className={`${styles.crane} ${styles.c2}`} viewBox="0 0 80 30">
        <path d="M2,16 C 14,10 22,12 32,14 C 42,16 52,12 78,10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <svg className={`${styles.crane} ${styles.c3}`} viewBox="0 0 80 30">
        <path d="M2,14 C 12,20 22,18 32,14 C 42,10 52,14 62,16 C 70,18 76,14 78,12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>

      {/* Principal portrait placeholder */}
      <div
        className={styles.figureWrap}
        ref={figureRef}
      >
        <div className={styles.figure}>
          <div className={styles.phCn}>水袖</div>
          <div className={styles.phEn}>[ principal · costume portrait ]</div>
          <div className={styles.phDims}>cut-out png · transparent bg</div>
        </div>
      </div>

      {/* Title */}
      <div className={styles.titleBlock} ref={titleBlockRef}>
        <div className={styles.titleMeta}>Ottawa · Yue Opera · Est. 2018</div>
        <div className={styles.titleChars}>
          水<br />袖<br /><span className={styles.red}>越</span><br />韵
        </div>
      </div>

      {/* Poem */}
      <div className={styles.titlePoem} ref={titlePoemRef}>
        一 唱 千 年 ， 一 袖 江 南<br />
        <span className={styles.poemSmall}>Where the sleeve unfolds, a thousand years drift forward.</span>
        <span className={styles.stamp}>孟</span>
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

      {/* Scroll hint */}
      <div className={styles.scrollHint} ref={scrollHintRef}>
        <div>Scroll · 入云</div>
        <div className={styles.scrollLine} />
      </div>

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
