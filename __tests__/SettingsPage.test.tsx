import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react'
import { createElement } from 'react'

const addToastMock = vi.fn()

vi.mock('../src/hooks/useToast', () => ({
  useToast: () => ({ addToast: addToastMock }),
}))

import SettingsPage from '../src/components/pages/SettingsPage'

let container: HTMLDivElement
let root: Root

function renderPage() {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root.render(createElement(SettingsPage))
  })
  return container
}

function setInputValue(name: string, value: string) {
  const input = container.querySelector(`input[name="${name}"]`) as HTMLInputElement | null
  if (!input) throw new Error(`Input ${name} not found`)
  act(() => {
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    if (valueSetter) {
      valueSetter.call(input, value)
    } else {
      input.value = value
    }
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: value }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

function submitForm() {
  const form = container.querySelector('form') as HTMLFormElement | null
  if (!form) throw new Error('Form not found')
  act(() => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })
}

describe('SettingsPage', () => {
  beforeEach(() => {
    addToastMock.mockReset()
  })

  afterEach(() => {
    act(() => {
      root?.unmount()
    })
    container?.remove()
  })

  it('submits successfully with valid input', () => {
    renderPage()
    setInputValue('fullName', 'Aisha Khan')
    setInputValue('email', 'aisha@example.com')
    setInputValue('phone', '+92 300 1234567')

    submitForm()

    expect(addToastMock).toHaveBeenCalledWith('Profile saved successfully!', 'success')
  })

  it('shows an error when the name is empty', () => {
    renderPage()
    setInputValue('fullName', 'A')
    setInputValue('email', 'aisha@example.com')

    submitForm()

    expect(container.textContent).toContain('Full name must be at least 2 characters.')
  })

  it('shows an error for an invalid email', () => {
    renderPage()
    setInputValue('fullName', 'Aisha Khan')
    setInputValue('email', 'invalid-email')

    submitForm()

    expect(container.textContent).toContain('Please enter a valid email address.')
  })

  it('shows an error for an invalid phone', () => {
    renderPage()
    setInputValue('fullName', 'Aisha Khan')
    setInputValue('email', 'aisha@example.com')
    setInputValue('phone', 'abc')

    submitForm()

    expect(container.textContent).toContain('Please enter a valid phone number.')
  })
})
