import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Search, Download, Trash2, Users, ChevronUp, ChevronDown, FileText } from 'lucide-react'
import AnimatedSection from '../ui/AnimatedSection'
import Button from '../ui/Button'
import SkillInput from '../ui/SkillInput'
import EmptyState from '../ui/EmptyState'
import StatCard from '../ui/StatCard'
import ResumeUploader from '../ui/ResumeUploader'
import type { Candidate, SortField, SortDir } from '../../types'

interface Props {
  candidates: Candidate[]
  setCandidates: (c: Candidate[]) => void
  addToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

const EMPTY: Omit<Candidate, 'id' | 'createdAt'> = {
  name: '', email: '', skills: '', experience: '', education: '',
}

const PAGE_SIZE = 8

export default function CandidatePage({ candidates, setCandidates, addToast }: Props) {
  const [form, setForm]         = useState(EMPTY)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage]         = useState(1)
  const [sort, setSort]         = useState<{ field: SortField; dir: SortDir }>({ field: 'createdAt', dir: 'desc' })
  const [showForm, setShowForm] = useState(false)
  const [resumeMode, setResumeMode] = useState<'manual' | 'resume'>('manual')

  const handleResumeExtracted = (data: { skills: string[]; experience: string; education: string }) => {
    setForm(f => ({
      ...f,
      skills:     data.skills.join(', '),
      experience: data.experience || f.experience,
      education:  data.education  || f.education,
    }))
    addToast(`Extracted ${data.skills.length} skills from resume!`, 'success')
  }

  const handleResumeClear = () => {
    setForm(f => ({ ...f, skills: '', experience: '', education: '' }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.skills.trim()) {
      addToast('Name, email and skills are required', 'error'); return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      addToast('Please enter a valid email', 'error'); return
    }
    if (candidates.some(c => c.email.toLowerCase() === form.email.toLowerCase())) {
      addToast('A candidate with this email already exists', 'error'); return
    }
    const newCandidate: Candidate = {
      ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    }
    setCandidates([...candidates, newCandidate])
    setForm(EMPTY)
    setShowForm(false)
    setResumeMode('manual')
    addToast(`${form.name} registered successfully!`, 'success')
  }

  const deleteSelected = () => {
    setCandidates(candidates.filter(c => !selected.has(c.id)))
    addToast(`Deleted ${selected.size} candidate(s)`, 'info')
    setSelected(new Set())
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Skills', 'Experience (yrs)', 'Education']
    const rows = candidates.map(c =>
      [c.name, c.email, c.skills, c.experience, c.education]
        .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'candidates.csv' }).click()
    addToast('CSV exported!', 'success')
  }

