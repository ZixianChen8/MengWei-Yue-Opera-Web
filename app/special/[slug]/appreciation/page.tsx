import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Appreciation from '@/components/Appreciation/Appreciation'
import { getSpecial, isTabEnabled, specialTabStaticParams } from '@/content/specials'

export function generateStaticParams() {
  return specialTabStaticParams('appreciation')
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special || !isTabEnabled(special, 'appreciation')) return {}
  const { titleZh, titleEn, crumb } = special.appreciationPage.pageHead
  return {
    title: `${titleZh} · ${titleEn} — 孟伟越剧`,
    description: crumb || `${special.navZh} ${titleZh}`,
  }
}

export default async function SpecialAppreciationPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params
  const special = getSpecial(slug)
  if (!special || !isTabEnabled(special, 'appreciation')) notFound()

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" brand="special" />
        <Appreciation appreciationPage={special.appreciationPage} />
      </div>
      <Footer />
    </>
  )
}
