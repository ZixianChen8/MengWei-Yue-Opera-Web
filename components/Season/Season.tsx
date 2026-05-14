import Eyebrow from '@/components/Eyebrow/Eyebrow'
import styles from './Season.module.css'

export default function Season() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <Eyebrow label="Season · 时序" />
          <h2 className={styles.title}>
            本季<small>The coming season · 二〇二六</small>
          </h2>
        </div>
        <div className={styles.aside}>
          四时之中，戏自有其节令。本季三场，皆由本所主演与客席名家同台。
          <span className={styles.en}>Three performances · Spring through Autumn</span>
        </div>
      </div>

      <div className={styles.events}>
        {/* Feature event */}
        <article className={`${styles.event} ${styles.feature}`}>
          <div className={styles.eRow}>
            <span className={styles.eNum}>N° 01</span>
            <span className={styles.eTag}>Mainstage · 大戏</span>
          </div>
          <div className={styles.eImg}>
            <span>scene · garden meeting</span>
            <span>cover · 16:20</span>
          </div>
          <h3 className={styles.eCn}>梁山伯<br />与祝英台</h3>
          <div className={styles.eEn}>The Butterfly Lovers · Full Length</div>
          <p className={styles.eBlurb}>越剧最负盛名之作，本所建团八载，首度完整上演。由孟伟与青年演员同台，乐队现场伴奏。</p>
          <div className={styles.eWhen}>
            <span>14 March 2026</span>
            <span className={styles.dot} />
            <span>NAC Studio · Ottawa</span>
          </div>
        </article>

        {/* Event 2 */}
        <article className={styles.event}>
          <div className={styles.eRow}>
            <span className={styles.eNum}>N° 02</span>
            <span className={styles.eTag}>Recital · 折子</span>
          </div>
          <div className={styles.eImg}>
            <span>scene · pavilion</span>
            <span>cover · 09:00</span>
          </div>
          <h3 className={styles.eCn}>红楼·葬花</h3>
          <div className={styles.eEn}>Burying the Blossoms</div>
          <p className={styles.eBlurb}>由学员与主演共同呈现的折子戏专场，于丁香花季演出。</p>
          <div className={styles.eWhen}>
            <span>16 May 2026</span>
            <span className={styles.dot} />
            <span>Studio Hall</span>
          </div>
        </article>

        {/* Event 3 */}
        <article className={styles.event}>
          <div className={styles.eRow}>
            <span className={styles.eNum}>N° 03</span>
            <span className={styles.eTag}>In Concert · 雅集</span>
          </div>
          <div className={styles.eImg}>
            <span>scene · candlelight</span>
            <span>cover · 18:30</span>
          </div>
          <h3 className={styles.eCn}>秋夜·清音</h3>
          <div className={styles.eEn}>An Autumn Evening</div>
          <p className={styles.eBlurb}>音乐家与演员合作的一夜独唱与器乐选段，秋分前夕。</p>
          <div className={styles.eWhen}>
            <span>20 September 2026</span>
            <span className={styles.dot} />
            <span>Private Salon</span>
          </div>
        </article>
      </div>
    </section>
  )
}
