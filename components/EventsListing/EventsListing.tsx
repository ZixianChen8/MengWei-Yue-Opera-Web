import Link from 'next/link'
import { season, eventsListingPage } from '@/content/home'
import styles from './EventsListing.module.css'

type SeasonEvent = (typeof season.events)[number]

function statusClass(type: SeasonEvent['statusType']) {
  if (type === 'open' || type === 'free') return styles.statusOpen
  if (type === 'soon' || type === 'waitlist') return styles.statusSoon
  return ''
}

export default function EventsListing() {
  const { header, years, months, archive, currentYear } = eventsListingPage

  return (
    <>
      {/* ── Page header ─────────────────────────────────── */}
      <section className={styles.pageHead}>
        <div className={styles.phInner}>
          <div className={styles.phTop}>
            <div>
              <h1 className={styles.phTitle}>
                {header.titleZh}
                <small>{header.titleEn}</small>
              </h1>
            </div>
            <div className={styles.phAside}>
              <p className={styles.phQuote}>{header.quote.zh}</p>
              <span className={styles.phQuoteEn}>{header.quote.en}</span>
            </div>
          </div>

          {/* Year + months ribbon */}
          <div className={styles.ribbon}>
            <div className={styles.yearBlock}>
              <div className={styles.yearToggle}>
                {years.map((y) => (
                  <span
                    key={y}
                    className={y === currentYear ? styles.yearBtnOn : styles.yearBtn}
                  >
                    {y}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.months}>
              {months.map((m) => {
                const cls = [
                  styles.month,
                  m.hasEvent ? styles.monthHas : '',
                  m.isCurrent ? styles.monthNow : '',
                ].filter(Boolean).join(' ')
                return (
                  <div key={m.en} className={cls}>
                    {m.hasEvent && (
                      <span className={m.pipMuted ? styles.pipMuted : styles.pip} />
                    )}
                    <div className={styles.mCn}>{m.cn}</div>
                    <div className={styles.mEn}>{m.en}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Events grid ─────────────────────────────────── */}
      <section className={styles.eventsWrap}>
        <div className={styles.events}>
          {season.events.map((ev) => (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              className={styles.ev}
              aria-label={`${ev.titleZh.join('')} ${ev.titleEn}`}
            >
              <div className={styles.evRow}>
                <span className={styles.evTag}>{ev.tag}</span>
              </div>

              <div className={styles.evImg}>
                {ev.cardImageUrl ? (
                  // Plain <img>: admin may paste arbitrary remote URLs that
                  // next/image's remote-domain allowlist would reject.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={styles.evImgPhoto} src={ev.cardImageUrl} alt="" />
                ) : (
                  <>
                    <span className={styles.evImgTag}>photo</span>
                    <span className={styles.evImgLabel}>{ev.titleZh[0]}</span>
                  </>
                )}
              </div>

              <h3 className={styles.evCn}>
                {ev.titleZh.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < ev.titleZh.length - 1 && <br />}
                  </span>
                ))}
              </h3>
              <div className={styles.evEn}>{ev.titleEn}</div>
              <p className={styles.evBlurb}>{ev.blurb}</p>

              <div className={styles.evWhen}>
                <div className={styles.evDate}>
                  <span>{ev.date.replace('2026年', '')}</span>
                  <span className={styles.evTime}>{ev.time}</span>
                </div>
                <div className={styles.evVenue}>
                  {ev.venueEn}
                  <span className={styles.evVenueCn}>{ev.venue.split('，')[0]}</span>
                </div>
              </div>

              <div className={styles.evFoot}>
                <span className={`${styles.evStatus} ${statusClass(ev.statusType)}`}>
                  {ev.statusLabel}
                </span>
                <span className={styles.evArrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Past archive ────────────────────────────────── */}
      <section className={styles.past}>
        <div className={styles.pastInner}>
          <div className={styles.pastHead}>
            <div>
              <h2 className={styles.pastTitle}>
                往迹<small>Past performances since 2018</small>
              </h2>
            </div>
            <div className={styles.pastAside}>
              八年之间，共赴大幕，二十余场——皆有存案。
              <span className={styles.pastAsideEn}>
                Eight years, twelve mainstage productions, twenty-three smaller engagements — all on the record.
              </span>
            </div>
          </div>

          <div className={styles.archive}>
            {archive.map((block) => (
              <div key={block.year} className={styles.archYear}>
                <div className={styles.archYr}>{block.year}</div>
                <div className={styles.archRows}>
                  {block.shows.map((show, i) => (
                    <div key={i} className={styles.archRow}>
                      <div className={styles.archNo}>{show.num}</div>
                      <div className={styles.archCn}>{show.cn}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
