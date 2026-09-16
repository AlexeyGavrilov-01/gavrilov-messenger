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
        onScroll(max > 0 ? window.scrollY / max : 0, 0)
      }
      window.addEventListener('scroll', onNative, { passive: true })
      onNative()
      return () => window.removeEventListener('scroll', onNative)
    }

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    ;(window as Window & { __lenis?: Lenis }).__lenis = lenis

    lenis.on('scroll', (e) => {
      onScroll(e.progress, Math.min(Math.abs(e.velocity) / 28, 1))
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
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
    })

    const onAnchor = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null
      if (!link) return
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return
      const el = document.querySelector(hash)
      if (!el) return
      event.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -20, duration: 1.5 })
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onAnchor)

    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onAnchor)
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
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('is-in'))
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])
}

export function useHorizontalWork() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 860px)').matches
    if (reduced || mobile) return

    const pin = document.querySelector('.work-pin') as HTMLElement | null
    const track = document.querySelector('.work-track') as HTMLElement | null
    if (!pin || !track) return

    const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth)

    const tween = gsap.to(track, {
      x: () => -getScroll(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${getScroll()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(track, { clearProps: 'transform' })
    }
  }, [])
}

export function useSectionProgress(setActive: (i: number) => void) {
  useEffect(() => {
    const ids = ['top', 'about', 'services', 'pricing', 'work', 'process', 'contact']
    const triggers = ids.map((id, i) =>
      ScrollTrigger.create({
        trigger: id === 'top' ? '.hero' : `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [setActive])
}
