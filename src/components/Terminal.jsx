import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import Robot from './Robot'
import { site } from '../data/site'

/**
 * Robot flottant en bas à droite : un clic ouvre un mini terminal où l'on peut
 * taper des commandes (help, about, skills, projects, goto...). Un clin d'œil pour les développeurs.
 */
export default function TerminalDock({ t, lang, setLang, theme, setTheme, sections }) {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState(false)
  const [lines, setLines] = useState([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const term = t.terminal

  // Petite bulle d'invitation, une seule fois
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('terminal-hint') === '1'
    } catch {
      /* ignore */
    }
    if (seen) return
    const show = setTimeout(() => setHint(true), 7000)
    const hide = setTimeout(() => setHint(false), 13000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  // Message d'accueil affiché dès le départ
  useEffect(() => {
    setLines(term.welcome.map((text) => ({ kind: 'out', text })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (open) {
      setHint(false)
      try {
        sessionStorage.setItem('terminal-hint', '1')
      } catch {
        /* ignore */
      }
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function run(raw) {
    const [cmd, ...args] = raw.trim().toLowerCase().split(/\s+/)
    const out = (text) => ({ kind: 'out', text })
    switch (cmd) {
      case 'help':
        return term.help.map(out)
      case 'about':
        return term.about.map(out)
      case 'whoami':
        return [out(term.whoami)]
      case 'skills':
        return t.skills.groups.map((g) => out(`${g.title} : ${g.items.map((i) => i.name).join(', ')}`))
      case 'projects': {
        const f = t.projects.featured
        return [
          out(`${f.name} — ${f.subtitle}`),
          out(`  ${f.stack.join(' · ')}`),
          ...t.projects.wip.map((p) => out(`${p.name} (${t.projects.wipBadge}) — ${p.text}`)),
        ]
      }
      case 'journey':
        return t.journey.items.map((i) => out(`${i.date}  ${i.title}`))
      case 'contact':
        return [out(site.email), out(site.github), out(site.linkedin), out(`https://wa.me/${site.whatsapp}`)]
      case 'goto': {
        if (!args[0]) return [out(term.gotoUsage)]
        const id = args[0]
        if (!sections.includes(id)) return [out(term.gotoUnknown(id))]
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        return [out(term.gotoDone(id))]
      }
      case 'theme': {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        return [out(term.themeDone(term.themeNames[next]))]
      }
      case 'lang':
        setLang(lang === 'fr' ? 'en' : 'fr')
        return [out(term.langDone)]
      case 'sudo':
        return args[0] === 'hire-me' ? term.hire(site.email).map(out) : [out(term.sudo)]
      case 'exit':
        setOpen(false)
        return []
      case 'clear':
        return null
      case '':
        return []
      default:
        return [out(term.unknown(cmd))]
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    const raw = value
    setValue('')
    setCursor(-1)
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30))
    const result = run(raw)
    if (result === null) {
      setLines([])
      return
    }
    setLines((l) => [...l, { kind: 'in', text: raw }, ...result])
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      if (history[next] !== undefined) {
        setCursor(next)
        setValue(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(next)
      setValue(next >= 0 ? history[next] : '')
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={term.title}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-[70] flex h-[22rem] w-[min(92vw,34rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#140d09]/95 font-mono text-[0.82rem] text-[#f2e8dc] shadow-2xl shadow-black/40 backdrop-blur sm:right-6"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-xs text-[#b3a190]">{term.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.ui.terminalClose}
                className="rounded-md p-1 text-[#b3a190] transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto px-4 py-3" aria-live="polite">
              {lines.map((line, i) =>
                line.kind === 'in' ? (
                  <p key={i} className="break-words">
                    <span className="text-[#f3c78f]">$ </span>
                    {line.text}
                  </p>
                ) : (
                  <p key={i} className="whitespace-pre-wrap break-words text-[#d9c9b8]">
                    {line.text}
                  </p>
                ),
              )}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <span className="text-[#f3c78f]">$</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={term.placeholder}
                aria-label={term.placeholder}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="min-w-0 flex-1 rounded-none bg-transparent text-[#f2e8dc] outline-none focus-visible:outline-none placeholder:text-[#7d6c5d]"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulle d'invitation */}
      <AnimatePresence>
        {hint && !open && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-[6.2rem] right-4 z-[70] max-w-[14rem] rounded-2xl rounded-br-sm border border-line bg-surface px-4 py-2.5 text-sm font-medium shadow-lg sm:right-6"
          >
            {term.hint}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.ui.terminalClose : t.ui.terminalOpen}
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-[70] flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface shadow-lg shadow-accent/15 transition hover:scale-105 hover:border-accent sm:bottom-6 sm:right-6"
      >
        <Robot className="h-11 w-11" />
      </button>
    </>
  )
}
