import { notFound } from 'next/navigation'
import SpecialEventEditor from '@/components/admin/SpecialEventEditor'
import { isValidSlug } from '@/lib/special-paths'

export default async function AdminSpecialEventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isValidSlug(slug)) notFound()
  return <SpecialEventEditor slug={slug} />
}
