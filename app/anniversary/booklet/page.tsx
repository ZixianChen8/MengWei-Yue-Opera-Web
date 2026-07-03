import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Booklet from '@/components/Booklet/Booklet'

export const metadata: Metadata = {
  title: '场刊 · Program Book — 孟伟越剧',
  description:
    '孟伟越剧十周年专场场刊：序言、贺信、节目单与演职人员。',
}

export default function BookletPage() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" brand="anniversary" />
        <Booklet />
      </div>
      <Footer />
    </>
  )
}
