import { useEffect, useState } from 'react'

// Le navigateur peut refuser localStorage (navigation privée...) : on protège chaque accès.
function read(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* pas grave */
  }
}

export function useLang() {
  const [lang, setLang] = useState(() => (read('lang', 'fr') === 'en' ? 'en' : 'fr'))
  useEffect(() => {
    document.documentElement.lang = lang
    write('lang', lang)
  }, [lang])
  return [lang, setLang]
}

// Thème clair par défaut ; le choix du visiteur est mémorisé.
export function useTheme() {
  const [theme, setTheme] = useState(() => (read('theme', 'light') === 'dark' ? 'dark' : 'light'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    write('theme', theme)
  }, [theme])
  return [theme, setTheme]
}
