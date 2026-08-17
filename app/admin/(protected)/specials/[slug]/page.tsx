import SpecialSettingsForm from '@/components/admin/SpecialSettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSpecialSettingsPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  return <SpecialSettingsForm slug={slug} />
}
