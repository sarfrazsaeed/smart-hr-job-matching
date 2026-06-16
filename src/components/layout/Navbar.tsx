import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, Users, Briefcase, Target, BarChart2, Info } from 'lucide-react'
import { useScrolled } from '../../hooks'
import { navItems, siteConfig } from '../../data/content'
import type { Page } from '../../types'

const iconMap = {
  users: Users, briefcase: Briefcase, target: Target,
  'bar-chart-2': BarChart2, info: Info,
}

interface Props {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Navbar({ currentPage, onNavigate }: Props) {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()

  const handleNav = (page: Page) => {
    onNavigate(page)
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-app flex items-center justify-between h-16 sm:h-20">

        {/* Logo */}
        <button
          onClick={() => handleNav('candidates')}
          className="flex items-center gap-2.5 font-display font-bold text-lg text-white"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </span>
          {siteConfig.name}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]
            const active = currentPage === item.page
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setOpen(prev => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="container-app py-3 flex flex-col gap-1">
              {navItems.map(item => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                const active = currentPage === item.page
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNav(item.page)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                      active
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}