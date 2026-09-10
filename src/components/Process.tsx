const steps = [
  {
    title: 'Бриф и ось',
    text: 'Фиксируем цель, аудиторию и одно сильное ощущение, которое должен оставить сайт.',
  },
  {
    title: 'Прототип движения',
    text: 'Собираем скролл-сценарий и ключевые переходы до того, как уходить в пиксельную полировку.',
  },
  {
    title: 'Сборка',
    text: 'WebGL, UI и контент сходятся в один ритм. Производительность — часть дизайна.',
  },
  {
    title: 'Релиз',
    text: 'Запуск, метрики, тонкая настройка анимаций уже на реальном трафике.',
  },
]

export function Process() {
  return (
    <section className="section process" id="process">
      <div className="section__inner">
        <p className="eyebrow reveal">процесс</p>
        <h2 className="display process__title reveal reveal-d1">
          Как идёт <span className="serif">работа</span>
        </h2>
        <div className="steps">
          {steps.map((s, i) => (
            <article className="step reveal" key={s.title} style={{ transitionDelay: `${i * 0.07}s` }}>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
