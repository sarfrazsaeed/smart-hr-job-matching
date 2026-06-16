import { describe, it, expect } from 'vitest'

function parseSkills(raw: string): string[] {
  return raw.toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
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
  const kw = ['bscs','bba','bse','bs','ms','mba','phd','bachelor','master','bachelors','masters','degree']
  return kw.some(k => education.toLowerCase().includes(k)) ? 10 : 5
}
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
function exportCSV(candidates: Array<Record<string, string>>): string {
  const headers = ['Name','Email','Skills','Experience (yrs)','Education']
  const rows = candidates.map(c =>
    [c.name, c.email, c.skills, c.experience, c.education]
      .map(v => `"${(v ?? '').replace(/"/g,'""')}"`)
      .join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

describe('parseSkills', () => {
  it('splits comma-separated string', () => { expect(parseSkills('React, Node')).toEqual(['react','node']) })
  it('trims whitespace', () => { expect(parseSkills('  react ,  node  ')).toEqual(['react','node']) })
  it('filters empty segments', () => { expect(parseSkills('react,,node')).toEqual(['react','node']) })
  it('handles single skill', () => { expect(parseSkills('react')).toEqual(['react']) })
  it('returns empty for empty string', () => { expect(parseSkills('')).toEqual([]) })
  it('lowercases all skills', () => { expect(parseSkills('React,TypeScript')).toEqual(['react','typescript']) })
})

describe('calcSkillScore', () => {
  it('returns 70 for full match', () => { expect(calcSkillScore(['react','node'],['react','node'])).toBe(70) })
  it('returns 0 for no match', () => { expect(calcSkillScore(['react'],['python'])).toBe(0) })
  it('returns partial for partial match', () => { expect(calcSkillScore(['react','node','css'],['react','node'])).toBe(47) })
  it('returns 0 when job has no skills', () => { expect(calcSkillScore([],['react'])).toBe(0) })
  it('3 of 5 skills = 42', () => { expect(calcSkillScore(['react','node','css','python','java'],['react','node','css'])).toBe(42) })
})

describe('calcExpScore', () => {
  it('returns 20 when no requirement', () => { expect(calcExpScore(0,0)).toBe(20) })
  it('returns 20 when meets requirement', () => { expect(calcExpScore(3,3)).toBe(20) })
  it('returns 20 when exceeds requirement', () => { expect(calcExpScore(2,5)).toBe(20) })
  it('returns partial when under-qualified', () => { expect(calcExpScore(4,2)).toBe(10) })
  it('returns 0 for no experience', () => { expect(calcExpScore(3,0)).toBe(0) })
})

describe('calcEduScore', () => {
  it('returns 10 for BSCS', () => { expect(calcEduScore('BSCS Air University')).toBe(10) })
  it('returns 10 for Masters', () => { expect(calcEduScore('Masters in CS')).toBe(10) })
  it('returns 10 for MBA', () => { expect(calcEduScore('MBA Finance')).toBe(10) })
  it('returns 5 for unrecognised', () => { expect(calcEduScore('High School')).toBe(5) })
  it('is case-insensitive', () => { expect(calcEduScore('BACHELOR OF SCIENCE')).toBe(10) })
})

describe('validateEmail', () => {
  it('accepts valid email', () => { expect(validateEmail('user@example.com')).toBe(true) })
  it('accepts subdomain', () => { expect(validateEmail('user@mail.example.com')).toBe(true) })
  it('rejects missing @', () => { expect(validateEmail('userexample.com')).toBe(false) })
  it('rejects missing domain', () => { expect(validateEmail('user@')).toBe(false) })
  it('rejects spaces', () => { expect(validateEmail('user @example.com')).toBe(false) })
  it('rejects empty string', () => { expect(validateEmail('')).toBe(false) })
  it('rejects double @', () => { expect(validateEmail('user@@example.com')).toBe(false) })
})

describe('exportCSV', () => {
  const c = [{ name:'Ali Khan', email:'ali@test.com', skills:'react', experience:'2', education:'BSCS' }]
  it('includes headers', () => { expect(exportCSV(c)).toContain('Name,Email,Skills') })
  it('includes candidate data', () => { expect(exportCSV(c)).toContain('Ali Khan') })
  it('wraps values in quotes', () => { expect(exportCSV(c)).toContain('"Ali Khan"') })
  it('returns only header for empty array', () => { expect(exportCSV([]).split('\n')).toHaveLength(1) })
  it('escapes double quotes', () => {
    const q = [{ name:'O"Brien', email:'o@t.com', skills:'js', experience:'1', education:'BS' }]
    expect(exportCSV(q)).toContain('O""Brien')
  })
})

describe('Score integration', () => {
  it('perfect match = 100', () => {
    expect(Math.min(100, calcSkillScore(['react','node'],['react','node']) + calcExpScore(2,3) + calcEduScore('BSCS'))).toBe(100)
  })
  it('score never exceeds 100', () => { expect(Math.min(100, 70+20+10+50)).toBe(100) })
  it('zero match gives low score', () => {
    expect(calcSkillScore(['react'],['python']) + calcExpScore(5,0) + calcEduScore('High School')).toBe(5)
  })
})