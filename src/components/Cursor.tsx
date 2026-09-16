import { useEffect, useRef } from 'react'

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      document.body.classList.add('is-touch')
      return
    }
    const el = ref.current
    if (!el) return
    let x = 0
    let y = 0
    let cx = 0
    let cy = 0
    let raf = 0

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      el.classList.remove('is-hidden')
    }
    const onLeave = () => el.classList.add('is-hidden')
    const onOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('a, button, .btn, .service, .plan, .case')) {
        el.classList.add('is-hover')
      }
    }
    const onOut = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('a, button, .btn, .service, .plan, .case')) {
        el.classList.remove('is-hover')
      }
    }
    const loop = () => {
      cx += (x - cx) * 0.2
      cy += (y - cy) * 0.2
      el.style.transform = `translate3d(${cx - el.offsetWidth / 2}px, ${cy - el.offsetHeight / 2}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    window.addEventListener('pointerout', onOut)
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <div className="cursor is-hidden" ref={ref} aria-hidden="true" />
}
