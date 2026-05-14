import Eyebrow from '@/components/Eyebrow/Eyebrow'
import styles from './Studio.module.css'

export default function Studio() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.portrait}>
          <span>[ studio · class in session ]</span>
          <div className={styles.label}>传习</div>
        </div>

        <div>
          <Eyebrow label="Studio · 传习" />
          <h2 className={styles.title}>
            学，方知其慢<small>To learn it slowly is to learn it well</small>
          </h2>
          <div className={styles.body}>
            <p>本所亦是学堂。每一季招收少数学员，由孟伟亲授唱腔、身段、念白。不求快，不求多——只求每一个声音都站得住。</p>
            <p>Classes are small. The work is slow. What you learn here is not a song but a way of standing, breathing, and being looked at. We accept twelve students each year.</p>
          </div>

          <div className={styles.program}>
            <div className={styles.row}>
              <div className={styles.lvl}>初阶 · 入门</div>
              <div className={styles.en}>Foundations · sleeve, step, breath</div>
              <div className={styles.when}>10 weeks</div>
            </div>
            <div className={styles.row}>
              <div className={styles.lvl}>中阶 · 唱念</div>
              <div className={styles.en}>Voice &amp; Recitation</div>
              <div className={styles.when}>16 weeks</div>
            </div>
            <div className={styles.row}>
              <div className={styles.lvl}>高阶 · 折子</div>
              <div className={styles.en}>Repertoire &amp; Stagework</div>
              <div className={styles.when}>by audition</div>
            </div>
          </div>

          <button className={styles.cta}>
            敲门入室
            <span className={styles.ctaEn}>Request a visit</span>
          </button>
        </div>
      </div>
    </section>
  )
}
