import { useEffect, useRef } from 'react'

/** Petit robot dessiné en SVG : il cligne des yeux, son antenne pulse et ses yeux suivent le curseur. */
export default function Robot({ className = '', follow = true }) {
  const svgRef = useRef(null)
  const eyesRef = useRef(null)

  useEffect(() => {
    if (!follow) return
    const onMove = (e) => {
      const svg = svgRef.current
      const eyes = eyesRef.current
      if (!svg || !eyes) return
      const r = svg.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.45)
      const d = Math.hypot(dx, dy) || 1
      const m = Math.min(5, d / 30)
      eyes.style.transform = `translate(${(dx / d) * m}px, ${(dy / d) * m}px)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [follow])

  return (
    <svg ref={svgRef} viewBox="0 0 120 134" className={className} role="img" aria-label="Robot">
      <g className="float">
        {/* Antenne */}
        <line x1="60" y1="20" x2="60" y2="8" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="60" cy="6" r="5" fill="var(--accent-2)" className="robot-pulse" />
        {/* Oreilles */}
        <rect x="6" y="50" width="11" height="28" rx="5.5" fill="var(--accent)" />
        <rect x="103" y="50" width="11" height="28" rx="5.5" fill="var(--accent)" />
        {/* Tête */}
        <rect x="16" y="20" width="88" height="76" rx="24" fill="var(--surface)" stroke="var(--accent)" strokeWidth="4" />
        {/* Écran du visage */}
        <rect x="28" y="35" width="64" height="46" rx="16" fill="#1b120c" />
        <g ref={eyesRef} style={{ transition: 'transform 0.15s ease-out' }}>
          <rect className="robot-eye" x="40" y="48" width="12" height="17" rx="6" fill="#f3c78f" />
          <rect className="robot-eye" x="68" y="48" width="12" height="17" rx="6" fill="#f3c78f" />
        </g>
        <path d="M52 72 Q60 77 68 72" fill="none" stroke="#f3c78f" strokeWidth="2.6" strokeLinecap="round" />
        {/* Corps */}
        <rect x="34" y="100" width="52" height="28" rx="13" fill="var(--accent)" />
        <circle cx="60" cy="114" r="4.5" fill="var(--accent-2)" />
      </g>
    </svg>
  )
}
