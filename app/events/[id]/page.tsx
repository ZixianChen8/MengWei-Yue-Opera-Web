import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import EventBanner from '@/components/EventPage/EventBanner'
import EventBody from '@/components/EventPage/EventBody'
import { season } from '@/content/home'

export function generateStaticParams() {
  return season.events.map((event) => ({ id: event.id }))
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params
  const event = season.events.find((e) => e.id === id)
  if (!event) return {}
  return {
    title: `${event.titleZh.join('')} · 孟伟越剧`,
    description: event.blurb,
  }
}

export default async function EventPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const event = season.events.find((e) => e.id === id)
  if (!event) notFound()

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" />
        <EventBanner event={event} />
      </div>
      <main>
        <EventBody event={event} />
      </main>
      <Footer />
    </>
  )
}
