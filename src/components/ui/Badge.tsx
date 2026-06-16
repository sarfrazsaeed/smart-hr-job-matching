import type { ReactNode } from 'react'

type Variant = 'emerald' | 'slate' | 'amber' | 'rose'

interface Props {
  children: ReactNode
  variant?: Variant
  className?: string
}

const variants: Record<Variant, string> = {
  emerald: 'badge-emerald',
  slate:   'badge-slate',
  amber:   'badge-amber',
  rose:    'badge-rose',
}

export default function Badge({ children, variant = 'slate', className = '' }: Props) {
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}