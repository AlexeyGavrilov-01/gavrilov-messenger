export function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="section__inner">
        <p className="eyebrow reveal">контакт</p>
        <h2 className="display contact__title reveal reveal-d1">
          Давайте соберём
          <span className="serif">ваш сигнал</span>
        </h2>
        <p className="lede reveal reveal-d2">
          Расскажите о продукте в двух абзацах — отвечу со сроками и вилкой бюджета в течение дня.
        </p>
        <div className="contact__row reveal reveal-d3">
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
      <span>© {new Date().getFullYear()} · crafted with scroll & light</span>
    </footer>
  )
}
