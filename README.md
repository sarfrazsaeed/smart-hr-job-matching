# ⚡ SmartHire v3 — HR & Job Matching System

**Sarfraz Saeed · Computer Science · Air University Islamabad**

> A commercial-grade HR candidate matching system built entirely without a backend — Phase 1 through Phase 4 complete. Built with Vite, React 18, TypeScript, Framer Motion, Chart.js, and React Router v6.

[![SmartHire CI](https://github.com/sarfrazsaeed/smart-hr-job-matching/actions/workflows/ci.yml/badge.svg)](https://github.com/sarfrazsaeed/smart-hr-job-matching/actions)
[![Live Demo](https://img.shields.io/badge/Live-Demo-10B981)](https://sarfrazsaeed.github.io/smart-hr-job-matching/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-36%20passing-10B981)](https://github.com/sarfrazsaeed/smart-hr-job-matching/actions)

---

## 🚀 Live Demo

**[sarfrazsaeed.github.io/smart-hr-job-matching](https://sarfrazsaeed.github.io/smart-hr-job-matching/)**

---

## 📸 Pages

| Page | Description |
|---|---|
| `/` | Marketing landing page with hero, features, pricing, tech stack |
| `/pricing` | Full pricing page — Monthly/Yearly · USD/PKR toggle · FAQ |
| `/app/candidates` | Register candidates, upload PDF resume, bulk delete, CSV export |
| `/app/hr` | Post jobs, manage talent pipeline, tabbed view |
| `/app/match` | Run match engine, ranked results with score breakdown |
| `/app/dashboard` | Chart.js analytics — skills, job types, experience distribution |
| `/app/about` | Project roadmap, scoring algorithm, tech stack, developer info |
| `/404` | Animated 404 page with quick navigation links |

---

## 🧠 Scoring Algorithm

Each candidate is scored out of 100 using a weighted formula:

```
score = (matched_skills / total_skills × 70)
      + (candidate_exp / required_exp × 20)
      + (education_keyword_match × 10)
```

| Factor | Weight | How it's calculated |
|---|---|---|
| Skills | 70% | Matched skills ÷ required skills |
| Experience | 20% | Candidate years ÷ required years (capped at 20) |
| Education | 10% | Keyword match (BSCS, Masters, MBA etc.) |

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5.6 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Routing | React Router v6 |
| PDF Parsing | pdfjs-dist |
| Testing | Vitest 2 |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

---

## ✨ Features

- **Resume PDF Parsing** — upload a PDF resume and skills, experience, education auto-fill
- **Candidate Registry** — register applicants with skill tag chips, search, sort, bulk-delete, CSV export
- **Job Management** — post jobs with required skills, type (Full-time/Remote/Contract etc.), experience
- **Match Engine** — precision scoring with rank medals 🥇🥈🥉, matched/missing skill tags, progress bars
- **Live Dashboard** — Chart.js bar chart (skills), doughnut (job types), experience distribution
- **Pricing Page** — Monthly/Yearly billing toggle, USD/PKR currency switch, FAQ accordion
- **Landing Page** — hero, app preview, features, pricing section, scoring algorithm, tech stack, CTA
- **404 Page** — animated not-found page with quick navigation
- **Framer Motion** — page transitions, scroll-reveal, floating animations, score circle animation
- **Dark theme** — slate-950 navy + emerald-500 accent, custom scrollbar, responsive

---

## 🧪 Tests

**36 tests passing** with Vitest across 6 suites:

| Suite | Tests | Coverage |
|---|---|---|
| `parseSkills` | 6 | Comma splitting, trimming, empty filtering, lowercasing |
| `calcSkillScore` | 5 | Full match, no match, partial, empty job skills |
| `calcExpScore` | 5 | No requirement, meets, exceeds, under-qualified, zero |
| `calcEduScore` | 5 | BSCS, Masters, MBA, unrecognised, case-insensitive |
| `validateEmail` | 7 | Valid, missing @, missing domain, spaces, double @ |
| `exportCSV` | 5 | Headers, data, quotes, escaped quotes, empty array |
| `Score integration` | 3 | Perfect match=100, never exceeds 100, zero match |

```bash
npm test          # run all tests
npm run test:coverage  # with coverage report
```

---

## 🗺 Project Roadmap

| Phase | Title | Status |
|---|---|---|
| 1 | Core foundation — matching engine, scoring algorithm | ✅ Done |
| 2 | React 18 + TypeScript SPA — hooks, typed components | ✅ Done |
| 3 | Vite + Tailwind redesign — Framer Motion, dark navy | ✅ Done |
| 4 | Vitest tests + GitHub Actions CI/CD | ✅ Done |
| 5 | Django REST backend — API, PostgreSQL, JWT auth | 🔜 Upcoming |
| 6 | AI enhancements — NLP skill parsing, AI match explanations | 🔜 Upcoming |
| 7 | Production deploy — Docker, cloud hosting, monitoring | 🔜 Upcoming |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/sarfrazsaeed/smart-hr-job-matching.git
cd smart-hr-job-matching

# Install
npm install

# Dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Footer, AppLayout
│   ├── pages/         # LandingPage, CandidatePage, HRPage,
│   │                  # MatchPage, DashboardPage, AboutPage,
│   │                  # PricingPage, NotFoundPage
│   └── ui/            # Button, Badge, Card, ScoreCircle,
│                      # SkillInput, SkillTag, ResumeUploader,
│                      # PricingCard, StatCard, Toast, Skeleton...
├── data/              # content.ts, pricing.ts
├── hooks/             # useMatch, useToast, useLocalStorage, useScrolled
├── types/             # index.ts — all TypeScript interfaces
├── App.tsx            # React Router setup
├── main.tsx           # entry point
└── index.css          # Tailwind + custom design system
```

---

## 👨‍💻 Developer

**Sarfraz Saeed**
Computer Science · Air University Islamabad
[GitHub](https://github.com/sarfrazsaeed) · [Live Project](https://sarfrazsaeed.github.io/smart-hr-job-matching/)

---

*SmartHire v3 — Frontend complete. Django backend coming in Phase 5.*