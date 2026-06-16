import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, ArrowRight, Target, BarChart2, Users, ShieldCheck,
  Github, ExternalLink, ChevronDown, TrendingUp, Briefcase
} from 'lucide-react'
import { siteConfig } from '../../data/content'
import { plans } from '../../data/pricing'
import { useState } from 'react'
import PricingCard from '../ui/PricingCard'

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: 'easeOut' } }),
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [billing, setBilling]   = useState<'monthly' | 'yearly'>('monthly')
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD')

  const goToApp = () => navigate('/app/candidates')

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5 font-display font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </span>
            {siteConfig.name}
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Pricing',  href: '#pricing'  },
              { label: 'About',    href: '#stack'     },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                {item.label}
              </a>
            ))}
            <button onClick={() => navigate('/pricing')}
              className="px-3 py-2 text-sm text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-slate-800 transition-colors">
              Full Pricing →
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <button onClick={goToApp}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Launch App <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.08) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Weighted scoring — 70% skills · 20% experience · 10% education
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
            Find the{' '}
            <span className="relative">
              <span className="text-emerald-400">perfect match</span>
              <motion.span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400/40 rounded-full"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
            </span>
            <br />for every role, instantly.
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SmartHire ranks candidates against job requirements using a precision scoring engine.
            Register candidates, post jobs, and get ranked results in seconds.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button onClick={goToApp} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base px-8 py-4 rounded-2xl transition-colors shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              Start Matching <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button onClick={() => navigate('/pricing')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium text-base px-8 py-4 rounded-2xl transition-colors">
              View Pricing
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.4}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '100%', label: 'Browser-based' },
              { value: '36',   label: 'Tests passing'  },
              { value: '3',    label: 'Scoring factors' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold font-display text-emerald-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-600">
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── App Preview ── */}
      <section className="py-16 px-4">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto bg-slate-900 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 bg-slate-900 rounded-md px-3 py-1 text-xs text-slate-500 text-center max-w-xs mx-auto">
              smarthr-job-matching/app/match
            </div>
          </div>
          <div className="p-6 space-y-3">
            {[
              { name: 'Sara Ahmed', score: 94, matched: ['react','typescript','node'], missing: [],           medal: '🥇', color: 'emerald' },
              { name: 'Ali Hassan', score: 78, matched: ['react','typescript'],        missing: ['node'],     medal: '🥈', color: 'amber'   },
              { name: 'Zara Malik', score: 61, matched: ['react'],                    missing: ['typescript','node'], medal: '🥉', color: 'rose' },
            ].map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-slate-800/60 rounded-xl p-4 border border-slate-700/30">
                <span className="text-xl">{r.medal}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {r.matched.map(s => <span key={s} className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{s}</span>)}
                    {r.missing.map(s => <span key={s} className="text-xs bg-rose-500/15 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div className={`h-full rounded-full bg-${r.color}-500`}
                      initial={{ width: 0 }} whileInView={{ width: `${r.score}%` }}
                      viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                  </div>
                  <span className={`text-sm font-bold text-${r.color}-400 w-10 text-right`}>{r.score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              Everything you need to hire smarter
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete HR matching system built entirely in the browser — no server, no database, no setup.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target,     title: 'Precision Matching',   desc: 'Weighted algorithm ranks candidates by skill fit, experience and education automatically.',          color: 'emerald' },
              { icon: Users,      title: 'Candidate Registry',   desc: 'Register applicants with skill tags. Search, sort, bulk-delete and export to CSV.',                 color: 'blue'    },
              { icon: Briefcase,  title: 'Job Management',       desc: 'Post jobs with required skills. Full-time, part-time, remote, contract and internship support.',     color: 'amber'   },
              { icon: BarChart2,  title: 'Live Dashboard',       desc: 'Chart.js visualisations show skill frequency, job types and experience brackets in real time.',      color: 'emerald' },
              { icon: ShieldCheck,title: 'Resume PDF Parsing',   desc: 'Upload a PDF resume and watch skills, experience and education auto-fill instantly in the browser.', color: 'blue'    },
              { icon: TrendingUp, title: 'CI/CD Pipeline',       desc: 'GitHub Actions runs 36 Vitest tests on Node 18 & 20 and auto-deploys to GitHub Pages on push.',     color: 'amber'   },
            ].map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className={`w-10 h-10 rounded-xl bg-${f.color}-500/10 flex items-center justify-center mb-4 group-hover:bg-${f.color}-500/20 transition-colors`}>
                  <f.icon className={`w-5 h-5 text-${f.color}-400`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing section ── */}
      <section id="pricing" className="py-24 px-4 bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">Start free, upgrade when ready. No hidden fees.</p>
          </motion.div>

          {/* Billing + currency controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
              {(['monthly', 'yearly'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    billing === b ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}>
                  {b}{b === 'yearly' && <span className="ml-1.5 text-xs text-emerald-400">-21%</span>}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
              {(['USD', 'PKR'] as const).map(c => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currency === c ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}>
                  {c === 'USD' ? '🇺🇸 USD' : '🇵🇰 PKR'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, i) => (
              <PricingCard key={plan.name} plan={plan} billing={billing} currency={currency}
                index={i} onCTA={() => navigate(plan.name === 'Enterprise' ? '/pricing' : '/app/candidates')} />
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => navigate('/pricing')}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4">
              See full feature comparison →
            </button>
          </div>
        </div>
      </section>

      {/* ── Scoring Algorithm ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">Algorithm</p>
            <h2 className="text-3xl font-bold font-display text-white mb-4">How scoring works</h2>
          </motion.div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { pct: '70%', label: 'Skills',     color: 'emerald' },
              { pct: '20%', label: 'Experience', color: 'amber'   },
              { pct: '10%', label: 'Education',  color: 'blue'    },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 text-center">
                <p className={`text-4xl font-bold font-display text-${s.color}-400 mb-2`}>{s.pct}</p>
                <p className="font-semibold text-white text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 font-mono text-sm text-center">
            <span className="text-slate-500">score = </span>
            <span className="text-emerald-400">(matched ÷ total) × 70</span>
            <span className="text-slate-500"> + </span>
            <span className="text-amber-400">exp_ratio × 20</span>
            <span className="text-slate-500"> + </span>
            <span className="text-blue-400">edu_bonus × 10</span>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section id="stack" className="py-24 px-4 bg-slate-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">Built with</p>
            <h2 className="text-3xl font-bold font-display text-white mb-10">Modern frontend stack</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {['React 18','TypeScript','Vite','Tailwind CSS','Framer Motion','Chart.js','React Router v6','Vitest','GitHub Actions','pdfjs-dist'].map((t, i) => (
              <motion.span key={t}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="bg-slate-800 border border-slate-700/50 text-slate-300 text-sm font-medium px-4 py-2 rounded-full hover:border-emerald-500/40 hover:text-emerald-400 transition-colors">
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 mx-auto mb-6 flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold font-display text-white mb-4">Ready to match smarter?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            No sign-up, no installation. Open the app and get ranked results instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button onClick={goToApp} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl transition-colors">
              Launch SmartHire <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button onClick={() => navigate('/pricing')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium px-8 py-4 rounded-2xl transition-colors">
              View Pricing
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-emerald-400" />
            </span>
            <span className="font-semibold text-slate-400">SmartHire</span>
            <span>· {siteConfig.author} · {siteConfig.university}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/pricing')} className="hover:text-emerald-400 transition-colors">Pricing</button>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href={siteConfig.live} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}