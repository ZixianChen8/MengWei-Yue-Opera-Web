import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Anniversary from '@/components/Anniversary/Anniversary'
import { enabledTabs, getSpecial, specialStaticParams } from '@/content/specials'

export function generateStaticParams() {
  return specialStaticParams()
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special) return {}
  const { titleZh, titleEn, tagline } = special.hub.pageHead
  return {
    title: `${titleZh} · ${titleEn} — 孟伟越剧`,
    description: tagline || `${titleZh} ${titleEn}`,
  }
}

export default async function SpecialHubPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special) notFound()

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" brand="special" />
        <Anniversary pageHead={special.hub.pageHead} menu={enabledTabs(special)} />
      </div>
    </>
  )
}
