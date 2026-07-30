import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 30

type BodyObject = { messages?: unknown }

type ChatMessage = {
  role?: string
  content?: string
}

type NodeRequestLike = {
  method?: string
  json?: () => Promise<BodyObject>
  on: (event: 'data' | 'end' | 'error', handler: (chunk?: Buffer) => void) => void
}

type NodeResponseLike = {
  status: (code: number) => NodeResponseLike
  setHeader: (name: string, value: string) => NodeResponseLike
  send: (body: string) => void
}

async function readBody(req: NodeRequestLike | Request): Promise<BodyObject> {
  if (typeof req?.json === 'function') {
    return req.json().catch(() => ({}))
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = []

    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}

function normalizeMessages(messages: unknown) {
  if (!Array.isArray(messages)) return []

  return messages
    .map((message) => {
      const item = message as ChatMessage
      const content = typeof item.content === 'string' ? item.content.trim() : ''
      const role = item.role === 'assistant' || item.role === 'system' ? item.role : 'user'

      return content ? { role, content } : null
    })
    .filter((message): message is { role: 'user' | 'assistant' | 'system'; content: string } => message !== null)
}

function buildFallbackReply(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) {
  const latestUserMessage = [...messages].reverse().find(message => message.role === 'user')?.content.toLowerCase() ?? ''

  if (latestUserMessage.includes('frontend')) {
    return 'I can help you prepare for a frontend role. Share your skills in React, TypeScript, CSS, and JavaScript, plus your years of experience, and I will suggest a good job fit.'
  }

  if (latestUserMessage.includes('python')) {
    return 'With Python experience, I can help you find suitable roles. Tell me your years of experience, whether you know Django or Flask, and your preferred job type.'
  }

  return 'I can help you with job selection. Please share your main skills, years of experience, and the type of role you want, and I will guide you further.'
}

function sendText(res: NodeResponseLike | undefined, status: number, text: string) {
  if (res && typeof res.status === 'function') {
    res.status(status).setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    return res.send(text)
  }

  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

export default async function handler(req: NodeRequestLike | Request, res?: NodeResponseLike) {
  if ((req?.method ?? 'POST') !== 'POST') return sendText(res, 405, 'Method Not Allowed')

  const body = await readBody(req)
  const messages = normalizeMessages(body.messages)

  const systemPrompt = `You are a friendly HR qualification assistant. Ask the candidate about their skills, experience, role interests and availability in a warm, conversational manner. Clarify ambiguous answers and ask follow-up questions as needed.`

  if (!process.env.ANTHROPIC_API_KEY) {
    return sendText(res, 500, 'Server is missing ANTHROPIC_API_KEY. Add it in the Vercel project environment variables and redeploy.')
  }

  try {
    console.log('[chat] Calling Claude with', messages.length, 'messages')

    const result = await generateText({
      model: anthropic('claude-sonnet-4-5'),
      instructions: systemPrompt,
      messages,
      onError({ error }) {
        console.error('[chat] model error:', error)
      },
    })

    const text = result.text.trim()

    if (!text.trim()) {
      return sendText(res, 200, buildFallbackReply(messages))
    }

    return sendText(res, 200, text)
  } catch (err) {
    console.error('[chat] setup error:', err)
    const errorMessage = err instanceof Error && err.message.trim()
      ? err.message
      : buildFallbackReply(messages)

    return sendText(res, 200, errorMessage)
  }
}