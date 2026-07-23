import { useState, type FormEvent } from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import Button from '../ui/Button'

interface SettingsState {
  companyName: string
  enableRemoteFirst: boolean
  skillWeight: number
  experienceWeight: number
  educationWeight: number
}

const DEFAULT_SETTINGS: SettingsState = {
  companyName: 'SmartHire Team',
  enableRemoteFirst: true,
  skillWeight: 70,
  experienceWeight: 20,
  educationWeight: 10,
}

interface Props {
  settings: SettingsState
  setSettings: (settings: SettingsState) => void
  addToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}

export default function SettingsPage({ settings, setSettings, addToast }: Props) {
  const [form, setForm] = useState<SettingsState>(settings)

  const updateField = (field: keyof SettingsState, value: string | boolean | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const weightSum = form.skillWeight + form.experienceWeight + form.educationWeight
    if (weightSum !== 100) {
      addToast('Weights must sum to 100%', 'error')
      return
    }
    setSettings(form)
    addToast('Settings saved successfully!', 'success')
  }

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS)
    setSettings(DEFAULT_SETTINGS)
    addToast('Settings reset to defaults', 'info')
  }

  return (
    <div className="container-app py-8 space-y-6 max-w-3xl">
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="section-title">Settings</h1>
            <p className="section-subtitle">Customize match scoring and app preferences.</p>
          </div>
          <Button variant="secondary" onClick={handleReset}>
            Reset defaults
          </Button>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-slate-400">These preferences are saved locally in your browser and will persist across reloads.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label" htmlFor="companyName">Team / Company Name</label>
              <input
                id="companyName"
                className="input"
                value={form.companyName}
                onChange={e => updateField('companyName', e.target.value)}
                placeholder="SmartHire Team"
              />
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Remote-first results</p>
                  <p className="text-xs text-slate-500">Show remote roles higher in ranked matches.</p>
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.enableRemoteFirst}
                    onChange={e => updateField('enableRemoteFirst', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  Enabled
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label" htmlFor="skillWeight">Skills weight</label>
                <input
                  id="skillWeight"
                  type="number"
                  min={0}
                  max={100}
                  className="input"
                  value={form.skillWeight}
                  onChange={e => updateField('skillWeight', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label" htmlFor="experienceWeight">Experience weight</label>
                <input
                  id="experienceWeight"
                  type="number"
                  min={0}
                  max={100}
                  className="input"
                  value={form.experienceWeight}
                  onChange={e => updateField('experienceWeight', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label" htmlFor="educationWeight">Education weight</label>
                <input
                  id="educationWeight"
                  type="number"
                  min={0}
                  max={100}
                  className="input"
                  value={form.educationWeight}
                  onChange={e => updateField('educationWeight', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Current weight total: <span className="text-white font-semibold">{form.skillWeight + form.experienceWeight + form.educationWeight}%</span></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button type="submit" variant="primary">Save settings</Button>
            <Button type="button" variant="ghost" onClick={() => setForm(settings)}>Cancel</Button>
          </div>
        </form>
      </AnimatedSection>
    </div>
  )
}
