import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'left' | 'right'

interface Props {
  children: ReactNode
  direction?: Direction
  delay?: number
  className?: string
}

const offsets: Record<Direction, object> = {
  up:    { y: 24 },
  left:  { x: -32 },
  right: { x: 32 },
}

export default function AnimatedSection({
  children, direction = 'up', delay = 0, className = '',
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}