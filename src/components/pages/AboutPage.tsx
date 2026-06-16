import { motion } from 'framer-motion'
import { Github, ExternalLink, CheckCircle, Clock, Zap } from 'lucide-react'
import AnimatedSection from '../ui/AnimatedSection'
import Badge from '../ui/Badge'
import { siteConfig, roadmapPhases, techStack } from '../../data/content'

export default function AboutPage() {
  return (
    <div className="container-app py-8 space-y-10 max-w-4xl">

      {/* Hero */}
      <AnimatedSection>
        <div className="card text-center py-10">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-emerald-500 mx-auto mb-4 flex items-center justify-center"
          >
            <Zap className="w-8 h-8 text-white" fill="currentColor" />
          </motion.div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">{siteConfig.name}</h1>
          <p className="text-emerald-400 font-medium mb-4">{siteConfig.tagline}</p>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">{siteConfig.description}</p>
          <div className="flex items-center justify-center gap-3">
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-sm gap-2">
              <Github className="w-4 h-4" /> View on GitHub
            </a>
            <a href={siteConfig.live} target="_blank" rel="noopener noreferrer"
              className="btn-primary text-sm gap-2">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* Scoring algorithm */}
      <AnimatedSection delay={0.1}>
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-4">Scoring Algorithm</h2>
          <p className="text-sm text-slate-400 mb-4">
            Each candidate is scored out of 100 using a weighted formula combining skill match, experience, and education.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Skills', weight: '70%', desc: 'Matched / required skills', color: 'text-emerald-400' },
              { label: 'Experience', weight: '20%', desc: 'Years vs requirement', color: 'text-amber-400' },
              { label: 'Education', weight: '10%', desc: 'Degree keyword match', color: 'text-blue-400' },
            ].map(item => (
              <div key={item.label} className="bg-slate-800 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold font-display ${item.color}`}>{item.weight}</p>
                <p className="text-sm font-semibold text-white mt-1">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 font-mono text-sm">
            <span className="text-slate-400">score = </span>
            <span className="text-emerald-400">(matched/total × 70)</span>
            <span className="text-slate-400"> + </span>
            <span className="text-amber-400">(exp_ratio × 20)</span>
            <span className="text-slate-400"> + </span>
            <span className="text-blue-400">(edu_bonus × 10)</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Tech stack */}
      <AnimatedSection delay={0.15}>
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map(t => (
              <div key={t.name} className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                <Badge variant="emerald">{t.category}</Badge>
                <span className="text-sm text-white font-medium">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Roadmap */}
      <AnimatedSection delay={0.2}>
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-6">Project Roadmap</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-700" />
            <div className="space-y-6">
              {roadmapPhases.map((p, i) => (
                <motion.div
                  key={p.phase}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-4 relative"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    p.status === 'done'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}>
                    {p.status === 'done'
                      ? <CheckCircle className="w-5 h-5" />
                      : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-slate-500 font-mono">Phase {p.phase}</span>
                      <Badge variant={p.status === 'done' ? 'emerald' : 'slate'}>
                        {p.status === 'done' ? 'Complete' : 'Upcoming'}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Developer */}
      <AnimatedSection delay={0.25}>
        <div className="card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl font-display shrink-0">
            {siteConfig.author.split(' ').map(w => w[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">{siteConfig.author}</p>
            <p className="text-sm text-slate-400">Computer Science · {siteConfig.university}</p>
          </div>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer"
            className="btn-ghost text-sm">
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
      </AnimatedSection>

    </div>
  )
}