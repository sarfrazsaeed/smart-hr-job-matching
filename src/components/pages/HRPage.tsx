import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Plus, Trash2, Users, Search } from 'lucide-react'
import AnimatedSection from '../ui/AnimatedSection'
import Button from '../ui/Button'
import SkillInput from '../ui/SkillInput'
import EmptyState from '../ui/EmptyState'
import StatCard from '../ui/StatCard'
import Badge from '../ui/Badge'
import type { Job, Candidate } from '../../types'
import { jobTypes } from '../../data/content'

interface Props {
  jobs: Job[]
  setJobs: (j: Job[]) => void
  candidates: Candidate[]
  addToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

const EMPTY = { title: '', company: '', skills: '', exp: '', type: 'Full-time' as Job['type'] }

export default function HRPage({ jobs, setJobs, candidates, addToast }: Props) {
  const [form, setForm]       = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab]         = useState<'jobs' | 'candidates'>('jobs')
  const [search, setSearch]   = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.company.trim() || !form.skills.trim()) {
      addToast('Title, company and skills are required', 'error')
      return
    }
    const job: Job = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setJobs([...jobs, job])
    setForm(EMPTY)
    setShowForm(false)
    addToast(`"${form.title}" posted successfully!`, 'success')
  }

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id))
    addToast('Job removed', 'info')
  }

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const typeColor = (t: string) => {
    const map: Record<string, 'emerald' | 'amber' | 'slate' | 'rose'> = {
      'Full-time': 'emerald', 'Part-time': 'amber',
      'Contract': 'slate', 'Internship': 'amber', 'Remote': 'emerald',
    }
    return map[t] ?? 'slate'
  }

  return (
    <div className="container-app py-8 space-y-6">

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="section-title">HR Portal</h1>
            <p className="section-subtitle">Post jobs and manage your talent pipeline</p>
          </div>
          <Button onClick={() => setShowForm(f => !f)} variant="primary">
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Post Job'}
          </Button>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Jobs Posted" value={jobs.length} icon={<Briefcase className="w-5 h-5" />} color="emerald" />
        <StatCard label="Candidates" value={candidates.length} icon={<Users className="w-5 h-5" />} color="blue" delay={0.1} />
      </div>

      {/* Post form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-base font-semibold text-white mb-4">New Job Posting</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Job Title *</label>
              <input className="input" placeholder="Frontend Developer" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Company *</label>
              <input className="input" placeholder="TechCorp Ltd." value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Required Skills * (press Enter after each)</label>
              <SkillInput value={form.skills} onChange={v => setForm(f => ({ ...f, skills: v }))} />
            </div>
            <div>
              <label className="label">Min. Experience (years)</label>
              <input className="input" type="number" min="0" step="0.5" placeholder="2" value={form.exp}
                onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} />
            </div>
            <div>
              <label className="label">Job Type</label>
              <select className="input" value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as Job['type'] }))}>
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" variant="primary">Post Job</Button>
              <Button type="button" variant="secondary" onClick={() => { setForm(EMPTY); setShowForm(false) }}>Cancel</Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tabs */}
      <AnimatedSection delay={0.1}>
        <div className="card p-0 overflow-hidden">
          <div className="flex border-b border-slate-700/50">
            {(['jobs', 'candidates'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setSearch('') }}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                    : 'text-slate-400 hover:text-white'
                }`}>
                {t === 'jobs' ? `Jobs (${jobs.length})` : `Candidates (${candidates.length})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input className="input pl-9" placeholder={`Search ${tab}...`} value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {tab === 'jobs' ? (
            filteredJobs.length === 0 ? (
              <EmptyState icon={<Briefcase className="w-7 h-7" />} title="No jobs posted yet"
                description="Post your first job using the button above." />
            ) : (
              <div className="divide-y divide-slate-700/30">
                {filteredJobs.map(job => (
                  <div key={job.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{job.title}</span>
                        <Badge variant={typeColor(job.type)}>{job.type}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{job.company} · {job.exp || '0'} yrs exp</p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.split(',').map(s => (
                          <span key={s} className="badge-slate">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => deleteJob(job.id)}
                      className="text-slate-600 hover:text-rose-400 transition-colors shrink-0 mt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredCandidates.length === 0 ? (
              <EmptyState icon={<Users className="w-7 h-7" />} title="No candidates yet"
                description="Candidates registered in the Candidates page will appear here." />
            ) : (
              <div className="divide-y divide-slate-700/30">
                {filteredCandidates.map(c => (
                  <div key={c.id} className="p-4 flex items-center gap-3 hover:bg-slate-800/30 transition-colors">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {c.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.email} · {c.experience} yrs</p>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {c.skills.split(',').slice(0, 3).map(s => (
                        <span key={s} className="badge-slate">{s.trim()}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}