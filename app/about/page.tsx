import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'
import AboutPage from '@/components/AboutPage/AboutPage'

export const metadata: Metadata = {
  title: '关于本所 · About — 孟伟越剧',
  description: '加拿大孟伟越剧艺术传习所简介。成立于二〇一六年，注册于加拿大，总部位于渥太华。',
}

export default function About() {
  return (
    <>
      <SmoothScroll />
      <div style={{ position: 'relative' }}>
        <Nav />
        <AboutPage />
      </div>
      <Footer />
    </>
  )
}
