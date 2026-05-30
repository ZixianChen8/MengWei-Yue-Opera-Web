import Image from 'next/image'
import styles from './EventPage.module.css'
import type { season } from '@/content/home'

type Event = (typeof season.events)[number]

interface EventBannerProps {
  event: Event
}

export default function EventBanner({ event }: EventBannerProps) {
  return (
    <section className={styles.banner}>
      <Image
        src={event.imageUrl}
        alt={event.titleZh.join('')}
        fill
        className={styles.bannerImg}
        sizes="100vw"
        priority
      />
      <div className={styles.bannerOverlay} />
      <div className={styles.bannerText}>
        <h1 className={styles.bannerTitle}>
          {event.titleZh.join('')}
        </h1>
        <span className={styles.bannerEn}>{event.titleEn}</span>
      </div>
    </section>
  )
}
