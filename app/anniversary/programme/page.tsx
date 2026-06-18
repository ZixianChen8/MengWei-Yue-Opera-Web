import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Programme from '@/components/Programme/Programme'

export const metadata: Metadata = {
  title: '节目单 · Programme — 孟伟越剧',
  description:
    'Yuespiration：孟伟越剧十周年专场中文节目单 — 演出曲目、时长与演职人员。',
}

export default function ProgrammePage() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" />
        <Programme />
      </div>
      <Footer />
    </>
  )
}
