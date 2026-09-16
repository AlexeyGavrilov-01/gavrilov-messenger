const steps = [
  {
    t: 'Бриф и ось',
    d: 'Фиксируем цель и одно сильное ощущение, которое должен оставить сайт.',
  },
  {
    t: 'Прототип движения',
    d: 'Собираем скролл-сценарий и ключевые переходы до пиксельной полировки.',
  },
  {
    t: 'Сборка',
    d: 'WebGL, UI и контент сходятся в один ритм. Производительность — часть дизайна.',
  },
  {
    t: 'Релиз',
    d: 'Запуск, метрики и тонкая настройка анимаций на реальном трафике.',
  },
]

export function Process() {
  return (
    <section className="chapter" id="process">
      <div className="chapter__inner">
        <p className="kicker reveal">процесс</p>
        <h2 className="h-display process__title reveal d1">
          Как идёт <span className="h-serif">работа</span>
        </h2>
        <div className="steps">
          {steps.map((s, i) => (
            <article className="step reveal" key={s.t} style={{ transitionDelay: `${i * 0.07}s` }}>
              <h3 className="step__t">{s.t}</h3>
              <p className="step__d">{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="chapter contact" id="contact">
      <div className="chapter__inner">
        <p className="kicker reveal">контакт</p>
        <h2 className="h-display contact__title reveal d1">
          Соберём ваш
          <span className="h-serif">следующий кадр</span>
        </h2>
        <p className="lede reveal d2">
          Два абзаца о продукте — отвечу со сроками и вилкой бюджета в течение дня.
        </p>
        <div className="contact__row reveal d3">
          <a className="contact__mail" href="mailto:hello@alexey.dev">
            hello@alexey.dev
          </a>
          <div className="contact__socials">
            <a href="https://t.me/" target="_blank" rel="noreferrer">
              Telegram
            </a>
            <a href="https://github.com/" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <span>alexey.dev · product engineer</span>
      <span>© {new Date().getFullYear()} · forged in scroll & light</span>
    </footer>
  )
}
