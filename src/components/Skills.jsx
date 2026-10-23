import { Bot, Code2, Network, Palette, Smartphone, Layers } from 'lucide-react'
import { Reveal, Section, SpotlightCard } from './ui'

const icons = {
  web: Code2,
  mobile: Smartphone,
  ai: Bot,
  network: Network,
  method: Layers,
  design: Palette,
}

function Dot({ level }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-accent ${
        level === 'pro' ? 'bg-accent' : 'bg-transparent'
      }`}
    />
  )
}

export default function Skills({ t }) {
  const s = t.skills
  return (
    <Section id="skills" eyebrow={s.eyebrow} title={s.title}>
      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{s.intro}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <Dot level="pro" />
            {s.legend.pro}
          </span>
          <span className="inline-flex items-center gap-2">
            <Dot level="learn" />
            {s.legend.learn}
          </span>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {s.groups.map((group, i) => {
          const Icon = icons[group.id]
          return (
            <Reveal key={group.id} delay={(i % 3) * 80}>
              <SpotlightCard className="h-full rounded-3xl border border-line bg-surface p-6 hover:border-accent/60">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{group.title}</h3>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex gap-3 text-[0.95rem] leading-snug">
                      <Dot level={item.level} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mt-10">
        <h3 className="font-display text-xl font-semibold">{s.softTitle}</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {s.soft.map((item) => (
            <li key={item} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
