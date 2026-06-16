import { Github, ExternalLink, Zap } from 'lucide-react'
import { siteConfig } from '../../data/content'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="container-app py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
            <Zap className="w-3 h-3 text-emerald-400" />
          </span>
          <span className="font-display font-semibold text-slate-400">{siteConfig.name}</span>
          <span>·</span>
          <span>Built by {siteConfig.author}</span>
          <span>·</span>
          <span>{siteConfig.university}</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href={siteConfig.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
          <span className="text-xs text-slate-600">
            © {new Date().getFullYear()}
          </span>
        </div>

      </div>
    </footer>
  )
}