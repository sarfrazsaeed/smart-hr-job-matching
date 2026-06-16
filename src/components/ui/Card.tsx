import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
  animate?: boolean
}

export default function Card({ children, className = '', hover = false, animate = false }: Props) {
  const base = hover ? 'card-hover cursor-pointer' : 'card'

  if (animate) {
    return (
      <motion.div
        className={`${base} ${className}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={`${base} ${className}`}>{children}</div>
}