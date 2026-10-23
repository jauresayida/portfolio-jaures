import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { SpotlightCard, Reveal } from './ui'

function CountUp({ to, duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (reduce) {
      setN(to)
      return
    }
    if (!inView) return
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (duration * 1000))
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduce])

  return <span ref={ref}>{n}</span>
}

export default function Stats({ t }) {
  const skillsCount = t.skills.groups.reduce((sum, g) => sum + g.items.length, 0)
  return (
    <section aria-label="Chiffres" className="mx-auto max-w-6xl px-5 pb-6 pt-10 sm:px-8">
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {t.stats.map((stat, i) => (
          <Reveal as="li" key={stat.label} delay={i * 90}>
            <SpotlightCard tilt={4} className="h-full rounded-3xl border border-line bg-surface p-5 sm:p-6">
              <p className="font-display text-4xl font-semibold text-gradient sm:text-5xl">
                <CountUp to={stat.computed === 'skills' ? skillsCount : stat.value} />
              </p>
              <p className="mt-2 text-sm leading-snug text-muted">{stat.label}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
