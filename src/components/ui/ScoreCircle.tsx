import { motion } from 'framer-motion'

interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { outer: 44, stroke: 3, font: 'text-xs' },
  md: { outer: 56, stroke: 4, font: 'text-sm' },
  lg: { outer: 72, stroke: 5, font: 'text-base' },
}

function scoreColor(score: number) {
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#F59E0B'
  return '#F43F5E'
}

export default function ScoreCircle({ score, size = 'md' }: Props) {
  const { outer, stroke, font } = sizes[size]
  const r = (outer - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: outer, height: outer }}>
      <svg width={outer} height={outer} className="-rotate-90">
        <circle cx={outer / 2} cy={outer / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <motion.circle
          cx={outer / 2} cy={outer / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <span className={`absolute font-bold font-display ${font}`} style={{ color }}>
        {score}
      </span>
    </div>
  )
}