import { createTextStreamResponse, streamText, toTextStream } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 30

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  const body = await req.json().catch(() => ({}))
  const messages = body.messages ?? []

  const systemPrompt = `You are a friendly HR qualification assistant. Ask the candidate about their skills, experience, role interests and availability in a warm, conversational manner. Clarify ambiguous answers and ask follow-up questions as needed.`

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      'Server is missing ANTHROPIC_API_KEY. Add it in the Vercel project environment variables and redeploy.',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } }
    )
  }

  try {
    console.log('[chat] Calling Claude with', messages.length, 'messages')
    const result = streamText({
      model: anthropic('claude-sonnet-4-5'),
      system: systemPrompt,
      messages,
    })

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[chat] setup error:', err)
    return new Response(
      'The assistant is temporarily unavailable. Check the Vercel logs for the chat function error.',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } }
    )
  }
}