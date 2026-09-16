const skills = [
  'React',
  'Three.js',
  'GSAP',
  'TypeScript',
  'Node',
  'WebGL',
  'Design Systems',
  'Motion',
  'React',
  'Three.js',
  'GSAP',
  'TypeScript',
  'Node',
  'WebGL',
  'Design Systems',
  'Motion',
]

export function About() {
  return (
    <section className="chapter" id="about">
      <div className="chapter__inner about-grid">
        <div>
          <p className="kicker reveal">подход</p>
          <h2 className="h-display about__title reveal d1">
            Код как <span className="h-serif">кинематограф</span>
          </h2>
        </div>
        <div>
          <p className="lede reveal d2">
            Я веду продукт от идеи до релиза: сценарий скролла, интерфейс,
            бэкенд и метрики. Цель — ощущение цельного мира, а не набор блоков.
          </p>
          <div className="about__stats">
            <div className="reveal d2">
              <div className="stat__n">9+</div>
              <div className="stat__l">лет в продукте</div>
            </div>
            <div className="reveal d3">
              <div className="stat__n">60+</div>
              <div className="stat__l">запусков</div>
            </div>
            <div className="reveal d4">
              <div className="stat__n">4.9</div>
              <div className="stat__l">средняя оценка</div>
            </div>
          </div>
        </div>
      </div>
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {skills.map((s, i) => (
            <span key={`${s}-${i}`}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
