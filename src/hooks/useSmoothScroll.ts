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
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: false,
    })
    lenisRef.current = lenis
    ;(window as Window & { __lenis?: Lenis }).__lenis = lenis

    lenis.on('scroll', (e) => {
      const progress = e.progress
      const velocity = Math.abs(e.velocity)
      onScroll(progress, Math.min(velocity / 30, 1))
      ScrollTrigger.update()
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

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

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return
      const el = document.querySelector(hash)
      if (!el) return
      event.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -24, duration: 1.45 })
      history.replaceState(null, '', hash)
    }

    document.addEventListener('click', onAnchorClick)

    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onAnchorClick)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      delete (window as Window & { __lenis?: Lenis }).__lenis
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

    // Mark above-fold hero reveals immediately
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .reveal').forEach((el) => {
        el.classList.add('is-in')
      })
    })

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [])
}
