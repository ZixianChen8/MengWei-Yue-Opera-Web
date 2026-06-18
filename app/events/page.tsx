import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import EventsListing from '@/components/EventsListing/EventsListing'

export const metadata: Metadata = {
  title: '演出 · Season — 孟伟越剧',
  description: '加拿大孟伟越剧艺术传习所年度演出计划，涵盖大戏、折子戏、讲座与工坊。',
}

export default function EventsPage() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" />
        <EventsListing />
      </div>
      <Footer />
    </>
  )
}
