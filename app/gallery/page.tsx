import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Gallery from '@/components/Gallery/Gallery'

export const metadata: Metadata = {
  title: '剧照 · Gallery — 孟伟越剧',
  description: '加拿大孟伟越剧艺术传习所历年演出剧照、折子、传习与后台影像志。',
}

export default function GalleryPage() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav variant="horizontal" />
        <Gallery />
      </div>
      <Footer />
    </>
  )
}
