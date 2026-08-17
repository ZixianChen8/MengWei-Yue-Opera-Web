import type { ReactNode } from 'react'
import AnniversaryNav from '@/components/AnniversaryNav/AnniversaryNav'
import { getSpecial, pillNavItems, specialHref, specialStaticParams } from '@/content/specials'

export function generateStaticParams() {
  return specialStaticParams()
}

export default async function SpecialLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const special = getSpecial(slug)
  if (!special) return children

  return (
    <>
      {children}
      <AnniversaryNav
        items={pillNavItems(special)}
        hubHref={specialHref(special.slug)}
        ariaLabel={`${special.navZh} · ${special.navEn}`}
      />
    </>
  )
}
