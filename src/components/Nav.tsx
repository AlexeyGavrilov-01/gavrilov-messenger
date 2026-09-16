const links = [
  { href: '#services', label: 'Услуги' },
  { href: '#pricing', label: 'Цены' },
  { href: '#work', label: 'Работы' },
  { href: '#process', label: 'Процесс' },
]

export function Nav() {
  return (
    <header className="nav">
      <a className="nav__brand" href="#top">
        alexey<i>.dev</i>
      </a>
      <nav aria-label="Навигация">
        <ul className="nav__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="nav__cta" href="#contact">
        Связаться
      </a>
    </header>
  )
}

export function ProgressRail({ active }: { active: number }) {
  return (
    <div className="progress" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <span key={i} className={`progress__tick${i === active ? ' is-on' : ''}`} />
      ))}
    </div>
  )
}
