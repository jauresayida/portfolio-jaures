import { useEffect, useState } from 'react'

/** Vrai quand l'appareil a une vraie souris (pas un écran tactile) : on y active les effets de survol. */
export function useFinePointer() {
  const query = '(hover: hover) and (pointer: fine)'
  const [fine, setFine] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return fine
}
