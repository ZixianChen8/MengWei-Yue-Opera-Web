'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { season, type SeasonEvent } from '@/content/home'
import { upcomingEvents } from '@/lib/event-lifecycle'
import { MM_DESKTOP, MM_MOBILE, MM_REDUCED, revealBatch } from '@/components/hooks/scrollStory'
import EventCard from './EventCard'
import styles from './Season.module.css'

const MAX_HOME_EVENTS = 3

// Pick the events shown in the home Season section: retired events are
// excluded first; those flagged `home` come next (in list order), then
// the earliest unflagged upcoming events fill the remaining slots.
function selectHomeEvents(events: SeasonEvent[], max = MAX_HOME_EVENTS): SeasonEvent[] {
  const live = upcomingEvents(events)
  const checked = live.filter((e) => e.home).slice(0, max)
  if (checked.length >= max) return checked
  const fill = live.filter((e) => !e.home)
  return [...checked, ...fill].slice(0, max)
}

export default function Season() {
  const scopeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      media.add(MM_REDUCED, () => undefined)

      // Header + event cards fade/rise in a stagger as each batch enters view.
      const addReveals = () => revealBatch(scope, '[data-reveal]', { stagger: 0.1 })

      media.add(MM_DESKTOP, () => { addReveals() })
      media.add(MM_MOBILE, () => { addReveals() })
    }, scope)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section id="season" className={styles.section} ref={scopeRef}>
      <div className={styles.head} data-reveal>
        <div>
          <h2 className={styles.title}>
            {season.title.zh}<small>{season.title.en}</small>
          </h2>
        </div>
        <Link href="/events" className={styles.viewAll}>
          查看全部活动
          <span className={styles.viewAllEn}>· View all events</span>
          <span className={styles.viewAllArrow}>→</span>
        </Link>
      </div>

      <div className={styles.events}>
        {selectHomeEvents(season.events).map((ev) => (
          <div key={ev.id} data-reveal>
            <EventCard ev={ev} />
          </div>
        ))}
      </div>

    </section>
  )
}
