import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { codeTabs, codeUi } from '../data/code'

// Petite coloration syntaxique maison (PHP / JavaScript) : aucune bibliothèque, donc rien à télécharger.
const KEYWORDS =
  'function return if else foreach for while try catch const let var new use class public private protected static await async import export default null true false throw fn as in of'
const TOKEN = new RegExp(
  [
    '(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
    '(?<string>\'(?:\\\\.|[^\'\\\\])*\'|"(?:\\\\.|[^"\\\\])*"|`(?:\\\\.|[^`\\\\])*`)',
    '(?<variable>\\$[A-Za-z_]\\w*)',
    `(?<keyword>\\b(?:${KEYWORDS.split(' ').join('|')})\\b)`,
    '(?<number>\\b\\d+(?:\\.\\d+)?\\b)',
    '(?<call>\\b[A-Za-z_]\\w*(?=\\())',
  ].join('|'),
  'g',
)

function highlight(code) {
  const out = []
  let last = 0
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const type = Object.keys(m.groups).find((k) => m.groups[k] !== undefined)
    out.push(
      <span key={m.index} className={`tok-${type}`}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

/** Fenêtre « Sous le capot » : trois extraits du vrai code d'IntelliRoom, avec une explication courte. */
export default function CodeModal({ lang, onClose }) {
  const ui = codeUi[lang] ?? codeUi.fr
  const [active, setActive] = useState(codeTabs[0].id)
  const closeRef = useRef(null)
  const tab = codeTabs.find((c) => c.id === active)
  const copy = tab[lang] ?? tab.fr
  const body = useMemo(() => highlight(tab.code), [tab])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="code-title"
        initial={{ y: 48, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 48, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] border border-line bg-bg shadow-2xl sm:rounded-[2rem]"
      >
        <div className="p-6 pb-4 sm:p-8 sm:pb-4">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={ui.close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-accent"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 id="code-title" className="pr-12 font-display text-2xl font-semibold sm:text-3xl">
            {ui.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{ui.intro}</p>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist">
            {codeTabs.map((c) => {
              const label = (c[lang] ?? c.fr).tab
              const on = c.id === active
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    on
                      ? 'border-accent bg-accent text-on-accent'
                      : 'border-line bg-surface text-muted hover:border-accent hover:text-accent'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
          <p className="rounded-2xl bg-accent-soft p-4 text-sm leading-relaxed text-accent">{copy.text}</p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-line" style={{ background: '#1b120c' }}>
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff6b5e]" />
              <span className="h-3 w-3 rounded-full bg-[#f7c04a]" />
              <span className="h-3 w-3 rounded-full bg-[#5fcf65]" />
              <span className="ml-2 truncate font-mono text-xs text-[#b3a190]">{tab.file}</span>
            </div>
            <pre
              className="code-block overflow-x-auto p-4 font-mono text-[0.78rem] leading-relaxed text-[#f2e8dc] sm:text-[0.82rem]"
              tabIndex={0}
              aria-label={tab.file}
            >
              <code>{body}</code>
            </pre>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}