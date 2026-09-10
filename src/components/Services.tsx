const services = [
  {
    name: 'Продуктовый фронтенд',
    desc: 'SPA/SSR, дизайн-системы, сложные интерфейсы с фокусом на скорость и ощущение качества.',
    tag: 'React · Next',
  },
  {
    name: 'Scroll & motion experiences',
    desc: 'Скролл-нарративы, WebGL-атмосфера, кинематографичные переходы без потери производительности.',
    tag: 'Three · GSAP',
  },
  {
    name: 'Лендинги и визитки',
    desc: 'Сильный первый экран, ясный оффер, анимации, которые усиливают бренд — а не отвлекают.',
    tag: 'Brand sites',
  },
  {
    name: 'Full-stack под ключ',
    desc: 'API, авторизация, админки, интеграции. От прототипа до продакшена с понятной поддержкой.',
    tag: 'Node · Cloud',
  },
]

export function Services() {
  return (
    <section className="section" id="services">
      <div className="section__inner">
        <div className="services__head">
          <div>
            <p className="eyebrow reveal">услуги</p>
            <h2 className="display services__title reveal reveal-d1">
              Что я <span className="serif">делаю</span>
            </h2>
          </div>
          <p className="lede reveal reveal-d2" style={{ margin: 0 }}>
            Беру ответственность за цифровой слой продукта — от идеи до релиза.
          </p>
        </div>
        <ul className="service-list">
          {services.map((s, i) => (
            <li className="service reveal" key={s.name} style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className="service__index">0{i + 1}</span>
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
