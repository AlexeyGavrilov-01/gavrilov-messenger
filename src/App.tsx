import { useCallback, useRef } from 'react'
import { CanvasScene } from './webgl/CanvasScene'
import { useReveal, useSmoothScroll } from './hooks/useSmoothScroll'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Services } from './components/Services'
import { Pricing } from './components/Pricing'
import { Portfolio } from './components/Portfolio'
import { Process } from './components/Process'
import { Contact, Footer } from './components/Contact'

export default function App() {
  const progressRef = useRef(0)
  const velocityRef = useRef(0)
  const barRef = useRef<HTMLDivElement>(null)

  const onScroll = useCallback((progress: number, velocity: number) => {
    progressRef.current = progress
    velocityRef.current = velocity
    if (barRef.current) {
      barRef.current.style.width = `${progress * 100}%`
    }
  }, [])

  useSmoothScroll({ onScroll })
  useReveal()

  return (
    <>
      <CanvasScene progressRef={progressRef} velocityRef={velocityRef} />
      <div className="noise" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="progress" ref={barRef} aria-hidden="true" />
      <Cursor />
      <Nav />
      <main className="site">
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Portfolio />
        <Process />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
