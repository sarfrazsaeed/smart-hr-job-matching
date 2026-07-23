import { useState, type FormEvent } from 'react'
import { UserCircle2, Mail, Phone } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useToast } from '../../hooks/useToast'

interface FormState {
  fullName: string
  email: string
  phone: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
}

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
}

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const { addToast } = useToast()

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    } else if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name must be at least 2 characters.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (form.phone.trim()) {
      const phonePattern = /^(\+\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)?\d{3}[-\s]?\d{4}$/
      if (!phonePattern.test(form.phone.trim())) {
        nextErrors.phone = 'Please enter a valid phone number.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    addToast('Profile saved successfully!', 'success')
  }

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="container-app py-8 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="section-title">Settings</h1>
          <p className="section-subtitle">Keep your profile details current for better candidate outreach.</p>
        </div>

        <Card animate>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                <UserCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Personal information</h2>
                <p className="text-sm text-slate-400">We use this to personalize your SmartHire workspace.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  className={`input ${errors.fullName ? 'border-rose-500' : ''}`}
                  placeholder="Aisha Khan"
                  value={form.fullName}
                  onChange={e => handleFieldChange('fullName', e.target.value)}
                />
                {errors.fullName && <p className="mt-2 text-sm text-rose-400">{errors.fullName}</p>}
              </div>

              <div>
                <label className="label" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`input pl-10 ${errors.email ? 'border-rose-500' : ''}`}
                    placeholder="aisha@example.com"
                    value={form.email}
                    onChange={e => handleFieldChange('email', e.target.value)}
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email}</p>}
              </div>

              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="phone"
                    name="phone"
                    className={`input pl-10 ${errors.phone ? 'border-rose-500' : ''}`}
                    placeholder="+92 300 1234567"
                    value={form.phone}
                    onChange={e => handleFieldChange('phone', e.target.value)}
                  />
                </div>
                {errors.phone && <p className="mt-2 text-sm text-rose-400">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => {
                setForm(initialForm)
                setErrors({})
              }}>
                Reset
              </Button>
              <Button type="submit" variant="primary">Save Profile</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
