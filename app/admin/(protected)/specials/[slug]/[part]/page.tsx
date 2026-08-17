import { notFound } from 'next/navigation'
import SpecialPartEditor from '@/components/admin/SpecialPartEditor'
import { isSpecialPart } from '@/lib/specials-store'

export const dynamic = 'force-dynamic'

export default async function AdminSpecialPartPage(props: {
  params: Promise<{ slug: string; part: string }>
}) {
  const { slug, part } = await props.params
  if (!isSpecialPart(part)) notFound()
  return <SpecialPartEditor slug={slug} part={part} />
}
