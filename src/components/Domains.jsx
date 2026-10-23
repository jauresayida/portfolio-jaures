import Section from './Section.jsx'

export default function Domains({ t }) {
  const d = t.domains
  const [pillar, ...others] = d.items

  return (
    <Section id="domains" title={d.title} lead={d.lead} tone="sunken">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <article className="rounded-3xl bg-brand p-8 text-on-brand sm:p-10">
          <p className="inline-block rounded-full border border-on-brand/40 px-3 py-1 text-sm">{d.pillar}</p>
          <h3 className="mt-5 text-3xl font-bold sm:text-4xl">{pillar.name}</h3>
          <p className="mt-4 text-lg opacity-90">{pillar.text}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {pillar.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-on-brand/15 px-3 py-1 text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </article>

        <div className="divide-y divide-line border-y border-line">
          {others.map((item) => (
            <article key={item.name} className="py-7">
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <p className="mt-2 text-muted">{item.text}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
