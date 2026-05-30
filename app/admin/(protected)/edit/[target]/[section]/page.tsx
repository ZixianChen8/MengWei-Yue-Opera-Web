import { notFound } from 'next/navigation'
import SectionEditor from '@/components/admin/SectionEditor'
import { findSection } from '@/lib/content-config'

export const dynamic = 'force-dynamic'

export default async function EditSectionPage(props: {
  params: Promise<{ target: string; section: string }>
}) {
  const { target, section } = await props.params
  const def = findSection(target, section)
  if (!def) notFound()

  return <SectionEditor target={def.target} section={def.section} label={def.label} />
}
