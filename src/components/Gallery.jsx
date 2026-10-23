import { ImagePlus } from 'lucide-react'
import { gallery } from '../data/site'
import { Reveal, Section } from './ui'

/** Vrai quand la section doit être affichée : photos présentes, ou mode développement (aperçu). */
export const hasGallery = gallery.length > 0 || import.meta.env.DEV

export default function Gallery({ t, lang }) {
  const g = t.gallery
  return (
    <Section id="gallery" eyebrow={g.eyebrow} title={g.title}>
      {gallery.length === 0 ? (
        <>
          <p className="mb-6 max-w-2xl rounded-2xl border border-dashed border-accent p-4 text-sm text-accent">
            {g.devHint}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-line bg-surface text-muted"
              >
                <ImagePlus className="h-7 w-7" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {gallery.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 70} className="mb-4 break-inside-avoid">
              <figure className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10">
                <div className="overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo[lang]}
                    className="w-full transition duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {photo[lang] && <figcaption className="p-3 text-sm text-muted">{photo[lang]}</figcaption>}
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}
