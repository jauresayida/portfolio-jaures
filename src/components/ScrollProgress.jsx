import { motion, useScroll, useSpring } from 'motion/react'

/** Fine barre dégradée en haut de la page : elle se remplit au fil de la lecture. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-accent to-accent-2"
    />
  )
}
