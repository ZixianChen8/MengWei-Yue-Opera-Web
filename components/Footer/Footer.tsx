import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.ornament}>声 · 袖 · 心</div>

      <div className={styles.inner}>
        <div>
          <div className={styles.mark}>
            加拿大<br />孟伟越剧艺术传习所
            <small>Meng Wei Yue Opera Studio — Canada</small>
          </div>
          <p className={styles.line}>
            渥太华 · 加拿大联邦注册非营利艺术机构<br />
            A federally incorporated not-for-profit, headquartered in Ottawa, Ontario.
          </p>
        </div>

        <div className={styles.col}>
          <h4>To Visit · 拜访</h4>
          <a href="#">关于本所<span className={styles.en}>About the Studio</span></a>
          <a href="#">演出剧目<span className={styles.en}>Performances</span></a>
          <a href="#">传习课堂<span className={styles.en}>Lessons</span></a>
          <a href="#">近期消息<span className={styles.en}>Journal</span></a>
        </div>

        <div className={styles.col}>
          <h4>To Reach Us · 留书</h4>
          <a href="mailto:hello@mengweiyue.ca">mengweiyue@studio.ca<span className={styles.en}>By letter</span></a>
          <a href="#">+1 (613) — · — · —<span className={styles.en}>By telephone</span></a>
          <a href="#">Wei Meng, Director<span className={styles.en}>By appointment</span></a>
        </div>
      </div>

      <div className={styles.bottom}>
        <div>© 2026 Meng Wei Yue Opera Studio · 加拿大孟伟越剧艺术传习所</div>
        <div className={styles.sealMark}>
          <span>Ottawa · Made with care</span>
          <span className={styles.stamp}>
            <span className={styles.stampGlyph}>越</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
