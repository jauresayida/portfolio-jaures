import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useFinePointer } from '../hooks/useMedia'

/** Fait apparaître son contenu en douceur quand il entre dans l'écran. */
export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/** Cadre commun à toutes les sections : petit titre, grand titre, contenu. */
export function Section({ id, eyebrow, title, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 ${className}`}>
      <Reveal>
        <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-accent to-accent-2" />
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-10 sm:mt-14">{children}</div>
    </section>
  )
}

export function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
      {children}
    </span>
  )
}

/** Carte dont la bordure s'éclaire sous la souris et qui s'incline légèrement en 3D. */
export function SpotlightCard({ children, className = '', tilt = 5 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const fine = useFinePointer()

  const onMove = (e) => {
    const el = ref.current
    if (!el || !fine) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (!reduce && tilt) {
      const rx = (y / r.height - 0.5) * -2 * tilt
      const ry = (x / r.width - 0.5) * 2 * tilt
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`
    }
  }

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`spot transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform hover:shadow-lg hover:shadow-accent/10 ${className}`}
    >
      {children}
    </div>
  )
}

/** Le bouton est légèrement attiré par le curseur. */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (e) => {
    if (reduce || !fine || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}
