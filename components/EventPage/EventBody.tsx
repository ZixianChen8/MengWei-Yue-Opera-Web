import Link from 'next/link'
import QRCode from 'qrcode'
import { eventPage } from '@/content/home'
import styles from './EventPage.module.css'
import type { season } from '@/content/home'

type Event = (typeof season.events)[number]

interface EventBodyProps {
  event: Event
}

export default async function EventBody({ event }: EventBodyProps) {
  const { labels } = eventPage

  // Encode the sign-up link as a real QR. Seed data uses "#" placeholders,
  // which aren't real destinations — fall back to the CSS placeholder then.
  const hasFormUrl = /^https?:\/\//i.test(event.formUrl)
  const qrSvg = hasFormUrl
    ? await QRCode.toString(event.formUrl, {
        type: 'svg',
        margin: 1,
        color: { dark: '#2C251E', light: '#00000000' },
      })
    : null

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
            {qrSvg ? (
              // Trusted, self-generated SVG (built from event.formUrl above).
              <span className={styles.qrCode} dangerouslySetInnerHTML={{ __html: qrSvg }} />
            ) : (
              <div className={styles.qrPlaceholder}>
                <span className={styles.qrCornerTR} />
                <span className={styles.qrCornerBL} />
                <div className={styles.qrInner} />
              </div>
            )}
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
