import type { NavItem } from '../types'

export const siteConfig = {
  name: 'SmartHire',
  tagline: 'Match the right talent, faster',
  description:
    'SmartHire is an AI-powered HR candidate matching system. Register candidates, post jobs, and instantly rank applicants using a weighted scoring algorithm.',
  github: 'https://github.com/sarfrazsaeed/smart-hr-job-matching',
  live:   'https://sarfrazsaeed.github.io/smart-hr-job-matching/',
  author: 'Sarfraz Saeed',
  university: 'Air University Islamabad',
}

export const navItems: NavItem[] = [
  { label: 'Candidates', page: 'candidates', icon: 'users' },
  { label: 'HR Portal',  page: 'hr',         icon: 'briefcase' },
  { label: 'Match',      page: 'match',       icon: 'target' },
  { label: 'Dashboard',  page: 'dashboard',   icon: 'bar-chart-2' },
  { label: 'About',      page: 'about',       icon: 'info' },
]

export const eduKeywords = [
  'bscs', 'bba', 'bse', 'bs', 'ms', 'mba', 'phd',
  'bachelor', 'master', 'bachelors', 'masters', 'degree',
]

export const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
] as const

export const roadmapPhases = [
  { phase: 1, title: 'Core foundation',         status: 'done',        detail: 'Registration, skill matching engine, scoring algorithm' },
  { phase: 2, title: 'React + TypeScript SPA',  status: 'done',        detail: 'Hooks, typed components, proper project structure' },
  { phase: 3, title: 'Vite + Tailwind redesign', status: 'done',       detail: 'Vite build, Framer Motion, dark navy design system' },
  { phase: 4, title: 'Tests + CI/CD',            status: 'done',       detail: 'Vitest unit tests, GitHub Actions pipeline' },
  { phase: 5, title: 'Django REST backend',      status: 'upcoming',   detail: 'REST API, PostgreSQL, JWT auth' },
  { phase: 6, title: 'AI enhancements',          status: 'upcoming',   detail: 'NLP skill parsing, AI match explanations' },
  { phase: 7, title: 'Production deploy',        status: 'upcoming',   detail: 'Docker, cloud hosting, monitoring' },
]

export const techStack = [
  { name: 'React 18',       category: 'Frontend' },
  { name: 'TypeScript',     category: 'Frontend' },
  { name: 'Vite',           category: 'Build' },
  { name: 'Tailwind CSS',   category: 'Styling' },
  { name: 'Framer Motion',  category: 'Animation' },
  { name: 'Chart.js',       category: 'Data Viz' },
  { name: 'React Router',   category: 'Routing' },
  { name: 'Vitest',         category: 'Testing' },
  { name: 'GitHub Actions', category: 'CI/CD' },
]