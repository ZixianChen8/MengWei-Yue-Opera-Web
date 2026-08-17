import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Booklet from '@/components/Booklet/Booklet'
import { getSpecial, isTabEnabled, specialTabStaticParams } from '@/content/specials'

export function generateStaticParams() {
  return specialTabStaticParams('booklet')
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special || !isTabEnabled(special, 'booklet')) return {}
  const { titleZh, titleEn, crumb } = special.booklet.pageHead
  return {
    title: `${titleZh} · ${titleEn} — 孟伟越剧`,
    description: crumb || `${special.navZh} ${titleZh}`,
  }
}

export default async function SpecialBookletPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special || !isTabEnabled(special, 'booklet')) notFound()

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" brand="special" />
        <Booklet booklet={special.booklet} />
      </div>
      <Footer />
    </>
  )
}
