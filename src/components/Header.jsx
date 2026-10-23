import { useState } from 'react'
import Icon from './Icon.jsx'
import { config } from '../config.js'

const links = ['about', 'domains', 'projects', 'skills', 'journey', 'passions', 'contact']

export default function Header({ t, lang, onLang, dark, onTheme }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-3 font-display font-bold" aria-label={config.fullName}>
          <span className="grid size-9 place-items-center rounded-lg bg-brand text-sm text-on-brand">JA</span>
          <span className="hidden sm:inline">{config.shortName} Ayida</span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {links.map((id) => (
            <a key={id} href={`#${id}`} className="text-sm text-muted transition-colors hover:text-ink">
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLang}
            aria-label={t.ui.langLabel}
            className="h-10 rounded-full border border-line px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
          >
            {t.ui.lang}
          </button>
          <button
            type="button"
            onClick={onTheme}
            aria-label={t.ui.theme}
            aria-pressed={dark}
            className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-brand hover:text-brand"
          >
            <Icon name={dark ? 'sun' : 'moon'} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.ui.close : t.ui.menu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
          >
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-bg px-5 py-3 lg:hidden" aria-label="Navigation mobile">
          <ul className="grid gap-1">
            {links.map((id) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-medium hover:bg-sunken">
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
