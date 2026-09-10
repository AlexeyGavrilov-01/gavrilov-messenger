const tiers = [
  {
    tier: 'Старт',
    name: 'Визитка',
    amount: 'от 90 000 ₽',
    featured: false,
    items: [
      '1–5 экранов',
      'Адаптив и базовая анимация',
      'Форма / Telegram',
      'Срок ~2 недели',
    ],
  },
  {
    tier: 'Сигнал',
    name: 'Experience site',
    amount: 'от 220 000 ₽',
    featured: true,
    items: [
      'Scroll-driven сцена',
      'WebGL / motion слой',
      'Услуги, цены, кейсы',
      'Оптимизация Core Web Vitals',
    ],
  },
  {
    tier: 'Система',
    name: 'Продукт',
    amount: 'от 450 000 ₽',
    featured: false,
    items: [
      'Кастомный фронт + API',
      'Админка / роли',
      'Интеграции и аналитика',
      'Сопровождение релиза',
    ],
  },
]

export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="section__inner">
        <p className="eyebrow reveal">цены</p>
        <h2 className="display pricing__title reveal reveal-d1">
          Прозрачные <span className="serif">рамки</span>
        </h2>
        <p className="lede pricing__lede reveal reveal-d2">
          Фиксируем объём до старта. Ниже — ориентиры; точная смета — после короткого брифа.
        </p>
        <div className="price-grid">
          {tiers.map((t, i) => (
            <article
              className={`price reveal${t.featured ? ' price--featured' : ''}`}
              key={t.name}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="price__tier">{t.tier}</div>
              <h3 className="price__name">{t.name}</h3>
              <div className="price__amount">
                {t.amount} <small>/ проект</small>
              </div>
              <ul className="price__list">
                {t.items.map((item) => (
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
