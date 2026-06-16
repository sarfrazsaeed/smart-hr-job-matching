import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import type { Toast } from '../../types'

interface Props {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const icons = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  error:   <AlertCircle className="w-4 h-4 text-rose-400" />,
  info:    <Info className="w-4 h-4 text-blue-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
}

const borders = {
  success: 'border-emerald-500/30',
  error:   'border-rose-500/30',
  info:    'border-blue-500/30',
  warning: 'border-amber-500/30',
}

export default function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 48, scale: 0.95 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`flex items-start gap-3 bg-slate-800 border ${borders[toast.type]} rounded-xl px-4 py-3 shadow-lg`}
          >
            <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
            <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}