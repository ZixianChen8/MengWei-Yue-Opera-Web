import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import SpecialNav from '@/components/SpecialNav/SpecialNav'
import { specialHubHref, specialPageHref } from '@/content/special'
import { loadSpecialEvent } from '@/lib/special-events'

// Shared layout for one special event. Rendering the bottom pill here (rather
// than per-page) keeps it mounted as the *same* element across navigations
// between sibling pages, so its active indicator can slide between tabs instead
// of snapping. The pill hides itself on the hub (returns null there).
export default async function SpecialEventLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await loadSpecialEvent(slug)
  if (!event || !event.published) notFound()

  const hubHref = specialHubHref(slug)
  const items = [
    { zh: event.hub.hubTab.zh, en: event.hub.hubTab.en, href: hubHref },
    ...event.pages
      .filter((page) => page.ready)
      .map((page) => ({
        zh: page.zh,
        en: page.tabEn || page.en,
        href: specialPageHref(slug, page.id),
      })),
  ]

  return (
    <>
      {children}
      <SpecialNav items={items} hubHref={hubHref} />
    </>
  )
}
