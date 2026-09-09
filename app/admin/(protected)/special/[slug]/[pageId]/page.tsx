import { notFound } from 'next/navigation'
import SpecialPageEditor from '@/components/admin/SpecialPageEditor'
import { isValidPageId, isValidSlug } from '@/lib/special-paths'

export default async function AdminSpecialPageContentPage({
  params,
}: {
  params: Promise<{ slug: string; pageId: string }>
}) {
  const { slug, pageId } = await params
  if (!isValidSlug(slug) || !isValidPageId(pageId)) notFound()
  return <SpecialPageEditor slug={slug} pageId={pageId} />
}
