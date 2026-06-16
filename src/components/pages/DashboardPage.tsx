import { useMemo, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import AnimatedSection from '../ui/AnimatedSection'
import StatCard from '../ui/StatCard'
import EmptyState from '../ui/EmptyState'
import { Users, Briefcase, TrendingUp, BarChart2 } from 'lucide-react'
import type { Candidate, Job } from '../../types'

Chart.register(...registerables)

interface Props { candidates: Candidate[]; jobs: Job[] }

export default function DashboardPage({ candidates, jobs }: Props) {
  const skillsRef  = useRef<HTMLCanvasElement>(null)
  const typesRef   = useRef<HTMLCanvasElement>(null)
  const expRef     = useRef<HTMLCanvasElement>(null)
  const chartsRef  = useRef<Chart[]>([])

  const stats = useMemo(() => {
    const skillFreq: Record<string, number> = {}
    candidates.forEach(c =>
      c.skills.split(',').forEach(s => {
        const k = s.trim().toLowerCase()
        if (k) skillFreq[k] = (skillFreq[k] ?? 0) + 1
      })
    )
    const topSkills = Object.entries(skillFreq).sort((a, b) => b[1] - a[1]).slice(0, 8)

    const typeFreq: Record<string, number> = {}
    jobs.forEach(j => { typeFreq[j.type] = (typeFreq[j.type] ?? 0) + 1 })

    const expBuckets = [
      { label: '0–1 yr',  count: candidates.filter(c => parseFloat(c.experience || '0') < 1).length },
      { label: '1–3 yrs', count: candidates.filter(c => { const e = parseFloat(c.experience || '0'); return e >= 1 && e < 3 }).length },
      { label: '3–5 yrs', count: candidates.filter(c => { const e = parseFloat(c.experience || '0'); return e >= 3 && e < 5 }).length },
      { label: '5+ yrs',  count: candidates.filter(c => parseFloat(c.experience || '0') >= 5).length },
    ]

    return { topSkills, typeFreq, expBuckets }
  }, [candidates, jobs])

  useEffect(() => {
    chartsRef.current.forEach(c => c.destroy())
    chartsRef.current = []

    const EMERALD = '#10B981'
    const colors  = ['#10B981','#059669','#047857','#065F46','#34D399','#6EE7B7','#A7F3D0','#D1FAE5']
    const typeColors = ['#10B981','#F59E0B','#F43F5E','#6366F1','#8B5CF6']

    if (skillsRef.current && stats.topSkills.length > 0) {
      chartsRef.current.push(new Chart(skillsRef.current, {
        type: 'bar',
        data: {
          labels: stats.topSkills.map(([s]) => s),
          datasets: [{ label: 'Candidates', data: stats.topSkills.map(([, n]) => n), backgroundColor: colors }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: '#1e293b' } },
            y: { ticks: { color: '#94a3b8' }, grid: { display: false } },
          },
        },
      }))
    }

    if (typesRef.current && Object.keys(stats.typeFreq).length > 0) {
      chartsRef.current.push(new Chart(typesRef.current, {
        type: 'doughnut',
        data: {
          labels: Object.keys(stats.typeFreq),
          datasets: [{ data: Object.values(stats.typeFreq), backgroundColor: typeColors, borderWidth: 0 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12, font: { size: 11 } } } },
        },
      }))
    }

    if (expRef.current && candidates.length > 0) {
      chartsRef.current.push(new Chart(expRef.current, {
        type: 'bar',
        data: {
          labels: stats.expBuckets.map(b => b.label),
          datasets: [{ label: 'Candidates', data: stats.expBuckets.map(b => b.count), backgroundColor: EMERALD, borderRadius: 6 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
            y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: '#1e293b' } },
          },
        },
      }))
    }

    return () => { chartsRef.current.forEach(c => c.destroy()); chartsRef.current = [] }
  }, [stats, candidates.length])

  if (candidates.length === 0 && jobs.length === 0) {
    return (
      <div className="container-app py-8">
        <EmptyState
          icon={<BarChart2 className="w-7 h-7" />}
          title="No data yet"
          description="Add candidates and post jobs to see your dashboard analytics."
        />
      </div>
    )
  }

  return (
    <div className="container-app py-8 space-y-6">

      <AnimatedSection>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Analytics overview of your hiring pipeline</p>
      </AnimatedSection>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Candidates" value={candidates.length} icon={<Users className="w-5 h-5" />} color="emerald" delay={0} />
        <StatCard label="Jobs" value={jobs.length} icon={<Briefcase className="w-5 h-5" />} color="blue" delay={0.1} />
        <StatCard label="Unique Skills" value={new Set(candidates.flatMap(c => c.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean))).size}
          icon={<TrendingUp className="w-5 h-5" />} color="amber" delay={0.2} />
        <StatCard label="Avg Experience" value={candidates.length
          ? `${(candidates.reduce((s, c) => s + parseFloat(c.experience || '0'), 0) / candidates.length).toFixed(1)} yrs`
          : '—'} icon={<TrendingUp className="w-5 h-5" />} color="emerald" delay={0.3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top skills */}
        <AnimatedSection delay={0.1} className="card">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Top Skills in Candidate Pool</h3>
          {stats.topSkills.length > 0
            ? <div className="h-64"><canvas ref={skillsRef} /></div>
            : <p className="text-sm text-slate-500 py-8 text-center">No skill data yet</p>}
        </AnimatedSection>

        {/* Job types */}
        <AnimatedSection delay={0.15} className="card">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Job Types Distribution</h3>
          {Object.keys(stats.typeFreq).length > 0
            ? <div className="h-64"><canvas ref={typesRef} /></div>
            : <p className="text-sm text-slate-500 py-8 text-center">No jobs posted yet</p>}
        </AnimatedSection>

        {/* Experience distribution */}
        <AnimatedSection delay={0.2} className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Experience Distribution</h3>
          {candidates.length > 0
            ? <div className="h-48"><canvas ref={expRef} /></div>
            : <p className="text-sm text-slate-500 py-8 text-center">No candidate data yet</p>}
        </AnimatedSection>
      </div>

      {/* Skill leaderboard */}
      {stats.topSkills.length > 0 && (
        <AnimatedSection delay={0.25} className="card">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Skill Leaderboard</h3>
          <div className="space-y-2.5">
            {stats.topSkills.map(([skill, count], i) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-4 text-right">{i + 1}</span>
                <span className="text-sm text-slate-300 w-24 truncate capitalize">{skill}</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${(count / (stats.topSkills[0]?.[1] ?? 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}