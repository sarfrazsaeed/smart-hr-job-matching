import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Download, Trophy, AlertCircle } from 'lucide-react'
import AnimatedSection from '../ui/AnimatedSection'
import Button from '../ui/Button'
import ScoreCircle from '../ui/ScoreCircle'
import StatCard from '../ui/StatCard'
import EmptyState from '../ui/EmptyState'
import SkillTag from '../ui/SkillTag'
import { SkeletonCard } from '../ui/Skeleton'
import { useMatch } from '../../hooks'
import type { Job, Candidate, MatchResult } from '../../types'

interface Props {
  jobs: Job[]
  candidates: Candidate[]
  addToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function MatchPage({ jobs, candidates, addToast }: Props) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [results, setResults]         = useState<MatchResult[]>([])
  const [loading, setLoading]         = useState(false)
  const [ran, setRan]                 = useState(false)
  const { runMatch }                  = useMatch()

  const handleMatch = () => {
    if (!selectedJob) { addToast('Please select a job first', 'error'); return }
    if (candidates.length === 0) { addToast('No candidates registered yet', 'error'); return }
    setLoading(true)
    setRan(false)
    setTimeout(() => {
      const r = runMatch(selectedJob, candidates)
      setResults(r)
      setLoading(false)
      setRan(true)
      addToast(`Found ${r.length} match${r.length !== 1 ? 'es' : ''}!`, r.length > 0 ? 'success' : 'info')
    }, 700)
  }

  const exportCSV = () => {
    if (!results.length) return
    const headers = ['Rank', 'Name', 'Email', 'Score', 'Matched Skills', 'Missing Skills']
    const rows = results.map(r => [
      r.rank, r.candidate.name, r.candidate.email, r.score,
      r.matched.join('; '), r.missing.join('; ')
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'match-results.csv' }).click()
    addToast('Results exported!', 'success')
  }

  const summary = {
    total: results.length,
    avg: results.length ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0,
    top: results[0]?.score ?? 0,
    perfect: results.filter(r => r.missing.length === 0).length,
  }

  return (
    <div className="container-app py-8 space-y-6">

      {/* Header */}
      <AnimatedSection>
        <h1 className="section-title">Match Engine</h1>
        <p className="section-subtitle">Select a job to rank candidates by fit score</p>
      </AnimatedSection>

      {/* Job selector */}
      <AnimatedSection delay={0.1}>
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Select Job to Match</h2>
          {jobs.length === 0 ? (
            <p className="text-sm text-slate-500">No jobs posted yet. Go to HR Portal to post one.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {jobs.map(job => (
                <button key={job.id} onClick={() => { setSelectedJob(job); setRan(false) }}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                    selectedJob?.id === job.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}>
                  <p className="font-semibold text-sm">{job.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{job.company} · {job.exp || '0'} yrs</p>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={handleMatch} disabled={!selectedJob || loading || candidates.length === 0} variant="primary">
              <Target className="w-4 h-4" />
              {loading ? 'Matching...' : 'Run Match'}
            </Button>
            {results.length > 0 && (
              <Button onClick={exportCSV} variant="secondary" size="sm">
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Results */}
      {!loading && ran && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Matches" value={summary.total} icon={<Target className="w-5 h-5" />} color="emerald" delay={0} />
            <StatCard label="Avg Score" value={`${summary.avg}%`} icon={<Trophy className="w-5 h-5" />} color="blue" delay={0.1} />
            <StatCard label="Top Score" value={`${summary.top}%`} icon={<Trophy className="w-5 h-5" />} color="amber" delay={0.2} />
            <StatCard label="Perfect Fit" value={summary.perfect} icon={<Trophy className="w-5 h-5" />} color="emerald" delay={0.3} />
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon={<AlertCircle className="w-7 h-7" />}
              title="No matches found"
              description="No candidates scored above 0 for this job. Try adding more candidates or adjusting job requirements."
            />
          ) : (
            <div className="space-y-3">
              {results.map((r, idx) => (
                <motion.div
                  key={r.candidate.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="card flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Rank + score */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-2xl w-8 text-center">{MEDALS[idx] ?? `#${r.rank}`}</span>
                    <ScoreCircle score={r.score} size="md" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{r.candidate.name}</span>
                      <span className="text-xs text-slate-500">{r.candidate.email}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-2">
                      <span>Skill {r.skillScore}/70</span>
                      <span>·</span>
                      <span>Exp {r.expScore}/20</span>
                      <span>·</span>
                      <span>Edu {r.eduScore}/10</span>
                    </div>
                    <div className="space-y-1">
                      {r.matched.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-emerald-400 shrink-0 mt-0.5">✓ Matched:</span>
                          <SkillTag skills={r.matched} readonly variant="matched" />
                        </div>
                      )}
                      {r.missing.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-rose-400 shrink-0 mt-0.5">✗ Missing:</span>
                          <SkillTag skills={r.missing} readonly variant="missing" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="sm:w-32 shrink-0">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: r.score >= 80 ? '#10B981' : r.score >= 60 ? '#F59E0B' : '#F43F5E' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${r.score}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-right">{r.score}% fit</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}