import { Reveal, Section, SpotlightCard } from './ui'

export default function About({ t }) {
  const a = t.about
  return (
    <Section id="about" eyebrow={a.eyebrow} title={a.title}>
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
          {a.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.9] first-letter:text-accent' : ''}>
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal delay={120}>
          <SpotlightCard tilt={3} className="rounded-3xl border border-line bg-surface p-7">
            <h3 className="font-display text-xl font-semibold">{a.factsTitle}</h3>
            <dl className="mt-5 divide-y divide-line">
              {a.facts.map(([label, value]) => (
                <div key={label} className="py-4 first:pt-0 last:pb-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">{label}</dt>
                  <dd className="mt-1 text-base">{value}</dd>
                </div>
              ))}
            </dl>
          </SpotlightCard>
        </Reveal>
      </div>
    </Section>
  )
}
