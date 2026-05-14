import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <div>
          <div className={styles.brandMark}>
            孟<span className={styles.accent}>伟</span>越剧
            <span className={styles.brandSeal}>越</span>
          </div>
          <div className={styles.brandSub}>Meng Wei Yue Opera Studio · Ottawa</div>
        </div>
      </div>

      <div className={styles.menu}>
        <div className={styles.menuItem}>关于本所<span className={styles.en}>About</span></div>
        <div className={styles.menuItem}>演出剧目<span className={styles.en}>Performances</span></div>
        <div className={styles.menuItem}>传习课堂<span className={styles.en}>Studio</span></div>
        <div className={styles.menuItem}>名家行迹<span className={styles.en}>Director</span></div>
        <div className={styles.menuItem}>近期消息<span className={styles.en}>Journal</span></div>
        <button className={styles.contactBtn}>
          <span>联络</span>
          <span className={styles.en}>CONTACT</span>
        </button>
      </div>
    </nav>
  )
}
