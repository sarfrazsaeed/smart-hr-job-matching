import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  skills: string[]
  onRemove?: (skill: string) => void
  readonly?: boolean
  variant?: 'matched' | 'missing' | 'default'
}

const variantClass = {
  matched: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  missing: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
}

export default function SkillTag({ skills, onRemove, readonly = false, variant = 'default' }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <AnimatePresence>
        {skills.map(skill => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${variantClass[variant]}`}
          >
            {skill}
            {!readonly && onRemove && (
              <button
                onClick={() => onRemove(skill)}
                className="ml-0.5 hover:text-white transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}