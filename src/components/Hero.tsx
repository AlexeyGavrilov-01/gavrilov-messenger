import { useEffect, useRef } from 'react'
import { scrambleText } from '../lib/scramble'

export function Hero() {
  const brandRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = brandRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    return scrambleText(el, 'alexey.dev', { duration: 1200 })
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <p className="eyebrow reveal">product engineer · moscow / remote</p>
        <h1 className="hero__brand reveal reveal-d1" ref={brandRef}>
          alexey<span className="dot">.</span>
          <span className="dev">dev</span>
        </h1>
        <div className="hero__row">
          <p className="hero__copy reveal reveal-d2">
            Собираю цифровые продукты с кинематографичной подачей: интерфейсы,
            системы и сайты, которые ощущаются цельным миром — не набором блоков.
          </p>
          <div className="hero__actions reveal reveal-d3">
            <a className="btn btn--primary" href="#contact">
              Обсудить проект
            </a>
            <a className="btn btn--ghost" href="#work">
              Смотреть работы
            </a>
          </div>
        </div>
      </div>
      <p className="hero__meta">scroll-driven craft · since 2016</p>
      <div className="scroll-hint" aria-hidden="true">
        <span>scroll</span>
        <span className="scroll-hint__line" />
      </div>
    </section>
  )
}
