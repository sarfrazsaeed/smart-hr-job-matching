import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

interface ExtractedData {
  skills: string[]
  experience: string
  education: string
  rawText: string
}

interface Props {
  onExtracted: (data: ExtractedData) => void
  onClear: () => void
}

// ── Skill keywords to scan for ────────────────────────────────────────────
const SKILL_KEYWORDS = [
  'javascript','typescript','react','vue','angular','node','nodejs','express',
  'python','django','flask','java','spring','php','laravel','ruby','rails',
  'html','css','sass','scss','tailwind','bootstrap','jquery','next','nuxt',
  'mongodb','postgresql','mysql','sqlite','redis','firebase','supabase',
  'git','github','docker','kubernetes','aws','azure','gcp','linux',
  'figma','photoshop','illustrator','xd','sketch',
  'machine learning','deep learning','tensorflow','pytorch','pandas','numpy',
  'rest','graphql','api','ci/cd','agile','scrum','jira',
  'flutter','react native','swift','kotlin','android','ios',
  'c++','c#','.net','rust','go','golang','scala',
  'webpack','vite','babel','jest','vitest','cypress','selenium',
  'wordpress','shopify','magento','woocommerce',
]

const EDU_KEYWORDS = ['bscs','bba','bse','bs','ms','mba','phd','bachelor','master','bachelors','masters','degree','b.sc','m.sc','b.e','m.e','b.tech','m.tech']

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase()
  return SKILL_KEYWORDS.filter(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.+]/g, '\\$&')}\\b`, 'i')
    return regex.test(lower)
  })
}

function extractExperience(text: string): string {
  // Look for patterns like "3 years", "2+ years", "5 yrs"
  const patterns = [
    /(\d+\.?\d*)\s*\+?\s*years?\s+(?:of\s+)?experience/i,
    /experience\s*[:–-]?\s*(\d+\.?\d*)\s*\+?\s*years?/i,
    /(\d+\.?\d*)\s*yrs?\s+(?:of\s+)?(?:work\s+)?experience/i,
    /(\d+\.?\d*)\s*\+?\s*years?\s+(?:of\s+)?(?:work|professional|industry)/i,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return match[1]
  }
  return ''
}

function extractEducation(text: string): string {
  const lines = text.split('\n')
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (EDU_KEYWORDS.some(k => lower.includes(k))) {
      return line.trim().slice(0, 80)
    }
  }
  return ''
}

export default function ResumeUploader({ onExtracted, onClear }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus]         = useState<'idle' | 'parsing' | 'done' | 'error'>('idle')
  const [fileName, setFileName]     = useState('')
  const [errorMsg, setErrorMsg]     = useState('')
  const [preview, setPreview]       = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const parseFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setStatus('error')
      setErrorMsg('Please upload a PDF file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus('error')
      setErrorMsg('File too large. Max size is 10 MB.')
      return
    }

    setFileName(file.name)
    setStatus('parsing')

    try {
      // Dynamically import pdfjs to keep bundle small
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString()

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .map((item: unknown) => (item as { str: string }).str)
          .join(' ')
        fullText += pageText + '\n'
      }

      const skills    = extractSkills(fullText)
      const experience = extractExperience(fullText)
      const education  = extractEducation(fullText)

      setPreview(fullText.slice(0, 300).trim())
      setStatus('done')

      onExtracted({
        skills,
        experience,
        education,
        rawText: fullText,
      })
    } catch {
      setStatus('error')
      setErrorMsg('Could not parse PDF. Try a text-based PDF (not scanned image).')
    }
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    parseFile(file)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleClear = () => {
    setStatus('idle')
    setFileName('')
    setPreview('')
    setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
    onClear()
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">

        {/* ── Idle / drag zone ── */}
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10'
                : 'border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800/50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFile(e.target.files?.[0])}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Upload className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Drop your resume here, or <span className="text-emerald-400">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">PDF only · Max 10 MB · Skills auto-extracted</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Parsing ── */}
        {status === 'parsing' && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="border border-slate-700 rounded-2xl p-6 flex items-center gap-4 bg-slate-800/50"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Parsing {fileName}...</p>
              <p className="text-xs text-slate-400 mt-0.5">Extracting skills, experience and education</p>
            </div>
          </motion.div>
        )}

        {/* ── Done ── */}
        {status === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="border border-emerald-500/30 rounded-2xl p-4 bg-emerald-500/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate max-w-[200px]">{fileName}</p>
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-xs text-emerald-400 mt-0.5">Resume parsed — fields auto-filled below</p>
                </div>
              </div>
              <button onClick={handleClear} className="text-slate-500 hover:text-rose-400 transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            {preview && (
              <div className="mt-3 bg-slate-900 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Preview (first 300 chars)</p>
                <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-3">{preview}…</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="border border-rose-500/30 rounded-2xl p-4 bg-rose-500/5 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Upload failed</p>
              <p className="text-xs text-rose-400 mt-0.5">{errorMsg}</p>
            </div>
            <button onClick={handleClear} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}