import { useEffect } from 'react'
import { motion } from 'motion/react'
import Robot from './Robot'
import { site } from '../data/site'

const DURATION = 2400

/** Écran d'ouverture : le robot te salue, puis le rideau se lève. */
export default function Intro({ t, onDone }) {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = setTimeout(onDone, DURATION)
    const onKey = (e) => e.key === 'Escape' && onDone()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [onDone])

  return (
    <motion.div
      role="status"
      aria-label={t.intro.loading}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <Robot className="h-32 w-32 sm:h-40 sm:w-40" />
      </motion.div>

      <motion.p
        className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {site.name}
      </motion.p>
      <motion.p
        className="mt-2 text-sm font-medium uppercase tracking-[0.25em] text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {t.intro.loading}
      </motion.p>

      {/* Barre de chargement */}
      <div className="mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-line">
        <motion.div
          className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: (DURATION - 400) / 1000, ease: 'easeInOut' }}
        />
      </div>

      <button
        type="button"
        onClick={onDone}
        className="absolute bottom-8 rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted transition hover:border-accent hover:text-accent"
      >
        {t.intro.skip}
      </button>
    </motion.div>
  )
}
