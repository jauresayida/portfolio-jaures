import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useFinePointer } from '../hooks/useMedia'

/** Halo lumineux discret qui suit le curseur sur toute la page (ordinateur uniquement). */
export default function CursorGlow() {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduce) return
    let raf = 0
    let x = 0
    let y = 0
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x - 260}px, ${y - 260}px, 0)`
        el.style.opacity = '1'
        raf = 0
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [fine, reduce])

  if (!fine || reduce) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[520px] w-[520px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background:
          'radial-gradient(circle, color-mix(in srgb, var(--accent-2) 16%, transparent), transparent 65%)',
      }}
    />
  )
}
