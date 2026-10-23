import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/** Écrit puis efface les mots les uns après les autres, comme sur une machine à écrire. */
export default function Typewriter({ words, className = '' }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Si la langue change, on repart de zéro
  useEffect(() => {
    setIndex(0)
    setText('')
    setDeleting(false)
  }, [words])

  useEffect(() => {
    if (reduce) return
    const word = words[index % words.length]
    let timer
    if (!deleting && text === word) {
      timer = setTimeout(() => setDeleting(true), 1700)
    } else if (deleting && text === '') {
      timer = setTimeout(() => {
        setDeleting(false)
        setIndex((i) => i + 1)
      }, 250)
    } else {
      timer = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? 32 : 70,
      )
    }
    return () => clearTimeout(timer)
  }, [text, deleting, index, words, reduce])

  // Mouvement réduit : on affiche simplement la liste complète
  if (reduce) {
    return (
      <ul className={`space-y-1 ${className}`}>
        {words.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    )
  }

  return (
    <span className={className} aria-hidden="true">
      {text}
      <span className="caret" />
    </span>
  )
}
