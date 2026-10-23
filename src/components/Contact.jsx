import { useRef, useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { site } from '../data/site'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from './BrandIcons'
import { Reveal, Section } from './ui'

export default function Contact({ t }) {
  const c = t.contact
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | success | error | mailto

  async function onSubmit(e) {
    e.preventDefault()
    const form = formRef.current
    const data = new FormData(form)
    if (data.get('company')) return // champ piège contre les robots
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    if (site.formEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        })
        if (!res.ok) throw new Error('send failed')
        form.reset()
        setStatus('success')
      } catch {
        setStatus('error')
      }
    } else {
      // Sans service d'envoi configuré : on ouvre la messagerie du visiteur
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(c.form.subject)}&body=${body}`
      setStatus('mailto')
    }
  }

  const field =
    'mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-base outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/30'
  const linkBtn =
    'flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-[0.95rem] font-medium transition hover:border-accent hover:text-accent'

  return (
    <Section id="contact" eyebrow={c.eyebrow} title={c.title}>
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="max-w-md text-lg leading-relaxed text-muted">{c.text}</p>
          <div className="mt-8 grid max-w-md gap-3">
            <a href={`mailto:${site.email}`} className={linkBtn}>
              <Mail className="h-5 w-5 text-accent" />
              {site.email}
            </a>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className={linkBtn}>
              <WhatsappIcon className="h-5 w-5 text-accent" />
              {c.whatsapp}
            </a>
            <a href={site.github} target="_blank" rel="noreferrer" className={linkBtn}>
              <GithubIcon className="h-5 w-5 text-accent" />
              GitHub
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className={linkBtn}>
              <LinkedinIcon className="h-5 w-5 text-accent" />
              LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
          >
            <label className="block text-sm font-semibold">
              {c.form.name}
              <input name="name" type="text" required autoComplete="name" className={field} />
            </label>
            <label className="mt-5 block text-sm font-semibold">
              {c.form.email}
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="mt-5 block text-sm font-semibold">
              {c.form.message}
              <textarea name="message" required rows={5} className={`${field} resize-y`} />
            </label>
            {/* Champ piège : invisible pour les humains */}
            <input name="company" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition hover:opacity-90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {status === 'sending' ? c.form.sending : c.form.send}
            </button>

            <p className="mt-4 min-h-6 text-sm" role="status" aria-live="polite">
              {status === 'success' && <span className="text-accent">{c.form.success}</span>}
              {status === 'error' && <span className="text-red-600 dark:text-red-400">{c.form.error}</span>}
              {status === 'mailto' && <span className="text-muted">{c.form.mailto}</span>}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
