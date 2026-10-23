import {
  BookOpen,
  Bot,
  Code2,
  Compass,
  Cpu,
  Dumbbell,
  Film,
  Flame,
  Lightbulb,
  Mountain,
  Music,
  Rocket,
} from 'lucide-react'
import { Reveal, Section, SpotlightCard } from './ui'

const passionIcons = { code: Code2, robot: Bot, ai: Cpu, book: BookOpen, video: Film, sport: Dumbbell, music: Music }
const valueIcons = { curiosity: Lightbulb, leadership: Compass, challenge: Mountain, perseverance: Flame }

export default function Passions({ t }) {
  const p = t.passions
  return (
    <Section id="passions" eyebrow={p.eyebrow} title={p.title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {p.items.map((item, i) => {
          const Icon = passionIcons[item.id]
          return (
            <Reveal key={item.id} delay={(i % 4) * 70}>
              <SpotlightCard className="h-full rounded-3xl border border-line bg-surface p-6 hover:border-accent/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </SpotlightCard>
            </Reveal>
          )
        })}
        {/* 8e case : la vision à 5 ans */}
        <Reveal delay={210}>
          <div className="flex h-full flex-col rounded-3xl bg-gradient-to-br from-accent to-accent-2 p-6 text-on-accent shadow-lg shadow-accent/20">
            <Rocket className="h-6 w-6" />
            <h3 className="mt-4 font-display text-lg font-semibold">{p.visionTitle}</h3>
            <p className="mt-1 text-sm leading-relaxed opacity-95">{p.vision}</p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <h3 className="font-display text-2xl font-semibold">{p.valuesTitle}</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.values.map((value, i) => {
            const Icon = valueIcons[value.id]
            return (
              <SpotlightCard key={value.id} className="rounded-3xl bg-accent-soft p-6">
                <div className="flex items-center justify-between text-accent">
                  <Icon className="h-6 w-6" />
                  <span className="font-display text-sm font-semibold opacity-60">0{i + 1}</span>
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold">{value.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted">{value.text}</p>
              </SpotlightCard>
            )
          })}
        </div>
      </Reveal>

      <Reveal className="mt-20">
        <figure className="mx-auto max-w-3xl text-center">
          <span aria-hidden="true" className="text-gradient font-display text-8xl leading-none">
            “
          </span>
          <blockquote className="-mt-4 font-display text-2xl font-medium leading-snug text-balance sm:text-4xl">
            {p.quote}
          </blockquote>
          <figcaption className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Jaurès Ayida
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  )
}
