import Nav from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Overture from '@/components/Overture/Overture'
import About from '@/components/About/About'
import Season from '@/components/Season/Season'
import CloudBreak from '@/components/CloudBreak/CloudBreak'
import Studio from '@/components/Studio/Studio'
import Repertoire from '@/components/Repertoire/Repertoire'
import Footer from '@/components/Footer/Footer'

// Re-evaluate event retirement (day after event date) at least daily.
export const revalidate = 86400

export default function Home() {
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Nav />
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
