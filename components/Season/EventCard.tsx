'use client'

import {
  useRef,
  useState,
  useCallback,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatEventDateZh } from '@/lib/event-date'
import styles from './Season.module.css'

type SeasonEvent = {
  id: string
  tag: string
  titleZh: string[]
  titleEn: string
  blurb: string
  date: string
  venue: string
}

type Props = { ev: SeasonEvent }

const NAV_DELAY = 900
const RESET_DELAY = 1000
const RELEASE_DURATION = 180

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export default function EventCard({ ev }: Props) {
  const router = useRouter()
  const ref = useRef<HTMLAnchorElement>(null)
  const [active, setActive] = useState(false)
  const [pressing, setPressing] = useState(false)
  const [releasing, setReleasing] = useState(false)
  const [pt, setPt] = useState({ x: 0, y: 0 })

  const href = `/events/${ev.id}`

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (e.button !== 0) return
    setPressing(true)
  }, [])

  const clearPressing = useCallback(() => setPressing(false), [])

  const onClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()

      if (prefersReducedMotion()) {
        router.push(href)
        return
      }

      const r = ref.current?.getBoundingClientRect()
      const x = r ? (e.clientX || r.left + r.width / 2) - r.left : 0
      const y = r ? (e.clientY || r.top + r.height / 2) - r.top : 0
      setPt({ x, y })

      setPressing(false)
      setReleasing(true)
      window.setTimeout(() => setReleasing(false), RELEASE_DURATION)

      setActive(true)
      window.setTimeout(() => setActive(false), RESET_DELAY)

      window.setTimeout(() => router.push(href), NAV_DELAY)
    },
    [router, href],
  )

  const cls = [
    styles.event,
    styles.fxPress,
    active ? styles.isActive : '',
    pressing ? styles.pressing : '',
    releasing ? styles.releasing : '',
  ]
    .filter(Boolean)
    .join(' ')

  const styleVars: CSSProperties = {
    ['--press-x' as string]: `${pt.x}px`,
    ['--press-y' as string]: `${pt.y}px`,
  }

  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={clearPressing}
      onPointerLeave={clearPressing}
      onPointerCancel={clearPressing}
      className={cls}
      style={styleVars}
      aria-label={`${ev.titleZh.join('')} ${ev.titleEn}`}
    >
      <span className={styles.pressInk} aria-hidden="true" />
      <span className={styles.pressEdge} aria-hidden="true" />

      <div className={styles.eRow}>
        <span className={styles.eTag}>{ev.tag}</span>
      </div>
      <h3 className={styles.eCn}>
        {ev.titleZh.map((line, i) => (
          <span key={i}>
            {line}
            {i < ev.titleZh.length - 1 && <br />}
          </span>
        ))}
      </h3>
      <div className={styles.eEn}>{ev.titleEn}</div>
      <p className={styles.eBlurb}>{ev.blurb}</p>
      <div className={styles.eWhen}>
        <span>{formatEventDateZh(ev.date)}</span>
        <span className={styles.dot} />
        <span>{ev.venue}</span>
      </div>
    </Link>
  )
}
