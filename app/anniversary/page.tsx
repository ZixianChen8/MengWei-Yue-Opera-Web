import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'
import Anniversary from '@/components/Anniversary/Anniversary'

export const metadata: Metadata = {
  title: '十周年专场 · 10th Anniversary — 孟伟越剧',
  description: 'Yuespiration：孟伟越剧十周年专场。中文节目单、导赏与场刊。',
}

export default function AnniversaryPage() {
  return (
    <>
      <SmoothScroll />
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" />
        <Anniversary />
      </div>
    </>
  )
}
