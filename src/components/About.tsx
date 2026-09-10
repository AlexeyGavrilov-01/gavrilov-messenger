export function About() {
  return (
    <section className="section" id="about">
      <div className="section__inner split-grid">
        <div>
          <p className="eyebrow reveal">подход</p>
          <h2 className="display about__title reveal reveal-d1">
            Код как <span className="serif">архитектура сигнала</span>
          </h2>
        </div>
        <div>
          <p className="lede reveal reveal-d2">
            Я проектирую опыт целиком: от скролл-нарратива и микроанимаций до
            устойчивого фронтенда и бэкенда. Цель — сайт, который ведёт взгляд и
            оставляет ощущение премиальной точности.
          </p>
          <div className="about__stats">
            <div className="reveal reveal-d2">
              <div className="stat__value">9+</div>
              <div className="stat__label">лет в продукте</div>
            </div>
            <div className="reveal reveal-d3">
              <div className="stat__value">60+</div>
              <div className="stat__label">запусков</div>
            </div>
            <div className="reveal reveal-d4">
              <div className="stat__value">4.9</div>
              <div className="stat__label">средняя оценка</div>
            </div>
          </div>
        </div>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[
            'React',
            'Three.js',
            'GSAP',
            'Node',
            'TypeScript',
            'WebGL',
            'Design Systems',
            'Motion',
            'React',
            'Three.js',
            'GSAP',
            'Node',
            'TypeScript',
            'WebGL',
            'Design Systems',
            'Motion',
          ].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