  const toggleSort = (field: SortField) => {
    setSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }))
  }

  const filtered = candidates
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const v = sort.dir === 'asc' ? 1 : -1
      return a[sort.field] > b[sort.field] ? v : -v
    })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const SortIcon = ({ field }: { field: SortField }) =>
    sort.field === field
      ? sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />

  const initials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="container-app py-8 space-y-6">

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="section-title">Candidates</h1>
            <p className="section-subtitle">Register and manage job applicants</p>
          </div>
          <Button onClick={() => setShowForm(f => !f)} variant="primary">
            <UserPlus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Candidate'}
          </Button>
        </div>
      </AnimatedSection>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total" value={candidates.length} icon={<Users className="w-5 h-5" />} color="emerald" delay={0} />
        <StatCard label="This session" value={candidates.filter(c => Date.now() - new Date(c.createdAt).getTime() < 3600000).length}
          icon={<UserPlus className="w-5 h-5" />} color="blue" delay={0.1} />
        <StatCard label="Selected" value={selected.size} icon={<Trash2 className="w-5 h-5" />} color="amber" delay={0.2} />
      </div>

      {/* Add form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">New Candidate</h2>
            {/* Toggle: Manual / Resume */}
            <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setResumeMode('manual')}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  resumeMode === 'manual'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Manual
              </button>
              <button
                onClick={() => setResumeMode('resume')}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  resumeMode === 'resume'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Upload Resume
              </button>
            </div>
          </div>

          {/* Resume uploader */}
          {resumeMode === 'resume' && (
            <div>
              <p className="text-xs text-slate-400 mb-3">
                Upload a PDF resume — skills, experience and education will be auto-filled. Review and edit before submitting.
              </p>
              <ResumeUploader onExtracted={handleResumeExtracted} onClear={handleResumeClear} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input className="input" placeholder="Sarah Ahmed" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email *</label>
              <input className="input" type="email" placeholder="sarah@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">
                Skills *
                {resumeMode === 'resume' && form.skills && (
                  <span className="ml-2 text-emerald-400 font-normal normal-case tracking-normal">✓ auto-filled from resume</span>
                )}
              </label>
              <SkillInput value={form.skills} onChange={v => setForm(f => ({ ...f, skills: v }))} />
            </div>
            <div>
              <label className="label">
                Experience (years)
                {resumeMode === 'resume' && form.experience && (
                  <span className="ml-2 text-emerald-400 font-normal normal-case tracking-normal">✓ auto-filled</span>
                )}
              </label>
              <input className="input" type="number" min="0" step="0.5" placeholder="2.5" value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>
            <div>
              <label className="label">
                Education
                {resumeMode === 'resume' && form.education && (
                  <span className="ml-2 text-emerald-400 font-normal normal-case tracking-normal">✓ auto-filled</span>
                )}
              </label>
              <input className="input" placeholder="BSCS, Air University" value={form.education}
                onChange={e => setForm(f => ({ ...f, education: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" variant="primary">Register Candidate</Button>
              <Button type="button" variant="secondary" onClick={() => { setForm(EMPTY); setShowForm(false); setResumeMode('manual') }}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Table */}
      <AnimatedSection delay={0.1}>
        <div className="card p-0 overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-700/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input className="input pl-9" placeholder="Search candidates..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <div className="flex gap-2 shrink-0">
              {selected.size > 0 && (
                <Button variant="danger" size="sm" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4" /> Delete ({selected.size})
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={exportCSV} disabled={candidates.length === 0}>
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Users className="w-7 h-7" />} title="No candidates yet"
              description="Add your first candidate using the button above." />
          ) : (
            <>
              <div className="table-container rounded-none border-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="th w-10">
                        <input type="checkbox"
                          checked={selected.size === paginated.length && paginated.length > 0}
                          onChange={e => setSelected(e.target.checked ? new Set(paginated.map(c => c.id)) : new Set())}
                          className="rounded border-slate-600 bg-slate-800" />
                      </th>
                      <th className="th cursor-pointer" onClick={() => toggleSort('name')}>
                        <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                      </th>
                      <th className="th cursor-pointer" onClick={() => toggleSort('email')}>
                        <span className="flex items-center gap-1">Email <SortIcon field="email" /></span>
                      </th>
                      <th className="th">Skills</th>
                      <th className="th cursor-pointer" onClick={() => toggleSort('experience')}>
                        <span className="flex items-center gap-1">Exp <SortIcon field="experience" /></span>
                      </th>
                      <th className="th">Education</th>
                      <th className="th w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(c => (
                      <tr key={c.id} className="tr-hover">
                        <td className="td">
                          <input type="checkbox" checked={selected.has(c.id)}
                            onChange={e => {
                              const s = new Set(selected)
                              e.target.checked ? s.add(c.id) : s.delete(c.id)
                              setSelected(s)
                            }}
                            className="rounded border-slate-600 bg-slate-800" />
                        </td>
                        <td className="td">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                              {initials(c.name)}
                            </span>
                            <span className="font-medium text-white">{c.name}</span>
                          </div>
                        </td>
                        <td className="td text-slate-400">{c.email}</td>
                        <td className="td max-w-[180px]">
                          <div className="flex flex-wrap gap-1">
                            {c.skills.split(',').slice(0, 3).map(s => (
                              <span key={s} className="badge-slate text-xs">{s.trim()}</span>
                            ))}
                            {c.skills.split(',').length > 3 && (
                              <span className="text-xs text-slate-500">+{c.skills.split(',').length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="td text-slate-400">{c.experience} yrs</td>
                        <td className="td text-slate-400 max-w-[140px] truncate">{c.education}</td>
                        <td className="td">
                          <button onClick={() => {
                            setCandidates(candidates.filter(x => x.id !== c.id))
                            addToast('Candidate removed', 'info')
                          }} className="text-slate-600 hover:text-rose-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
                  <span className="text-xs text-slate-500">
                    {filtered.length} candidates · page {page} of {totalPages}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                          page === i + 1 ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:bg-slate-800'
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}