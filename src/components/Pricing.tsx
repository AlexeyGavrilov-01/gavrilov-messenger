const plans = [
  {
    tier: 'Старт',
    name: 'Визитка',
    price: 'от 90 000 ₽',
    hot: false,
    items: ['1–5 экранов', 'Адаптив + motion', 'Форма / Telegram', 'Срок ~2 недели'],
  },
  {
    tier: 'Сигнал',
    name: 'Experience',
    price: 'от 220 000 ₽',
    hot: true,
    items: [
      'Scroll-driven сцена',
      'WebGL / motion слой',
      'Услуги, цены, кейсы',
      'Core Web Vitals',
    ],
  },
  {
    tier: 'Система',
    name: 'Продукт',
    price: 'от 450 000 ₽',
    hot: false,
    items: ['Фронт + API', 'Админка / роли', 'Интеграции', 'Сопровождение релиза'],
  },
]

export function Pricing() {
  return (
    <section className="chapter" id="pricing">
      <div className="chapter__inner">
        <p className="kicker reveal">цены</p>
        <h2 className="h-display pricing__title reveal d1">
          Прозрачные <span className="h-serif">рамки</span>
        </h2>
        <p className="lede pricing__lede reveal d2">
          Фиксируем объём до старта. Ниже ориентиры — точная смета после короткого брифа.
        </p>
        <div className="plans">
          {plans.map((p, i) => (
            <article
              className={`plan reveal${p.hot ? ' plan--hot' : ''}`}
              key={p.name}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="plan__tier">{p.tier}</div>
              <h3 className="plan__name">{p.name}</h3>
              <div className="plan__price">
                {p.price}
                <small>/ проект</small>
              </div>
              <ul className="plan__list">
                {p.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="btn btn--ghost" href="#contact">
                Запросить смету
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
