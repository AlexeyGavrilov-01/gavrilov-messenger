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
        alexey<span>.dev</span>
      </a>
      <nav aria-label="Основная навигация">
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
