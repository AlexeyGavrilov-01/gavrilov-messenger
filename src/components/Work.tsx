const cases = [
  {
    year: '2025',
    name: 'Northline Commerce',
    text: 'E-commerce с кинематографичным каталогом и мгновенным чекаутом.',
    tags: ['Next.js', 'WebGL', 'Checkout'],
  },
  {
    year: '2024',
    name: 'Pulse Analytics',
    text: 'Финтех-дашборд с живыми графиками и ощущением нативного инструмента.',
    tags: ['React', 'D3', 'Design system'],
  },
  {
    year: '2024',
    name: 'Atelier Brand Hub',
    text: 'Витрина студии: камера ведёт через кейсы, текст раскрывается по пути.',
    tags: ['Three.js', 'GSAP', 'Lenis'],
  },
]

export function Work() {
  return (
    <section className="work-stage" id="work">
      <div className="work-stage__head">
        <p className="kicker reveal">портфолио</p>
        <h2 className="h-display work-stage__title reveal d1">
          Избранные <span className="h-serif">кадры</span>
        </h2>
      </div>
      <div className="work-pin">
        <div className="work-track">
          {cases.map((c) => (
            <article className="case" key={c.name}>
              <div className="case__media" aria-hidden="true">
                <div className="case__shape" />
              </div>
              <div className="case__body">
                <div className="case__year">{c.year}</div>
                <h3 className="case__name">{c.name}</h3>
                <p className="case__text">{c.text}</p>
                <div className="case__tags">
                  {c.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
