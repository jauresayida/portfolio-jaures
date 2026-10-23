import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Fond animé : des points reliés entre eux comme un réseau de neurones.
 * Ils réagissent à la souris, s'arrêtent hors écran et changent de couleur avec le thème.
 */
export default function NeuralBackground({ className = '' }) {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }
    let w = 0
    let h = 0
    let nodes = []
    let raf = 0
    let running = false
    let onScreen = true
    let color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7b4421'
    let color2 = getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#c0873f'

    function resize() {
      const rect = host.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(85, Math.max(26, (w * h) / 17000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.5 + 0.9,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      const maxD = 135
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
          // Légère attirance vers le curseur
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const d = Math.hypot(dx, dy)
          if (d < 160 && d > 1) {
            n.x += (dx / d) * 0.35
            n.y += (dy / d) * 0.35
          }
        }
      }
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < maxD) {
            ctx.globalAlpha = (1 - d / maxD) * 0.32
            ctx.strokeStyle = color
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        // Lien vers le curseur
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (dm < 190) {
          ctx.globalAlpha = (1 - dm / 190) * 0.6
          ctx.strokeStyle = color2
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
      for (const n of nodes) {
        ctx.globalAlpha = 0.65
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function loop() {
      if (!running) return
      draw()
      raf = requestAnimationFrame(loop)
    }
    function start() {
      if (running || reduce) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onVisibility = () => (document.hidden || !onScreen ? stop() : start())

    resize()
    draw()
    start()

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(host)

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      onVisibility()
    })
    io.observe(host)

    // Quand le thème change, on récupère les nouvelles couleurs
    const mo = new MutationObserver(() => {
      const cs = getComputedStyle(document.documentElement)
      color = cs.getPropertyValue('--accent').trim() || color
      color2 = cs.getPropertyValue('--accent-2').trim() || color2
      if (!running) draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_65%,transparent)] ${className}`}
    />
  )
}
