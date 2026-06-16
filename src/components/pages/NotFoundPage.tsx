import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* 404 number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <span className="text-[10rem] sm:text-[14rem] font-black font-display leading-none select-none"
          style={{ WebkitTextStroke: '2px rgba(16,185,129,0.2)', color: 'transparent' }}>
          404
        </span>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]"
        >
          <Zap className="w-10 h-10 text-white" fill="currentColor" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3">
          Page not found
        </h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm sm:text-base">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" /> Go Home
          </motion.button>
          <motion.button
            onClick={() => navigate('/app/candidates')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Open App
          </motion.button>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            { label: 'Candidates', path: '/app/candidates' },
            { label: 'HR Portal',  path: '/app/hr' },
            { label: 'Match',      path: '/app/match' },
            { label: 'Dashboard',  path: '/app/dashboard' },
          ].map(link => (
            <button key={link.path} onClick={() => navigate(link.path)}
              className="text-sm text-slate-500 hover:text-emerald-400 transition-colors underline underline-offset-4">
              {link.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}