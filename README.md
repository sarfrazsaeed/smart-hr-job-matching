# ⚡ SmartHire v2.0 — HR & Job Matching System

**Sarfraz Saeed · Computer Science · Air University Islamabad**

> A commercial-grade HR matching frontend built entirely without a backend — Phase 1 through Phase 4 complete.

[![Tests](https://github.com/sarfrazsaeed/smart-hr-job-matching/actions/workflows/ci.yml/badge.svg)](https://github.com/sarfrazsaeed/smart-hr-job-matching/actions)
[![Live Demo](https://img.shields.io/badge/Live-Demo-6366f1)](https://sarfrazsaeed.github.io/smart-hr-job-matching)

---

## 🚀 Live Demo

**[sarfrazsaeed.github.io/smart-hr-job-matching](https://sarfrazsaeed.github.io/smart-hr-job-matching)**

---

## 📋 What This Is

SmartHire is a full-featured HR candidate matching system that runs entirely in the browser using React 18, Tailwind CSS, and Chart.js. It implements a weighted scoring algorithm (70% skills / 20% experience / 10% education) to rank job candidates.

---

## ✅ Phase Status

| Phase | What | Status |
|-------|------|--------|
| **Phase 1** | Foundation — matching engine, localStorage, CSV export, dark mode, Chart.js | ✅ Done |
| **Phase 2** | React + TypeScript — SPA, hooks, typed components, SkillTagInput, Toast system | ✅ Done |
| **Phase 3** | Tailwind UI — landing page, 404, print mode, skeleton loaders, animations | ✅ Done |
| **Phase 4** | Testing — Jest units, React Testing Library, jest-axe, GitHub Actions CI | ✅ Done |
| Phase 5 | Django REST API + PostgreSQL + JWT auth | 📋 Planned |
| Phase 6 | AI features — spaCy NLP, OpenAI explanations, email (Celery) | 📋 Planned |
| Phase 7 | Production — Vercel + Render + Supabase + Cloudinary | 📋 Planned |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (UMD, no build needed for GitHub Pages) |
| Styling | Tailwind CSS (CDN) + Custom CSS animations |
| Charts | **Chart.js 4** — Doughnut, Bar, Radar, Polar Area |
| Animations | CSS Keyframes (Framer Motion-style) |
| Storage | localStorage (client-side only) |
| Testing | Jest 29 + React Testing Library + jest-axe |
| CI/CD | GitHub Actions — auto-test on every push |
| Deployment | GitHub Pages |
| Code Quality | ESLint + Prettier |

---

## 📁 File Structure

```
smarthire-v2/
├── index.html           ← Main React app (all pages)
├── landing.html         ← Marketing landing page
├── 404.html             ← Animated 404 error page
├── package.json         ← Jest + testing dependencies
├── babel.config.json    ← Babel for Jest
├── __tests__/
│   └── matchEngine.test.js  ← Phase 4: 30+ unit tests
├── .github/
│   └── workflows/
│       └── ci.yml       ← GitHub Actions CI/CD
└── README.md
```

---

## 🧪 Phase 4 — Running Tests

```bash
# Install test dependencies
npm install

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode (during development)
npm run test:watch
```

### Test Coverage

| Test Type | What | Tool |
|-----------|------|------|
| Unit | Match score calculation | Jest |
| Unit | Email validation | Jest |
| Unit | CSV export headers + escaping | Jest |
| Unit | Skills parser | Jest |
| Unit | Experience score formula | Jest |
| Unit | Skill score formula | Jest |
| Integration | Full job → candidates → match flow | Jest |
| Component | CandidateForm validation | React Testing Library |
| Component | MatchResults ordering | React Testing Library |
| Accessibility | All inputs have labels | jest-axe |
| CI | Auto-run on push to main | GitHub Actions |

---

## 🎯 Scoring Algorithm

```
Total Score = skill_score + exp_score + edu_score

skill_score = (matched_skills / required_skills) × 70
exp_score   = candidate_exp >= required_exp ? 20 : (candidate_exp / required_exp) × 20
edu_score   = BSCS / BS / MS / PhD mentioned ? 10 : 5

Max score: 100
```

---

## 📊 Chart.js Charts (Dashboard)

1. **Doughnut** — Job type distribution (Full-time, Remote, Part-time, etc.)
2. **Bar** — Top 8 skills by candidate frequency
3. **Radar** — Top 6 skills in spider-web form
4. **Polar Area** — Experience bracket distribution (0-1yr, 1-3yr, 3-5yr, 5+yr)

---

## 🌙 Features

- ✅ Candidate registration with SkillTag chip input
- ✅ HR job posting portal with bulk delete + filter
- ✅ Match engine with animated score circles + progress bars
- ✅ 4 Chart.js live charts in dashboard
- ✅ Dark mode (system-synced, persisted in localStorage)
- ✅ Skeleton loading screens
- ✅ Empty state illustrations
- ✅ CSV export (candidates + match results)
- ✅ Print-friendly match reports
- ✅ Responsive mobile hamburger nav
- ✅ Toast notifications with auto-dismiss progress bar
- ✅ Framer Motion-style CSS animations throughout
- ✅ 30+ Jest unit + integration tests
- ✅ GitHub Actions CI/CD pipeline

---

## 👨‍💻 Developer

**Sarfraz Saeed**  
Computer Science · Air University Islamabad  
[sarfrazsaeed.github.io/portfolio](https://sarfrazsaeed.github.io/portfolio)  
Built Phase 1 in 10 hours in first semester. Phase 4 by end of semester.