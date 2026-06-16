import { useState, type KeyboardEvent } from 'react'
import SkillTag from './SkillTag'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function SkillInput({ value, onChange, placeholder = 'Type a skill and press Enter' }: Props) {
  const [input, setInput] = useState('')

  const skills = value ? value.split(',').map(s => s.trim()).filter(Boolean) : []

  const addSkill = (raw: string) => {
    const skill = raw.trim().toLowerCase()
    if (!skill || skills.includes(skill)) return
    onChange([...skills, skill].join(', '))
    setInput('')
  }

  const removeSkill = (skill: string) => {
    onChange(skills.filter(s => s !== skill).join(', '))
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(input)
    } else if (e.key === 'Backspace' && !input && skills.length) {
      removeSkill(skills[skills.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input && addSkill(input)}
        placeholder={skills.length ? 'Add another skill...' : placeholder}
        className="input"
      />
      {skills.length > 0 && (
        <SkillTag skills={skills} onRemove={removeSkill} />
      )}
    </div>
  )
}