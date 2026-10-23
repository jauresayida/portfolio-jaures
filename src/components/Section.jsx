// Enveloppe commune à toutes les sections : titre, texte d'introduction, espacement.
export default function Section({ id, title, lead, tone, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 sm:py-28 ${tone === 'sunken' ? 'bg-sunken' : ''}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-12 max-w-2xl">
          <h2 id={`${id}-title`} className="text-4xl font-bold sm:text-5xl">
            {title}
          </h2>
          {lead && <p className="mt-4 text-lg text-muted">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
