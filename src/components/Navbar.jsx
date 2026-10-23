import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X, Zap } from 'lucide-react'
import { motion } from 'motion/react'

export default function Navbar({ t, lang, setLang, theme, setTheme, sections, onBrief }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Met en évidence la section visible à l'écran
  useEffect(() => {
    const els = sections.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections])

  const iconBtn =
    'inline-flex h-10 items-center justify-center gap-1 rounded-full border border-line bg-surface px-3 text-sm font-semibold text-text transition hover:border-accent hover:text-accent'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors ${
        scrolled || open ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Navigation">
        <a href="#top" className="flex items-center gap-2" aria-label={t.ui.backTop}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-sm font-bold text-on-accent">
            JA
          </span>
          <span className="hidden font-display text-lg font-semibold sm:inline">Jaurès Ayida</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`relative block rounded-full px-3 py-2 text-sm font-medium transition hover:text-accent ${
                  active === id ? 'text-accent' : 'text-muted'
                }`}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-accent-soft"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{t.nav[id]}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBrief}
            className="btn-shine hidden h-10 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-on-accent transition hover:opacity-90 sm:inline-flex"
          >
            <Zap className="h-4 w-4" />
            {t.ui.brief}
          </button>
          <button
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className={iconBtn}
            aria-label={t.ui.switchLang}
            title={t.ui.switchLang}
          >
            <span className={lang === 'fr' ? 'text-accent' : 'text-muted'}>FR</span>
            <span className="text-muted">/</span>
            <span className={lang === 'en' ? 'text-accent' : 'text-muted'}>EN</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`${iconBtn} w-10 px-0`}
            aria-label={theme === 'dark' ? t.ui.lightMode : t.ui.darkMode}
            title={theme === 'dark' ? t.ui.lightMode : t.ui.darkMode}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`${iconBtn} w-10 px-0 lg:hidden`}
            aria-expanded={open}
            aria-label={t.ui.menu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="mx-auto grid max-w-6xl gap-1 px-5 pb-4 sm:px-8 lg:hidden">
          <li>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onBrief()
              }}
              className="flex w-full items-center gap-2 rounded-xl bg-accent px-4 py-3 text-left text-base font-semibold text-on-accent"
            >
              <Zap className="h-4 w-4" />
              {t.ui.brief}
            </button>
          </li>
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-medium ${
                  active === id ? 'bg-accent-soft text-accent' : 'text-text'
                }`}
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
