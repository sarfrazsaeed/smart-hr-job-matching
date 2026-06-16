// ─── Core domain types ───────────────────────────────────────────────────────

export interface Candidate {
    id: string
    name: string
    email: string
    skills: string
    experience: string
    education: string
    createdAt: string
  }
  
  export interface Job {
    id: string
    title: string
    company: string
    skills: string
    exp: string
    type: JobType
    createdAt: string
  }
  
  export type JobType =
    | 'Full-time'
    | 'Part-time'
    | 'Contract'
    | 'Internship'
    | 'Remote'
  
  // ─── Match engine types ───────────────────────────────────────────────────────
  
  export interface MatchResult {
    candidate: Candidate
    score: number
    matched: string[]
    missing: string[]
    rank: number
    skillScore: number
    expScore: number
    eduScore: number
  }
  
  export interface MatchSummary {
    totalMatches: number
    avgScore: number
    topScore: number
    perfectMatches: number
  }
  
  // ─── UI / component types ─────────────────────────────────────────────────────
  
  export type SortField = 'name' | 'email' | 'experience' | 'createdAt'
  export type SortDir   = 'asc' | 'desc'
  
  export interface SortState {
    field: SortField
    dir: SortDir
  }
  
  export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  }
  
  export type Page = 'candidates' | 'hr' | 'match' | 'dashboard' | 'about'
  
  export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
  export type ButtonSize    = 'sm' | 'md' | 'lg'
  
  export interface NavItem {
    label: string
    page: Page
    icon: string
  }
  
  // ─── Dashboard types ──────────────────────────────────────────────────────────
  
  export interface SkillFrequency {
    skill: string
    count: number
  }
  
  export interface ExpBucket {
    label: string
    count: number
  }