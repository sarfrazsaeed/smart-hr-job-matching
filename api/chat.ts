import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const config = { runtime: 'edge' }

function demoStream(content: string) {
  const encoder = new TextEncoder()
  const words = content.split(' ')
  let i = 0

  return new ReadableStream({
    async pull(controller) {
      if (i >= words.length) {
        controller.close()
        return
      }
      const slice = words.slice(i, i + 4).join(' ') + (i + 4 < words.length ? ' ' : '')
      controller.enqueue(encoder.encode(slice))
      i += 4
      await new Promise(r => setTimeout(r, 200))
    }
  })
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  const body = await req.json().catch(() => ({}))
  const messages = body.messages ?? []

  const systemPrompt = `You are a friendly HR qualification assistant. Ask the candidate about their skills, experience, role interests and availability in a warm, conversational manner. Clarify ambiguous answers and ask follow-up questions as needed.`

  if (!process.env.ANTHROPIC_API_KEY) {
    const demoResponse = `Hi there! I'm the SmartHire qualification assistant. Could you tell me about your top skills and which role you're interested in?` +
      `\n\nAlso, how many years of experience do you have and what kind of work environment do you prefer?`
    const stream = demoStream(demoResponse)
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  try {
    const result = streamText({
      model: anthropic('claude-sonnet-4-5'),
      system: systemPrompt,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    const fallback = `Sorry, the assistant is temporarily unavailable. Meanwhile — tell me about your main skills and what role you want.`
    const stream = demoStream(fallback)
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}