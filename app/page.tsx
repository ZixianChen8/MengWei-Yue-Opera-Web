import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Overture from '@/components/Overture/Overture'
import Season from '@/components/Season/Season'
import CloudBreak from '@/components/CloudBreak/CloudBreak'
import Studio from '@/components/Studio/Studio'
import Repertoire from '@/components/Repertoire/Repertoire'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav />
        <Hero />
      </div>
      <main>
        <Overture />
        <Season />
        <CloudBreak />
        <Studio />
        <Repertoire />
      </main>
      <Footer />
    </>
  )
}
