import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import PricingCard from '../ui/PricingCard'
import { plans, faqs } from '../../data/pricing'
import { siteConfig } from '../../data/content'

export default function PricingPage() {
  const navigate = useNavigate()
  const [billing, setBilling]   = useState<'monthly' | 'yearly'>('monthly')
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD')
  const [openFaq, setOpenFaq]   = useState<number | null>(null)

  const handleCTA = (planName: string) => {
    if (planName === 'Enterprise') {
      window.open(`mailto:sarfraz@au.edu.pk?subject=SmartHire Enterprise Enquiry`, '_blank')
    } else {
      navigate('/app/candidates')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 font-display font-bold text-lg text-white">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </span>
            {siteConfig.name}
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => navigate('/app/candidates')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Launch App
            </button>
          </div>
        </div>
      </header>

      <div className="pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-400 mb-6">
              Simple, transparent pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-black font-display text-white mb-4">
              Choose your plan
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Start free, upgrade when you're ready. No hidden fees, no surprise charges.
            </p>
          </motion.div>

          {/* Controls: Billing + Currency */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">

            {/* Billing toggle */}
            <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
              {(['monthly', 'yearly'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                    billing === b ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}>
                  {b}
                  {b === 'yearly' && (
                    <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                      Save 21%
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Currency toggle */}
            <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
              {(['USD', 'PKR'] as const).map(c => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currency === c ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}>
                  {c === 'USD' ? '🇺🇸 USD ($)' : '🇵🇰 PKR (Rs)'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan, i) => (
              <PricingCard
                key={plan.name}
                plan={plan}
                billing={billing}
                currency={currency}
                index={i}
                onCTA={() => handleCTA(plan.name)}
              />
            ))}
          </div>

          {/* Feature comparison note */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 mb-20 text-center">
            <p className="text-sm text-slate-400">
              All plans include <span className="text-white font-medium">browser-based matching</span>,{' '}
              <span className="text-white font-medium">36 passing tests</span>,{' '}
              <span className="text-white font-medium">GitHub Actions CI/CD</span>, and{' '}
              <span className="text-white font-medium">open-source access</span>.{' '}
              The Django backend is coming in <span className="text-emerald-400 font-medium">Phase 5</span>.
            </p>
          </motion.div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold font-display text-white text-center mb-8">
              Frequently asked questions
            </motion.h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA bottom */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-12">
            <h2 className="text-2xl font-bold font-display text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              Reach out and we'll help you pick the right plan for your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/app/candidates')}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                Try for free
              </button>
              <a href={`mailto:sarfraz@au.edu.pk?subject=SmartHire Pricing Question`}
                className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium px-6 py-3 rounded-xl transition-colors text-sm">
                Contact us
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}