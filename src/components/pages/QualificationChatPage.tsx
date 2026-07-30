import React, { useEffect, useRef, useState } from 'react'

type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string }

export default function QualificationChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [partial, setPartial] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)

  useEffect(() => {
    if (!listRef.current || isUserScrolling) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, partial, isUserScrolling])

  const sendMessage = async (text: string) => {
    const userMsg: Message = { id: String(Date.now()), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setError(null)

    setIsStreaming(true)
    setPartial('')
    abortRef.current = new AbortController()

    const timeoutId = setTimeout(() => {
      console.error('[chat] request timed out after 20s')
      abortRef.current?.abort()
    }, 20000)

    try {
      console.log('[chat] sending request to /api/chat')
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: text }],
        }),
        signal: abortRef.current.signal,
      })

      console.log('[chat] response status:', res.status)

      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let assistantText = ''

      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          assistantText += chunk
          setPartial(assistantText)
        }
      }

      console.log('[chat] stream finished, length:', assistantText.length)

      const assistantMsg: Message = { id: String(Date.now() + 1), role: 'assistant', content: assistantText || '(empty response)' }
      setMessages(prev => [...prev, assistantMsg])
      setPartial('')
    } catch (err) {
      console.error('[chat] error:', err)
      if ((err as any).name === 'AbortError') {
        if (partial) {
          const assistantMsg: Message = { id: String(Date.now() + 1), role: 'assistant', content: partial }
          setMessages(prev => [...prev, assistantMsg])
          setPartial('')
        } else {
          setError('The request took too long or was stopped. Please try again.')
        }
      } else {
        setError('Something went wrong talking to the assistant. Please try again.')
      }
    } finally {
      clearTimeout(timeoutId)
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
  }

  const handleStop = () => {
    if (abortRef.current) abortRef.current.abort()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <h2 className="text-white text-xl font-semibold mb-4">Qualification Chat</h2>

      <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div
          ref={listRef}
          onScroll={() => {
            if (!listRef.current) return
            const { scrollTop, scrollHeight, clientHeight } = listRef.current
            const atBottom = scrollTop + clientHeight >= scrollHeight - 20
            setIsUserScrolling(!atBottom)
          }}
          className="p-4 md:p-6 h-[50vh] md:h-[60vh] overflow-auto space-y-3"
        >
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] break-words px-4 py-2 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-emerald-500/10 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                <div className="text-sm leading-6 whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {partial && (
            <div className="flex justify-start">
              <div className="max-w-[85%] break-words px-4 py-2 rounded-2xl shadow-sm bg-slate-800 text-slate-200 rounded-bl-none">
                <div className="text-sm leading-6 whitespace-pre-wrap">{partial}</div>
              </div>
            </div>
          )}

          {isStreaming && !partial && (
            <div className="text-slate-400 mt-2">Thinking…</div>
          )}

          {error && (
            <div className="text-red-400 text-sm mt-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-3 md:p-4 bg-slate-900 border-t border-slate-800 flex gap-2 items-center">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a candidate a question…"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-white placeholder:text-slate-400"
            disabled={isStreaming}
          />
          <button type="submit" disabled={isStreaming} className="px-4 py-2 bg-emerald-500 text-white rounded-full disabled:opacity-50 text-sm">
            Send
          </button>
          <button type="button" onClick={handleStop} disabled={!isStreaming} className="px-3 py-2 bg-slate-700 text-white rounded-full disabled:opacity-50 text-sm">
            Stop
          </button>
        </form>
      </div>
    </div>
  )
}