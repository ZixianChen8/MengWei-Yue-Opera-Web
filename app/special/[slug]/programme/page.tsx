import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Programme from '@/components/Programme/Programme'
import { getSpecial, isTabEnabled, specialTabStaticParams } from '@/content/specials'

export function generateStaticParams() {
  return specialTabStaticParams('programme')
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special || !isTabEnabled(special, 'programme')) return {}
  const { titleZh, titleEn, crumb } = special.programmePage.pageHead
  return {
    title: `${titleZh} · ${titleEn} — 孟伟越剧`,
    description: crumb || `${special.navZh} ${titleZh}`,
  }
}

export default async function SpecialProgrammePage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special || !isTabEnabled(special, 'programme')) notFound()

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" brand="special" />
        <Programme programmePage={special.programmePage} />
      </div>
      <Footer />
    </>
  )
}
