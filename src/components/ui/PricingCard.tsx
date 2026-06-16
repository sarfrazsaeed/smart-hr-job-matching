import { motion } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import type { PricingPlan } from '../../data/pricing'

interface Props {
  plan: PricingPlan
  billing: 'monthly' | 'yearly'
  currency: 'USD' | 'PKR'
  index: number
  onCTA: () => void
}

export default function PricingCard({ plan, billing, currency, index, onCTA }: Props) {
  const price = billing === 'monthly'
    ? (currency === 'USD' ? plan.monthlyUSD : plan.monthlyPKR)
    : (currency === 'USD' ? plan.yearlyUSD  : plan.yearlyPKR)

  const symbol = currency === 'USD' ? '$' : 'Rs '
  const isCustom = price === null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col rounded-2xl p-6 border transition-all duration-300 ${
        plan.highlighted
          ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
          : 'border-slate-700/50 bg-slate-900 hover:border-slate-600'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white font-display mb-1">{plan.name}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {isCustom ? (
          <div>
            <p className="text-4xl font-black font-display text-white">Custom</p>
            <p className="text-sm text-slate-400 mt-1">Talk to our sales team</p>
          </div>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-sm text-slate-400 mb-2">{symbol}</span>
            <motion.span
              key={`${price}-${currency}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black font-display text-white leading-none"
            >
              {price === 0 ? '0' : price?.toLocaleString()}
            </motion.span>
            {price !== 0 && (
              <span className="text-sm text-slate-400 mb-2">
                /{billing === 'monthly' ? 'mo' : 'mo, billed yearly'}
              </span>
            )}
          </div>
        )}
        {!isCustom && price !== 0 && billing === 'yearly' && (
          <p className="text-xs text-emerald-400 mt-1">
            Save {currency === 'USD' ? '21%' : '21%'} with yearly billing
          </p>
        )}
        {price === 0 && <p className="text-sm text-slate-400 mt-1">Free forever</p>}
      </div>

      {/* CTA */}
      <motion.button
        onClick={onCTA}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mb-6 ${
          plan.highlighted
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : 'border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
        }`}
      >
        {plan.cta}
        {plan.highlighted && <ArrowRight className="w-4 h-4" />}
      </motion.button>

      {/* Features */}
      <div className="space-y-2.5 flex-1">
        {plan.features.map(f => (
          <div key={f} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-sm text-slate-300">{f}</span>
          </div>
        ))}
        {plan.notIncluded.map(f => (
          <div key={f} className="flex items-start gap-2.5">
            <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span className="text-sm text-slate-600">{f}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}