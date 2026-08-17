import Link from 'next/link'
import QRCode from 'qrcode'
import { eventPage } from '@/content/home'
import { formatEventDateZh } from '@/lib/event-date'
import { isRetired } from '@/lib/event-lifecycle'
import { photosForEvent } from '@/lib/gallery-albums'
import Reveal from '@/components/Reveal/Reveal'
import styles from './EventPage.module.css'
import type { season } from '@/content/home'

type Event = (typeof season.events)[number]

interface EventBodyProps {
  event: Event
}

export default async function EventBody({ event }: EventBodyProps) {
  const { labels, album: albumCopy } = eventPage
  const retired = isRetired(event)
  const albumPhotos = photosForEvent(event.id)
  const albumCover = albumPhotos[0]?.image || event.cardImageUrl || event.imageUrl || ''

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

        {albumPhotos.length > 0 ? (
          <Reveal delay={0.12}>
            <Link
              href={`/gallery?event=${encodeURIComponent(event.id)}`}
              className={styles.albumRow}
            >
              <span className={styles.albumCover}>
                {albumCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={albumCover} alt="" className={styles.albumCoverImg} />
                ) : null}
              </span>
              <span className={styles.albumCopy}>
                <span className={styles.albumLabel}>
                  {albumCopy.label.zh}
                  <span className={styles.albumLabelEn}>{albumCopy.label.en}</span>
                </span>
                <span className={styles.albumTitle}>
                  {event.titleZh.join('')}
                  <span className={styles.albumCount}>
                    {albumPhotos.length} {albumCopy.frames}
                  </span>
                </span>
              </span>
              <span className={styles.albumView}>
                {albumCopy.view.zh} · {albumCopy.view.en} →
              </span>
            </Link>
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
