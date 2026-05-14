import Eyebrow from '@/components/Eyebrow/Eyebrow'
import styles from './Overture.module.css'

export default function Overture() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div>
          <Eyebrow label="Overture · 序" />
          <h2 className={styles.title}>
            一城之内<br />唯此一家
            <small>The only of its kind, in this city</small>
          </h2>
          <blockquote className={styles.quote}>
            "越剧不是表演，而是一种缓慢的注视——一袖、一步、一眼，皆是岁月所托。"
            <span className={styles.attr}>— 孟伟 · Director, Wei Meng</span>
          </blockquote>
        </div>

        <div className={styles.body}>
          <p>越剧生于一九〇六年的浙东，水乡的灯火、绍兴的烟雨，是它最初的舞台。百年之后，它沿着海路与时光，落在渥太华——这里没有运河，却有同样安静的河流，与一群愿意继续唱下去的人。</p>
          <p>The art reached Canada slowly, the way water finds a new river — one voice, then another, then a small company. Today the studio stages full-length works each season and trains a quiet number of students who carry the form forward, here, in this city.</p>

          <div className={styles.meta}>
            <div><div className={styles.k}>2018</div><div className={styles.v}>Founded · 落地</div></div>
            <div><div className={styles.k}>十二</div><div className={styles.v}>Productions · 上演</div></div>
            <div><div className={styles.k}>唯一</div><div className={styles.v}>In Ottawa · 一席</div></div>
          </div>
        </div>
      </div>
    </section>
  )
}
