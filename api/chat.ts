import { convertToModelMessages, streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 30

type BodyObject = { messages?: Array<{ role: string; content: string }> }

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
  const messages = body.messages ?? []

  const systemPrompt = `You are a friendly HR qualification assistant. Ask the candidate about their skills, experience, role interests and availability in a warm, conversational manner. Clarify ambiguous answers and ask follow-up questions as needed.`

  if (!process.env.ANTHROPIC_API_KEY) {
    return sendText(res, 500, 'Server is missing ANTHROPIC_API_KEY. Add it in the Vercel project environment variables and redeploy.')
  }

  try {
    console.log('[chat] Calling Claude with', messages.length, 'messages')
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: anthropic('claude-sonnet-4-5'),
      system: systemPrompt,
      messages: modelMessages,
      onError({ error }) {
        console.error('[chat] model error:', error)
      },
    })

    const text = await result.text

    if (!text.trim()) {
      return sendText(res, 500, 'The assistant returned no text. Check the Vercel function logs.')
    }

    return sendText(res, 200, text)
  } catch (err) {
    console.error('[chat] setup error:', err)
    const errorMessage = err instanceof Error && err.message.trim()
      ? err.message
      : 'The assistant is temporarily unavailable. Check the Vercel logs for the chat function error.'

    return sendText(res, 500, errorMessage)
  }
}