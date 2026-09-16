const items = [
  {
    name: 'Продуктовый фронтенд',
    desc: 'SPA/SSR, дизайн-системы и сложные интерфейсы с фокусом на скорость и ощущение качества.',
    tag: 'React · Next',
  },
  {
    name: 'Scroll & motion worlds',
    desc: 'Скролл-нарративы, WebGL-атмосфера и переходы, которые ведут взгляд без потери FPS.',
    tag: 'Three · GSAP',
  },
  {
    name: 'Лендинги и визитки',
    desc: 'Сильный первый экран, ясный оффер и анимации, которые усиливают бренд.',
    tag: 'Brand sites',
  },
  {
    name: 'Full-stack под ключ',
    desc: 'API, авторизация, админки и интеграции — от прототипа до продакшена.',
    tag: 'Node · Cloud',
  },
]

export function Services() {
  return (
    <section className="chapter" id="services">
      <div className="chapter__inner">
        <div className="services__head">
          <div>
            <p className="kicker reveal">услуги</p>
            <h2 className="h-display services__title reveal d1">
              Что я <span className="h-serif">собираю</span>
            </h2>
          </div>
          <p className="lede reveal d2" style={{ margin: 0 }}>
            Беру цифровой слой продукта целиком — от концепции до релиза.
          </p>
        </div>
        <ul className="service-row">
          {items.map((s, i) => (
            <li className="service reveal" key={s.name} style={{ transitionDelay: `${i * 0.05}s` }}>
              <span className="service__i">0{i + 1}</span>
              <div>
                <h3 className="service__name">{s.name}</h3>
                <p className="service__desc">{s.desc}</p>
              </div>
              <span className="service__tag">{s.tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
