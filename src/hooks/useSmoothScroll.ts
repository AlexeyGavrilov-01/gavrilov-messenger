import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Options = {
  onScroll: (progress: number, velocity: number) => void
}

export function useSmoothScroll({ onScroll }: Options) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const onNative = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? window.scrollY / max : 0
        onScroll(progress, 0)
      }
      window.addEventListener('scroll', onNative, { passive: true })
      onNative()
      return () => window.removeEventListener('scroll', onNative)
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', (e) => {
      const progress = e.progress
      const velocity = Math.abs(e.velocity)
      onScroll(progress, Math.min(velocity / 30, 1))
      ScrollTrigger.update()
    })

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [onScroll])

  return lenisRef
}

export function useReveal() {
  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.reveal')
    const triggers = els.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => el.classList.add('is-in'),
        onEnterBack: () => el.classList.add('is-in'),
      }),
    )

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [])
}
