import styles from './Eyebrow.module.css'

interface EyebrowProps {
  label: string
}

export default function Eyebrow({ label }: EyebrowProps) {
  return (
    <div className={styles.eyebrow}>
      <span className={styles.dash} />
      <span>{label}</span>
    </div>
  )
}
