import Link from 'next/link'
import QRCode from 'qrcode'
import { eventPage } from '@/content/home'
import { formatEventDateZh } from '@/lib/event-date'
import { isRetired } from '@/lib/event-lifecycle'
import Reveal from '@/components/Reveal/Reveal'
import styles from './EventPage.module.css'
import type { season } from '@/content/home'

type Event = (typeof season.events)[number]

interface EventBodyProps {
  event: Event
}

export default async function EventBody({ event }: EventBodyProps) {
  const { labels } = eventPage
  const retired = isRetired(event)

  // Encode the sign-up link as a real QR. Seed data uses "#" placeholders,
  // which aren't real destinations — fall back to the CSS placeholder then.
  // Retired events never show the signup block.
  const hasFormUrl = !retired && /^https?:\/\//i.test(event.formUrl)
  const qrSvg = hasFormUrl
    ? await QRCode.toString(event.formUrl, {
        type: 'svg',
        margin: 1,
        color: { dark: '#2C251E', light: '#00000000' },
      })
    : null

  const infoRows = [
    { term: labels.date, value: formatEventDateZh(event.date) },
    { term: labels.time, value: event.time },
    { term: labels.duration, value: event.duration },
    { term: labels.venue, value: event.venue },
    { term: labels.address, value: event.venueAddress },
  ].filter((row) => row.value)

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Link href="/events" className={styles.backLink}>
          ← {eventPage.backLink.zh} · {eventPage.backLink.en}
        </Link>

        {event.description ? (
          <Reveal as="p" className={styles.description}>{event.description}</Reveal>
        ) : null}

        {infoRows.length > 0 ? (
          <Reveal as="dl" className={styles.infoGrid} delay={0.08}>
            {infoRows.map(({ term, value }) => (
              <div key={term.en} className={styles.infoRow}>
                <dt className={styles.infoTerm}>
                  {term.zh}
                  <span className={styles.infoTermEn}>{term.en}</span>
                </dt>
                <dd className={styles.infoDesc}>{value}</dd>
              </div>
            ))}
          </Reveal>
        ) : null}

        {!retired ? (
          <Reveal className={styles.signupCard} delay={0.16}>
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
          </Reveal>
        ) : null}
      </div>
    </div>
  )
}
