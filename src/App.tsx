import { useCallback, useRef, useState } from 'react'
import { CanvasScene } from './webgl/CanvasScene'
import {
  useHorizontalWork,
  useReveal,
  useSectionProgress,
  useSmoothScroll,
} from './hooks/useScroll'
import { Cursor } from './components/Cursor'
import { Nav, ProgressRail } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Services } from './components/Services'
import { Pricing } from './components/Pricing'
import { Work } from './components/Work'
import { Process, Contact, Footer } from './components/Process'

export default function App() {
  const progressRef = useRef(0)
  const velocityRef = useRef(0)
  const [active, setActive] = useState(0)

  const onScroll = useCallback((progress: number, velocity: number) => {
    progressRef.current = progress
    velocityRef.current = velocity
  }, [])

  useSmoothScroll({ onScroll })
  useReveal()
  useHorizontalWork()
  useSectionProgress(setActive)

  return (
    <>
      <CanvasScene progressRef={progressRef} velocityRef={velocityRef} />
      <div className="grain" aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
      <Cursor />
      <Nav />
      <ProgressRail active={active} />
      <main className="site">
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Work />
        <Process />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
