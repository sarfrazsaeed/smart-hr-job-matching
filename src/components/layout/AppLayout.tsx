// removed unused import
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import CandidatePage from '../pages/CandidatePage'
import HRPage from '../pages/HRPage'
import MatchPage from '../pages/MatchPage'
import DashboardPage from '../pages/DashboardPage'
import AboutPage from '../pages/AboutPage'
import type { Candidate, Job, Page } from '../../types'

interface Props {
  candidates: Candidate[]
  setCandidates: (c: Candidate[]) => void
  jobs: Job[]
  setJobs: (j: Job[]) => void
  addToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

const routeToPage: Record<string, Page> = {
  '/app/candidates': 'candidates',
  '/app/hr':         'hr',
  '/app/match':      'match',
  '/app/dashboard':  'dashboard',
  '/app/about':      'about',
}

export default function AppLayout({ candidates, setCandidates, jobs, setJobs, addToast }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPage = routeToPage[location.pathname] ?? 'candidates'

  const handleNavigate = (page: Page) => {
    navigate(`/app/${page}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 pt-20 pb-12">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Routes>
              <Route index element={<Navigate to="candidates" replace />} />
              <Route path="candidates" element={<CandidatePage candidates={candidates} setCandidates={setCandidates} addToast={addToast} />} />
              <Route path="hr"         element={<HRPage jobs={jobs} setJobs={setJobs} candidates={candidates} addToast={addToast} />} />
              <Route path="match"      element={<MatchPage jobs={jobs} candidates={candidates} addToast={addToast} />} />
              <Route path="dashboard"  element={<DashboardPage candidates={candidates} jobs={jobs} />} />
              <Route path="about"      element={<AboutPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}