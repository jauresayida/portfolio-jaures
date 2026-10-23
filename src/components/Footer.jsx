import Icon from './Icon.jsx'
import { config } from '../config.js'

export default function Footer({ t }) {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-muted sm:px-8">
        <p>
          © {new Date().getFullYear()} {config.fullName}. {t.footer.rights}.
        </p>
        <a href="#top" className="inline-flex items-center gap-2 hover:text-ink">
          <Icon name="arrowUp" className="size-4" />
          {t.footer.top}
        </a>
      </div>
    </footer>
  )
}
