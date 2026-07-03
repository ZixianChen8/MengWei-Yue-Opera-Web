import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Appreciation from '@/components/Appreciation/Appreciation'

export const metadata: Metadata = {
  title: '导赏 · Guided Appreciation — 孟伟越剧',
  description:
    '孟伟越剧十周年专场导赏 — 每一折的剧情梗概与观赏看点。',
}

export default function AppreciationPage() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" brand="anniversary" />
        <Appreciation />
      </div>
      <Footer />
    </>
  )
}
