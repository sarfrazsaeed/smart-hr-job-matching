import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string | number
  icon: ReactNode
  color?: 'emerald' | 'amber' | 'rose' | 'blue'
  delay?: number
}

const colors = {
  emerald: 'text-emerald-400 bg-emerald-500/10',
  amber:   'text-amber-400   bg-amber-500/10',
  rose:    'text-rose-400    bg-rose-500/10',
  blue:    'text-blue-400    bg-blue-500/10',
}

export default function StatCard({ label, value, icon, color = 'emerald', delay = 0 }: Props) {
  return (
    <motion.div
      className="card flex items-center gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-2xl font-bold font-display text-white">{value}</p>
      </div>
    </motion.div>
  )
}