import LandingMenu from '@/components/LandingMenu/LandingMenu'
import Hero from '@/components/Hero/Hero'
import Overture from '@/components/Overture/Overture'
import About from '@/components/About/About'
import Season from '@/components/Season/Season'
import CloudBreak from '@/components/CloudBreak/CloudBreak'
import Studio from '@/components/Studio/Studio'
import Repertoire from '@/components/Repertoire/Repertoire'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <LandingMenu />
        <Hero />
      </div>
      <main>
        <Overture />
        <About />
        <Season />
        <CloudBreak />
        <Studio />
        <Repertoire />
      </main>
      <Footer />
    </>
  )
}
