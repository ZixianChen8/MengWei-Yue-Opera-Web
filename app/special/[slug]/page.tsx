import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import SpecialHub from '@/components/SpecialHub/SpecialHub'
import { loadPublishedSpecialEvents, loadSpecialEvent } from '@/lib/special-events'

// Every published special event is prerendered, so the JSON files are read at
// build time only. Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false

export async function generateStaticParams() {
  const events = await loadPublishedSpecialEvents()
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await loadSpecialEvent(slug)
  if (!event) return {}
  return {
    title: event.seo.title || `${event.titleZh} · ${event.titleEn} — 孟伟越剧`,
    description: event.seo.description,
  }
}

export default async function SpecialEventHubPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await loadSpecialEvent(slug)
  if (!event || !event.published) notFound()

  return (
    <div style={{ position: 'relative' }}>
      <Nav variant="horizontal" />
      <SpecialHub event={event} />
    </div>
  )
}
