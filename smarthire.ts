// SmartHire — TypeScript Core Types & Utilities
// smarthire.ts

export interface Candidate {
    id: string;
    name: string;
    email: string;
    skills: string;
    education: string;
    experience: string;
    registeredAt: string;
  }
  
  export interface Job {
    id: string;
    title: string;
    skills: string;
    exp: string;
    type: JobType;
    postedAt: string;
  }
  
  export type JobType = 'Full Time' | 'Part Time' | 'Internship' | 'Remote' | 'Contract';
  
  export interface MatchResult {
    candidate: Candidate;
    score: number;
    matched: string[];
    missing: string[];
    rank: number;
  }
  
  export interface DashboardStats {
    totalCandidates: number;
    totalJobs: number;
    uniqueSkills: number;
    avgExperience: number;
    topSkill: string;
    skillFrequency: Record<string, number>;
    jobTypeBreakdown: Record<string, number>;
    expBuckets: Record<string, number>;
  }
  
  // Storage helpers with TypeScript types
  export const Storage = {
    getCandidates(): Candidate[] {
      return JSON.parse(localStorage.getItem('candidates') || '[]');
    },
    saveCandidates(candidates: Candidate[]): void {
      localStorage.setItem('candidates', JSON.stringify(candidates));
    },
    getJobs(): Job[] {
      return JSON.parse(localStorage.getItem('jobs') || '[]');
    },
    saveJobs(jobs: Job[]): void {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  };
  
  // Match engine — typed
  export function matchCandidatesToJob(job: Job, candidates: Candidate[]): MatchResult[] {
    const jobSkills = job.skills.toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
    const results: MatchResult[] = candidates
      .map((c: Candidate) => {
        const cSkills = c.skills.toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
        const matched = jobSkills.filter((s: string) => cSkills.includes(s));
        const missing = jobSkills.filter((s: string) => !cSkills.includes(s));
        const skillScore = jobSkills.length > 0 ? (matched.length / jobSkills.length) * 70 : 0;
const candidateExp = parseFloat(c.experience || '0');
const requiredExp = parseFloat(job.exp || '0');
const expScore = requiredExp === 0 ? 20 : candidateExp >= requiredExp ? 20 : Math.round((candidateExp / requiredExp) * 20);
const eduKeywords = ['bscs','bba','bse','bs','ms','mba','phd','bachelor','master'];
const eduScore = eduKeywords.some(k => c.education.toLowerCase().includes(k)) ? 10 : 5;
const score = Math.min(100, Math.round(skillScore + expScore + eduScore));
        return { candidate: c, score, matched, missing, rank: 0 };
      })
      .filter((r: MatchResult) => r.score > 0)
      .sort((a: MatchResult, b: MatchResult) => b.score - a.score)
      .map((r: MatchResult, i: number) => ({ ...r, rank: i + 1 }));
    return results;
  }
  
  // Dashboard stats engine — typed
  export function computeDashboardStats(): DashboardStats {
    const candidates: Candidate[] = Storage.getCandidates();
    const jobs: Job[] = Storage.getJobs();
  
    const allSkills: string[] = candidates.flatMap((c: Candidate) =>
      c.skills.toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean)
    );
  
    const skillFrequency: Record<string, number> = {};
    allSkills.forEach((s: string) => { skillFrequency[s] = (skillFrequency[s] || 0) + 1; });
  
    const topSkill = Object.keys(skillFrequency).sort(
      (a: string, b: string) => skillFrequency[b] - skillFrequency[a]
    )[0] || '—';
  
    const jobTypeBreakdown: Record<string, number> = {};
    jobs.forEach((j: Job) => { jobTypeBreakdown[j.type] = (jobTypeBreakdown[j.type] || 0) + 1; });
  
    const expBuckets: Record<string, number> = { '0 yrs': 0, '1-2 yrs': 0, '3-5 yrs': 0, '6+ yrs': 0 };
    candidates.forEach((c: Candidate) => {
      const e = parseFloat(c.experience || '0');
      if (e === 0) expBuckets['0 yrs']++;
      else if (e <= 2) expBuckets['1-2 yrs']++;
      else if (e <= 5) expBuckets['3-5 yrs']++;
      else expBuckets['6+ yrs']++;
    });
  
    const avgExperience = candidates.length > 0
      ? parseFloat((candidates.reduce((sum: number, c: Candidate) =>
          sum + parseFloat(c.experience || '0'), 0) / candidates.length).toFixed(1))
      : 0;
  
    return {
      totalCandidates: candidates.length,
      totalJobs: jobs.length,
      uniqueSkills: Object.keys(skillFrequency).length,
      avgExperience,
      topSkill,
      skillFrequency,
      jobTypeBreakdown,
      expBuckets
    };
  }