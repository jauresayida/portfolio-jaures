import { Fragment } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowRight, MapPin } from 'lucide-react'
import { site } from '../data/site'
import { useFinePointer } from '../hooks/useMedia'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import NeuralBackground from './NeuralBackground'
import Typewriter from './Typewriter'
import { Magnetic } from './ui'

const ease = [0.22, 1, 0.36, 1]

const column = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }
const nameVariants = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } }
const letter = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 0.75, ease } } }

/** Le nom apparaît lettre par lettre, chaque lettre montant derrière un masque. */
function SplitName({ text }) {
  const words = text.split(' ')
  return words.map((word, wi) => (
    <Fragment key={wi}>
      <span className="inline-block overflow-hidden pb-[0.14em] align-bottom" aria-hidden="true">
        {word.split('').map((ch, ci) => (
          <motion.span key={ci} variants={letter} className={`inline-block ${wi === 1 ? 'text-gradient' : ''}`}>
            {ch}
          </motion.span>
        ))}
      </span>
      {wi < words.length - 1 && ' '}
    </Fragment>
  ))
}

export default function Hero({ t, ready }) {
  const h = t.hero
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const initial = reduce ? 'show' : 'hidden'
  const state = ready || reduce ? 'show' : 'hidden'

  // Inclinaison 3D du portrait selon la position de la souris
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 110, damping: 14 })
  const sry = useSpring(ry, { stiffness: 110, damping: 14 })
  const onPhotoMove = (e) => {
    if (reduce || !fine) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16)
  }
  const onPhotoLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <NeuralBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent-soft opacity-80 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={column} initial={initial} animate={state}>
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-sm font-medium text-muted backdrop-blur"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            {h.status}
          </motion.p>

          <motion.p variants={item} className="mt-8 text-lg text-muted">
            {h.hello}
          </motion.p>
          <motion.h1
            variants={nameVariants}
            aria-label={site.name}
            className="mt-1 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          >
            <SplitName text={site.name} />
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {site.fullName}
          </motion.p>

          <motion.div variants={item} className="mt-7 min-h-[3.5rem] font-display text-2xl font-medium text-accent sm:min-h-[3rem] sm:text-3xl">
            <span className="sr-only">{h.roles.join(' · ')}</span>
            <Typewriter words={h.roles} />
          </motion.div>

          <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {h.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent shadow-lg shadow-accent/25 transition hover:shadow-xl hover:shadow-accent/30"
              >
                {h.ctaProjects}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:border-accent hover:text-accent"
              >
                {h.ctaContact}
              </a>
            </Magnetic>
            <div className="ml-1 flex items-center gap-1">
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-full p-3 text-muted transition hover:-translate-y-0.5 hover:bg-accent-soft hover:text-accent"
              >
                <GithubIcon />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-full p-3 text-muted transition hover:-translate-y-0.5 hover:bg-accent-soft hover:text-accent"
              >
                <LinkedinIcon />
              </a>
            </div>
          </motion.div>

          <motion.p variants={item} className="mt-8 inline-flex items-center gap-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-accent" />
            {h.location}
          </motion.p>
        </motion.div>

        {/* Portrait en arche, incliné en 3D */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9, y: 40 }}
          animate={ready || reduce ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.25 }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
          onPointerMove={onPhotoMove}
          onPointerLeave={onPhotoLeave}
          style={{ perspective: 1000 }}
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 animate-[spin_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,var(--accent),var(--accent-2),transparent,var(--accent))] opacity-40 blur-3xl motion-reduce:animate-none"
          />
          <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }} className="relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-full w-full rounded-t-[999px] rounded-b-[2rem] border-2 border-accent/40"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-accent-soft shadow-xl shadow-accent/15">
              <img
                src={site.photo}
                alt={site.fullName}
                className="h-full w-full object-cover object-top"
                fetchPriority="high"
              />
            </div>
            <ul className="absolute -right-2 bottom-8 flex flex-col items-end gap-2 sm:-right-6" style={{ transform: 'translateZ(50px)' }}>
              {h.chips.map((chip, i) => (
                <li
                  key={chip}
                  className="float rounded-full border border-line bg-surface/95 px-4 py-1.5 text-xs font-semibold text-text shadow-md backdrop-blur"
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label={h.scroll}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted transition hover:text-accent sm:flex"
      >
        {h.scroll}
        <span className="flex h-9 w-5 justify-center rounded-full border-2 border-current pt-1.5">
          <span className="scroll-dot h-1.5 w-1 rounded-full bg-current" />
        </span>
      </a>
    </section>
  )
}