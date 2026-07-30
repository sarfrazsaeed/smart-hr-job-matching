import { useState, type FormEvent, type DragEvent } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Plus, Trash2, Users, Search } from 'lucide-react'
import AnimatedSection from '../ui/AnimatedSection'
import Button from '../ui/Button'
import SkillInput from '../ui/SkillInput'
import EmptyState from '../ui/EmptyState'
import StatCard from '../ui/StatCard'
import Badge from '../ui/Badge'
import type { Job, Candidate, CandidateStatus } from '../../types'
import { jobTypes } from '../../data/content'

interface Props {
  jobs: Job[]
  setJobs: (j: Job[]) => void
  candidates: Candidate[]
  setCandidates: (c: Candidate[]) => void
  addToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

const EMPTY = { title: '', company: '', skills: '', exp: '', type: 'Full-time' as Job['type'] }

export default function HRPage({ jobs, setJobs, candidates, setCandidates, addToast }: Props) {
  const [form, setForm]       = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab]         = useState<'jobs' | 'candidates' | 'pipeline'>('jobs')
  const [search, setSearch]   = useState('')
  const [dragOverStage, setDragOverStage] = useState<CandidateStatus | null>(null)

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

  const stageOrder: CandidateStatus[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
  const stageColor = (status: CandidateStatus) => {
    return status === 'Hired' ? 'emerald' : status === 'Offer' ? 'amber' : status === 'Interview' ? 'blue' : status === 'Screening' ? 'rose' : 'slate'
  }

  const moveCandidateStage = (id: string, status: CandidateStatus) => {
    const candidate = candidates.find(c => c.id === id)
    setCandidates(candidates.map(c => c.id === id ? { ...c, status } : c))
    if (candidate && candidate.status !== status) {
      addToast(`${candidate.name} moved to ${status}`, 'success')
    }
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>, candidateId: string) => {
    event.dataTransfer.setData('text/plain', candidateId)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>, stage: CandidateStatus) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverStage(stage)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>, stage: CandidateStatus) => {
    event.preventDefault()
    setDragOverStage(null)
    const candidateId = event.dataTransfer.getData('text/plain')
    if (candidateId) {
      moveCandidateStage(candidateId, stage)
    }
  }

  const groupedCandidates = stageOrder.reduce((acc, stage) => {
    acc[stage] = candidates.filter(c => (c.status ?? 'Applied') === stage)
    return acc
  }, {} as Record<CandidateStatus, Candidate[]>)

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

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {stageOrder.map(stage => (
          <div key={stage} className="card p-4 bg-slate-900/90 border-slate-700/70">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{stage}</p>
              <Badge variant={stageColor(stage)} className="text-xs px-2 py-1">
                {stage}
              </Badge>
            </div>
            <p className="text-3xl font-semibold text-white">{groupedCandidates[stage]?.length ?? 0}</p>
            <p className="text-xs text-slate-500 mt-2">Candidates currently in this stage</p>
          </div>
        ))}
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
          <div className="flex border-b border-slate-700/50 overflow-x-auto">
            {(['jobs', 'candidates', 'pipeline'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setSearch('') }}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                  tab === t
                    ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                    : 'text-slate-400 hover:text-white'
                }`}>
                {t === 'jobs' ? `Jobs (${jobs.length})` : t === 'candidates' ? `Candidates (${candidates.length})` : 'Pipeline'}
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
          ) : tab === 'candidates' ? (
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
                    <Badge variant={stageColor(c.status ?? 'Applied')} className="text-xs px-3 py-1.5">
                      {c.status ?? 'Applied'}
                    </Badge>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Pipeline Board</h2>
                  <p className="text-sm text-slate-400">Move candidates through screening, interview, offer, and hire stages.</p>
                </div>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="min-w-[1200px] grid grid-cols-1 md:grid-cols-5 gap-4">
                  {stageOrder.map(stage => (
                    <div key={stage}
                      onDragOver={event => handleDragOver(event, stage)}
                      onDragLeave={handleDragLeave}
                      onDrop={event => handleDrop(event, stage)}
                      className={`rounded-[28px] border p-4 shadow-[0_24px_80px_-60px_rgba(15,23,42,0.8)] transition-all ${
                        dragOverStage === stage
                          ? 'border-emerald-400/70 bg-emerald-500/10 ring-1 ring-emerald-500/20'
                          : 'border-slate-700/60 bg-slate-900/90'
                      }`}>
                      <div className="flex items-center justify-between mb-4 gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stage}</p>
                          <p className="text-2xl font-semibold text-white">{groupedCandidates[stage]?.length ?? 0}</p>
                        </div>
                        <Badge variant={stageColor(stage)} className="text-xs px-2 py-1">
                          {stage}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {(groupedCandidates[stage] ?? []).map(candidate => (
                          <div key={candidate.id}
                            draggable
                            onDragStart={event => handleDragStart(event, candidate.id)}
                            className="rounded-3xl border border-slate-700/50 bg-slate-950/80 p-4 space-y-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.8)]">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-white text-sm truncate">{candidate.name}</p>
                                <p className="text-xs text-slate-400 truncate">{candidate.email}</p>
                              </div>
                              <span className="text-xs text-slate-400">{new Date(candidate.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                              <span>{candidate.experience || '0'} yrs exp</span>
                              <span>·</span>
                              <span>{candidate.education || 'N/A'}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.split(',').slice(0, 3).map(skill => (
                                <span key={skill} className="badge-slate text-xs">{skill.trim()}</span>
                              ))}
                              {candidate.skills.split(',').length > 3 && (
                                <span className="text-xs text-slate-500">+{candidate.skills.split(',').length - 3}</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {stage !== 'Applied' && (
                                <button type="button" onClick={() => moveCandidateStage(candidate.id, stageOrder[stageOrder.indexOf(stage) - 1])}
                                  className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800">
                                  Move back
                                </button>
                              )}
                              {stage !== 'Hired' && (
                                <button type="button" onClick={() => moveCandidateStage(candidate.id, stageOrder[stageOrder.indexOf(stage) + 1])}
                                  className="rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1.5 text-xs hover:bg-emerald-500/25">
                                  Advance
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {!(groupedCandidates[stage]?.length) && (
                          <div className="rounded-3xl border border-dashed border-slate-700/40 bg-slate-950/70 p-4 text-xs text-slate-500">
                            No candidates in {stage.toLowerCase()} yet.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}