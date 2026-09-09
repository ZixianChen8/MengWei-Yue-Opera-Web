import { specialEventForPath } from '@/content/special'

export type NavBrandConfig = {
  src: string
  width: number
  height: number
  href: string
  ariaLabel: string
  /** Wide banner logos (special events) get the roomier nav layout. */
  wide: boolean
}

export const DEFAULT_BRAND: NavBrandConfig = {
  src: '/assets/Logo-1.PNG',
  width: 262,
  height: 267,
  href: '/',
  ariaLabel: 'Meng Wei Yue Opera Studio home',
  wide: false,
}

// Special events may carry their own banner logo. It is stored in the event
// index (content/data/special/index.json), so shared client chrome — Nav and
// BubbleMenu — can swap the mark on /special/<slug> without a code change.
export function brandForPath(pathname: string | null | undefined): NavBrandConfig {
  const event = specialEventForPath(pathname)
  if (!event?.logoUrl) return DEFAULT_BRAND
  return {
    src: event.logoUrl,
    width: event.logoWidth || 359,
    height: event.logoHeight || 139,
    href: `/special/${event.slug}`,
    ariaLabel: event.logoAlt || event.titleEn || event.titleZh,
    wide: true,
  }
}
