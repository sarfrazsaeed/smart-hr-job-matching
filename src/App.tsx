import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useLocalStorage, useToast } from './hooks'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './components/pages/LandingPage'
import PricingPage from './components/pages/PricingPage'
import NotFoundPage from './components/pages/NotFoundPage'
import ToastContainer from './components/ui/ToastContainer'
import type { Candidate, Job, AppSettings } from './types'

export default function App() {
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>('sh_candidates', [])
  const [jobs, setJobs]             = useLocalStorage<Job[]>('sh_jobs', [])
  const [settings, setSettings]     = useLocalStorage<AppSettings>('sh_settings', {
    companyName: 'SmartHire Team',
    enableRemoteFirst: true,
    skillWeight: 70,
    experienceWeight: 20,
    educationWeight: 10,
  })
  const { toasts, addToast, removeToast } = useToast()

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/app/*"   element={
          <AppLayout
            candidates={candidates} setCandidates={setCandidates}
            jobs={jobs} setJobs={setJobs}
            settings={settings} setSettings={setSettings}
            addToast={addToast}
          />
        } />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </BrowserRouter>
  )
}
