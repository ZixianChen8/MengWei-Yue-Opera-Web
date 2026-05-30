import Link from 'next/link'
import { eventPage } from '@/content/home'
import styles from './EventPage.module.css'
import type { season } from '@/content/home'

type Event = (typeof season.events)[number]

interface EventBodyProps {
  event: Event
}

export default function EventBody({ event }: EventBodyProps) {
  const { labels } = eventPage

  const infoRows = [
    { term: labels.date,     value: event.date },
    { term: labels.time,     value: event.time },
    { term: labels.duration, value: event.duration },
    { term: labels.venue,    value: event.venue },
    { term: labels.address,  value: event.venueAddress },
  ]

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Link href="/#season" className={styles.backLink}>
          ← {eventPage.backLink.zh} · {eventPage.backLink.en}
        </Link>

        <p className={styles.description}>{event.description}</p>

        <dl className={styles.infoGrid}>
          {infoRows.map(({ term, value }) => (
            <div key={term.en} className={styles.infoRow}>
              <dt className={styles.infoTerm}>
                {term.zh}
                <span className={styles.infoTermEn}>{term.en}</span>
              </dt>
              <dd className={styles.infoDesc}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.signupCard}>
          <a
            href={event.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.qrLink}
            aria-label={eventPage.qrLabel.zh}
          >
            <div className={styles.qrPlaceholder}>
              <span className={styles.qrCornerTR} />
              <span className={styles.qrCornerBL} />
              <div className={styles.qrInner} />
            </div>
          </a>

          <p className={styles.qrLabel}>{eventPage.qrLabel.zh}</p>

          <div className={styles.qrDivider} />

          <a
            href={event.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.formLink}
          >
            {eventPage.formLink.zh} · {eventPage.formLink.en} →
          </a>
        </div>
      </div>
    </div>
  )
}
