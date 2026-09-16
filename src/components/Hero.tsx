import { useEffect, useRef, useState } from 'react'
import { scrambleText } from '../lib/scramble'

export function Hero() {
  const scrambleRef = useRef<HTMLSpanElement>(null)
  const [showScramble, setShowScramble] = useState(true)

  useEffect(() => {
    const el = scrambleRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowScramble(false)
      return
    }
    const stop = scrambleText(el, 'alexey.dev', 1100)
    const timer = window.setTimeout(() => setShowScramble(false), 1200)
    return () => {
      stop()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__inner">
        <p className="kicker reveal">product engineer · moscow / remote</p>
        <h1 className="hero__title reveal d1">
          {showScramble && (
            <span className="hero__scramble" ref={scrambleRef} aria-hidden="true">
              alexey.dev
            </span>
          )}
          <span className="hero__brand">
            alexey<span className="flare">.</span>
            <span className="volt">dev</span>
          </span>
        </h1>
        <div className="hero__bottom">
          <p className="hero__copy reveal d2">
            Пересобираю цифровые продукты как кинематографичные миры: сильный
            первый кадр, точный ритм скролла и инженерия, которая держит нагрузку.
          </p>
          <div className="hero__actions reveal d3">
            <a className="btn btn--volt" href="#contact">
              Обсудить проект
            </a>
            <a className="btn btn--ghost" href="#work">
              Смотреть работы
            </a>
          </div>
        </div>
      </div>
      <p className="hero__rail">scroll narrative · est. 2016</p>
      <div className="scroll-cue" aria-hidden="true">
        <span>scroll</span>
        <span className="scroll-cue__bar" />
      </div>
    </section>
  )
}
