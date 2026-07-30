import { streamText } from 'ai'
import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

function demoStream(content: string) {
  const encoder = new TextEncoder()
  const chunks = []
  // split into word chunks to simulate streaming
  const words = content.split(' ')
  let i = 0

  return new ReadableStream({
    async pull(controller) {
      if (i >= words.length) {
        controller.close()
        return
      }
      // send 4 words at a time
      const slice = words.slice(i, i + 4).join(' ') + (i + 4 < words.length ? ' ' : '')
      controller.enqueue(encoder.encode(slice))
      i += 4
      // small delay between chunks
      await new Promise(r => setTimeout(r, 200))
    }
  })
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  const body = await req.json().catch(() => ({}))
  const messages = body.messages ?? []

  const systemPrompt = `You are a friendly HR qualification assistant. Ask the candidate about their skills, experience, role interests and availability in a warm, conversational manner. Clarify ambiguous answers and ask follow-up questions as needed.`

  // If no API key is configured, return a demo streamed response so the UI works publicly
  if (!process.env.ANTHROPIC_API_KEY) {
    const demoResponse = `Hi there! I'm the SmartHire qualification assistant. Could you tell me about your top skills and which role you're interested in?` +
      `\n\nAlso, how many years of experience do you have and what kind of work environment do you prefer?`
    const stream = demoStream(demoResponse)
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  try {
    const provider = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    return await streamText({
      model: 'claude-sonnet-4-5',
      provider,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    })
  } catch (err) {
    // On error, fall back to a short demo stream so the UI still responds
    const fallback = `Sorry, the assistant is temporarily unavailable. Meanwhile — tell me about your main skills and what role you want.`
    const stream = demoStream(fallback)
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}
