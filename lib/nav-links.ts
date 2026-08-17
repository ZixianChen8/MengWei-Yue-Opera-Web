import { nav } from '@/content/home'
import { specials } from '@/content/specials'

export type NavLink = { zh: string; en: string; href: string }

function isManagedSpecialHref(href: string): boolean {
  return href === '/anniversary' || href.startsWith('/special/')
}

export function composeNavLinks(
  coreLinks: NavLink[],
  events: { slug: string; showInNav: boolean; navZh: string; navEn: string }[],
): NavLink[] {
  const stripped = coreLinks.filter((link) => !isManagedSpecialHref(link.href))
  const specialLinks = events
    .filter((event) => event.showInNav)
    .map((event) => ({
      zh: event.navZh,
      en: event.navEn,
      href: `/special/${event.slug}`,
    }))

  const aboutIndex = stripped.findIndex((link) => link.href === '/about')
  if (aboutIndex === -1) return [...stripped, ...specialLinks]
  return [...stripped.slice(0, aboutIndex), ...specialLinks, ...stripped.slice(aboutIndex)]
}

export const siteNavLinks: NavLink[] = composeNavLinks(nav.links, specials)
