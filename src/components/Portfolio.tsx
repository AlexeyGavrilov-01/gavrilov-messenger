const works = [
  {
    year: '2025',
    name: 'Northline Commerce',
    text: 'E-commerce с кинематографичным каталогом: скролл-переходы между коллекциями и мгновенный чекаут.',
    tags: ['Next.js', 'WebGL', 'Checkout'],
  },
  {
    year: '2024',
    name: 'Pulse Analytics',
    text: 'Дашборд для финтех-команды: живые графики, клавиатурные шорткаты и ощущение «нативного» инструмента.',
    tags: ['React', 'D3', 'Design system'],
  },
  {
    year: '2024',
    name: 'Atelier Brand Hub',
    text: 'Витрина студии с портфолио-туннелем: камера ведёт через кейсы, текст раскрывается по ходу пути.',
    tags: ['Three.js', 'GSAP', 'Lenis'],
  },
]

export function Portfolio() {
  return (
    <section className="section" id="work">
      <div className="section__inner">
        <div className="portfolio__head">
          <p className="eyebrow reveal">портфолио</p>
          <h2 className="display portfolio__title reveal reveal-d1">
            Избранные <span className="serif">сигналы</span>
          </h2>
        </div>
        <div className="work-rail">
          {works.map((w, i) => (
            <article className="work reveal" key={w.name} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="work__visual" aria-hidden="true">
                <div className="work__orb" />
              </div>
              <div className="work__body">
                <div className="work__year">{w.year}</div>
                <h3 className="work__name">{w.name}</h3>
                <p className="work__text">{w.text}</p>
                <div className="work__tags">
                  {w.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
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
