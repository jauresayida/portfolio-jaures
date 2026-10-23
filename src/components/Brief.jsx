import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check, Download, Mail, X } from 'lucide-react'
import { site } from '../data/site'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from './BrandIcons'
import { Tag } from './ui'

/** Fenêtre « L'essentiel en 30 secondes » : tout ce qu'un recruteur pressé doit savoir, au même endroit. */
export default function Brief({ t, onClose }) {
  const b = t.brief
  const closeRef = useRef(null)

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

  const link =
    'inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent'

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
        aria-labelledby="brief-title"
        initial={{ y: 48, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 48, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] border border-line bg-bg p-6 shadow-2xl sm:rounded-[2rem] sm:p-9"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.ui.close}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-accent"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4 pr-12">
          <img
            src={site.photo}
            alt=""
            className="h-16 w-16 shrink-0 rounded-full object-cover object-top ring-2 ring-accent/40"
          />
          <div>
            <h2 id="brief-title" className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
              {b.title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {site.name} · {t.hero.location}
            </p>
          </div>
        </div>

        <p className="mt-6 leading-relaxed text-muted">{b.summary}</p>

        <h3 className="mt-7 font-display text-lg font-semibold">{b.strengthsTitle}</h3>
        <ul className="mt-3 space-y-2.5">
          {b.strengths.map((item) => (
            <li key={item} className="flex gap-3 text-[0.95rem] leading-snug">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Check className="h-3 w-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-lg font-semibold">{b.lookingTitle}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{b.looking}</p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">{b.stackTitle}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {b.stack.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5 border-t border-line pt-6">
          {site.cv && (
            <a
              href={site.cv}
              download
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent shadow-lg shadow-accent/25"
            >
              <Download className="h-4 w-4" />
              {b.cv}
            </a>
          )}
          <a href={`mailto:${site.email}`} className={link}>
            <Mail className="h-4 w-4 text-accent" />
            {b.email}
          </a>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className={link}>
            <WhatsappIcon className="h-4 w-4 text-accent" />
            WhatsApp
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" className={link}>
            <LinkedinIcon className="h-4 w-4 text-accent" />
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noreferrer" className={link}>
            <GithubIcon className="h-4 w-4 text-accent" />
            GitHub
          </a>
        </div>

        <a
          href="#projects"
          onClick={onClose}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          {b.more}
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </motion.div>
  )
}
