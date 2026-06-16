import { useCallback } from 'react'
import type { Candidate, Job, MatchResult } from '../types'
import { eduKeywords } from '../data/content'

function parseSkills(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function calcSkillScore(jobSkills: string[], cSkills: string[]): number {
  if (jobSkills.length === 0) return 0
  const matched = jobSkills.filter(s => cSkills.includes(s))
  return Math.round((matched.length / jobSkills.length) * 70)
}

function calcExpScore(required: number, actual: number): number {
  if (required === 0) return 20
  if (actual >= required) return 20
  return Math.round((actual / required) * 20)
}

function calcEduScore(education: string): number {
  const lower = education.toLowerCase()
  return eduKeywords.some(k => lower.includes(k)) ? 10 : 5
}

export function useMatch() {
  const runMatch = useCallback((job: Job, candidates: Candidate[]): MatchResult[] => {
    const jobSkills = parseSkills(job.skills)
    const reqExp    = parseFloat(job.exp || '0')

    return candidates
      .map(c => {
        const cSkills   = parseSkills(c.skills)
        const matched   = jobSkills.filter(s => cSkills.includes(s))
        const missing   = jobSkills.filter(s => !cSkills.includes(s))
        const cExp      = parseFloat(c.experience || '0')

        const skillScore = calcSkillScore(jobSkills, cSkills)
        const expScore   = calcExpScore(reqExp, cExp)
        const eduScore   = calcEduScore(c.education)
        const score      = Math.min(100, skillScore + expScore + eduScore)

        return { candidate: c, score, matched, missing, rank: 0, skillScore, expScore, eduScore }
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r, i) => ({ ...r, rank: i + 1 }))
  }, [])

  return { runMatch }
}