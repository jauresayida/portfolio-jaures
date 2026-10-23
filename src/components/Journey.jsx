import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Briefcase, GraduationCap, HeartHandshake } from 'lucide-react'
import { Reveal, Section } from './ui'

const typeIcon = { work: Briefcase, edu: GraduationCap, volunteer: HeartHandshake }

export default function Journey({ t }) {
  const j = t.journey
  const listRef = useRef(null)
  // La ligne se remplit au fil du défilement
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })

  return (
    <Section id="journey" eyebrow={j.eyebrow} title={j.title}>
      <ol ref={listRef} className="relative max-w-4xl">
        <span aria-hidden="true" className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-line md:left-[11.65rem]" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY }}
          className="absolute bottom-3 left-[1.15rem] top-3 w-0.5 origin-top bg-gradient-to-b from-accent to-accent-2 md:left-[11.6rem]"
        />
        {j.items.map((item, i) => {
          const Icon = typeIcon[item.type]
          return (
            <Reveal as="li" key={item.title} delay={(i % 3) * 60} className="relative pb-10 last:pb-0">
              <div className="grid gap-x-8 gap-y-2 pl-14 md:grid-cols-[10rem_1fr] md:pl-0">
                <p className="text-sm font-semibold text-muted md:pt-2 md:text-right">{item.date}</p>
                <span className="absolute left-0 top-0 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full border border-line bg-surface text-accent shadow-sm transition hover:scale-110 hover:border-accent md:left-[10.5rem]">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="md:pl-10">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    {j.types[item.type]}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
