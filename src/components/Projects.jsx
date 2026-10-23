import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from 'lucide-react'
import { intelliroomLinks, intelliroomMobileShots, intelliroomShots } from '../data/site'
import { useFinePointer } from '../hooks/useMedia'
import { GithubIcon } from './BrandIcons'
import { Reveal, Section, SpotlightCard, Tag } from './ui'

const AUTOPLAY_MS = 4500

function Lightbox({ src, alt, onClose, onPrev, onNext, t }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, onPrev, onNext])

  const btn =
    'absolute flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 sm:p-10"
      onClick={onClose}
    >
      <button type="button" onClick={onClose} className={`${btn} right-4 top-4`} aria-label={t.ui.close}>
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className={`${btn} left-3 top-1/2 -translate-y-1/2`}
        aria-label={t.ui.prev}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <motion.img
        key={src}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={src}
        alt={alt}
        className="max-h-full max-w-full rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className={`${btn} right-3 top-1/2 -translate-y-1/2`}
        aria-label={t.ui.next}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </motion.div>
  )
}

/** Ordinateur portable en 3D : il s'incline avec la souris et fait défiler les captures. */
function Laptop({ src, alt, onZoom, label }) {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 100, damping: 16 })
  const sry = useSpring(ry, { stiffness: 100, damping: 16 })

  const onMove = (e) => {
    if (reduce || !fine) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 9)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}>
        {/* Écran */}
        <div className="rounded-t-[1.1rem] bg-[#1c1511] p-[0.55rem] pb-[0.6rem] shadow-2xl shadow-accent/20 ring-1 ring-black/20 sm:p-3">
          <div className="relative aspect-[1365/630] overflow-hidden rounded-md bg-black">
            <AnimatePresence initial={false}>
              <motion.img
                key={src}
                src={src}
                alt={alt}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </AnimatePresence>
            <button
              type="button"
              onClick={onZoom}
              aria-label={label}
              className="group absolute inset-0 cursor-zoom-in"
            >
              <span className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
        {/* Base */}
        <div className="relative mx-auto -mt-px h-3 w-[108%] -translate-x-[3.7%] rounded-b-[1.4rem] bg-gradient-to-b from-[#d6cabd] to-[#9c8e80] shadow-lg">
          <span className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-lg bg-[#7d6f62]/70" />
        </div>
      </motion.div>
    </div>
  )
}

/** Téléphone : n'apparaît que si tu ajoutes des captures mobiles dans site.js. */
function Phone({ shots, index }) {
  const src = shots[index % shots.length]
  return (
    <div className="absolute -bottom-6 -right-2 w-[24%] min-w-[5.5rem] rotate-[5deg] sm:-right-5">
      <div className="float rounded-[1.6rem] bg-[#1c1511] p-[0.35rem] shadow-2xl shadow-black/30 ring-1 ring-black/20">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.25rem] bg-black">
          <AnimatePresence initial={false}>
            <motion.img
              key={src}
              src={src}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </AnimatePresence>
          <span className="absolute left-1/2 top-1.5 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black/80" />
        </div>
      </div>
    </div>
  )
}

function Showcase({ t, captions }) {
  const reduce = useReducedMotion()
  const boxRef = useRef(null)
  const inView = useInView(boxRef, { margin: '-15% 0px' })
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const count = intelliroomShots.length
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const close = useCallback(() => setZoom(false), [])

  // Diaporama automatique : en pause au survol, quand l'image est agrandie, hors écran ou si le visiteur le demande
  const playing = !reduce && !userPaused && !hovered && !zoom && inView
  useEffect(() => {
    if (!playing) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [playing, next, index])

  return (
    <div ref={boxRef} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      <div className="relative pb-6">
        <Laptop src={intelliroomShots[index]} alt={captions[index]} onZoom={() => setZoom(true)} label={t.ui.zoom} />
        {intelliroomMobileShots.length > 0 && <Phone shots={intelliroomMobileShots} index={index} />}
      </div>

      <div className="mt-3 flex items-start gap-3">
        <p className="min-h-[3rem] flex-1 text-sm leading-relaxed text-muted" aria-live="polite">
          <span className="font-semibold text-accent">
            {index + 1}/{count}
          </span>{' '}
          — {captions[index]}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label={t.ui.prev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t.ui.next}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {!reduce && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? t.ui.play : t.ui.pause}
              title={userPaused ? t.ui.play : t.ui.pause}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent"
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-7 gap-2">
        {intelliroomShots.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}/${count}`}
              aria-current={i === index}
              className={`relative block w-full overflow-hidden rounded-lg border-2 transition ${
                i === index ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
              {i === index && playing && (
                <motion.span
                  key={`bar-${index}`}
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-accent-2"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {zoom && (
          <Lightbox src={intelliroomShots[index]} alt={captions[index]} onClose={close} onPrev={prev} onNext={next} t={t} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Projects({ t }) {
  const p = t.projects
  const f = p.featured
  return (
    <Section id="projects" eyebrow={p.eyebrow} title={p.title}>
      <Reveal>
        <article className="rounded-[2rem] border border-line bg-surface p-6 shadow-xl shadow-accent/5 sm:p-10">
          <p className="inline-block rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-on-accent">
            {f.badge}
          </p>
          <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{f.name}</h3>
          <p className="mt-1 text-lg text-muted">{f.subtitle}</p>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Showcase t={t} captions={f.shots} />
            </div>

            <div className="lg:col-span-5">
              <p className="leading-relaxed text-muted">{f.context}</p>
              <p className="mt-4 rounded-2xl bg-accent-soft p-4 text-sm font-medium leading-relaxed text-accent">
                {f.role}
              </p>

              <h4 className="mt-8 font-display text-lg font-semibold">{f.highlightsTitle}</h4>
              <ul className="mt-3 space-y-2.5">
                {f.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-snug">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent to-accent-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
            <div>
              <h4 className="font-display text-lg font-semibold">{f.nextTitle}</h4>
              <ul className="mt-3 space-y-2 text-[0.95rem] text-muted">
                {f.next.map((item) => (
                  <li key={item} className="flex gap-3">
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="flex flex-wrap gap-2">
                {f.stack.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
              {(intelliroomLinks.github || intelliroomLinks.demo) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {intelliroomLinks.github && (
                    <a
                      href={intelliroomLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
                    >
                      <GithubIcon className="h-4 w-4" />
                      {f.github}
                    </a>
                  )}
                  {intelliroomLinks.demo && (
                    <a
                      href={intelliroomLinks.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:opacity-90"
                    >
                      {f.demo}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>
      </Reveal>

      <Reveal className="mt-16">
        <h3 className="font-display text-2xl font-semibold">{p.wipTitle}</h3>
        <p className="mt-1 text-muted">{p.wipIntro}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {p.wip.map((item) => (
            <SpotlightCard
              key={item.name}
              className="flex flex-col rounded-3xl border border-dashed border-line bg-surface p-6 hover:border-accent/60"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-display text-xl font-semibold">{item.name}</h4>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                  {p.wipBadge}
                </span>
              </div>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{item.text}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.stack.map((s) => (
                  <li key={s}>
                    <Tag>{s}</Tag>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
