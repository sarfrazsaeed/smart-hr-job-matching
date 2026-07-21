# CLAUDE.md

## Tech Stack
- React 18 + TypeScript 5.6
- Vite 6 for development and builds
- Tailwind CSS 3 for styling
- Framer Motion 11 for UI animation
- Chart.js 4 + react-chartjs-2 for analytics visuals
- React Router v6 for client-side routing
- pdfjs-dist for client-side PDF resume parsing
- Vitest 2 for unit and integration testing

## Project Structure
- src/components/layout: app shell, navbar, footer
- src/components/pages: route-level pages
- src/components/ui: reusable UI primitives and feature widgets
- src/hooks: custom hooks for state and side effects
- src/data: static content and pricing data
- src/types: shared TypeScript interfaces and types

## Coding Conventions
- Prefer functional components with hooks
- Use Tailwind utility classes for styling
- Follow dark theme styling with slate-950 navy and emerald-500 accents
- Use Conventional Commits: feat:, fix:, docs:, chore:

## Architecture Notes
- This project has no backend; matching, scoring, and PDF parsing run entirely client-side
- Weighted scoring formula: skills 70%, experience 20%, education 10%
- The match engine is designed around local state and browser-side processing

## Roadmap
- Phase 5 (Django REST backend) is planned next
