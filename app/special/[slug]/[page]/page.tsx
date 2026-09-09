import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Appreciation from '@/components/Appreciation/Appreciation'
import Booklet from '@/components/Booklet/Booklet'
import Programme from '@/components/Programme/Programme'
import type {
  AppreciationPage,
  Booklet as BookletContent,
  ProgrammePage,
  SpecialPage,
} from '@/content/special'
import { loadPublishedSpecialEvents, loadSpecialEvent } from '@/lib/special-events'

export const dynamicParams = false

export async function generateStaticParams() {
  const events = await loadPublishedSpecialEvents()
  return events.flatMap((event) =>
    event.pages
      .filter((page) => page.ready)
      .map((page) => ({ slug: event.slug, page: page.id })),
  )
}

async function findPage(slug: string, pageId: string) {
  const event = await loadSpecialEvent(slug)
  if (!event || !event.published) return null
  const page = event.pages.find((p) => p.id === pageId && p.ready)
  if (!page) return null
  return { event, page }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}): Promise<Metadata> {
  const { slug, page: pageId } = await params
  const found = await findPage(slug, pageId)
  if (!found) return {}
  const { event, page } = found
  return {
    title: `${page.zh} · ${page.en} — 孟伟越剧`,
    description: `${event.titleZh} ${page.zh}。`,
  }
}

// One template per page type. Adding a *page* is a content operation in
// /admin/special; adding a new *type* means a template plus a case here.
function PageBody({ page }: { page: SpecialPage }) {
  switch (page.type) {
    case 'booklet':
      return <Booklet content={page.content as BookletContent} />
    case 'programme':
      return <Programme content={page.content as ProgrammePage} />
    case 'appreciation':
      return <Appreciation content={page.content as AppreciationPage} />
    default:
      return null
  }
}

export default async function SpecialEventSubPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>
}) {
  const { slug, page: pageId } = await params
  const found = await findPage(slug, pageId)
  if (!found) notFound()

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" />
        <PageBody page={found.page} />
      </div>
      <Footer />
    </>
  )
}
