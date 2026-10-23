import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { content } from './data/content'
import { useLang, useTheme } from './hooks/usePrefs'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Passions from './components/Passions'
import Gallery, { hasGallery } from './components/Gallery'
import Contact from './components/Contact'
import Intro from './components/Intro'
import ScrollProgress from './components/ScrollProgress'
import CursorGlow from './components/CursorGlow'
import TerminalDock from './components/Terminal'
import Brief from './components/Brief'

// Ordre des sections dans la page et dans le menu
const sections = ['about', 'skills', 'projects', 'journey', 'passions', ...(hasGallery ? ['gallery'] : []), 'contact']

// L'écran d'ouverture ne s'affiche qu'une fois par visite, et jamais si le visiteur préfère moins d'animations
function shouldShowIntro() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem('intro-seen') !== '1'
  } catch {
    return true
  }
}

export default function App() {
  const [lang, setLang] = useLang()
  const [theme, setTheme] = useTheme()
  const [intro, setIntro] = useState(shouldShowIntro)
  const [brief, setBrief] = useState(false)
  const t = content[lang]
  const closeBrief = useCallback(() => setBrief(false), [])

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem('intro-seen', '1')
    } catch {
      /* pas grave */
    }
    setIntro(false)
  }, [])

  return (
    <>
      <AnimatePresence>{intro && <Intro key="intro" t={t} onDone={finishIntro} />}</AnimatePresence>
      <ScrollProgress />
      <CursorGlow />
      <AnimatePresence>{brief && <Brief key="brief" t={t} onClose={closeBrief} />}</AnimatePresence>
      <Navbar
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        sections={sections}
        onBrief={() => setBrief(true)}
      />
      <main>
        <Hero t={t} ready={!intro} />
        <Stats t={t} />
        <About t={t} />
        <Skills t={t} />
        <Projects t={t} />
        <Journey t={t} />
        <Passions t={t} />
        {hasGallery && <Gallery t={t} lang={lang} />}
        <Contact t={t} />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} Jaurès Ayida · {t.footer.rights}
          </p>
          <p>{t.footer.built}</p>
        </div>
      </footer>
      <TerminalDock t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} sections={sections} />
    </>
  )
}
