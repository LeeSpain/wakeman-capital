import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

    const { messages, model } = await req.json()
    const selectedModel = model || 'gpt-4o-mini'

    const sysPrompt = 'You are an AI Trading Coach specialized in Smart Money Concepts (SMC). Provide concise, actionable advice. Prefer London session focus, R: R ≥ 2:1, and emphasize risk management. If asked for entries, include invalidation and target rationale briefly.'

    const body = {
      model: selectedModel,
      messages: [
        { role: 'system', content: sysPrompt },
        ...(Array.isArray(messages) ? messages : []),
      ]
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`OpenAI error: ${errText}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.'

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e) {
    console.error('ai-coach-chat error', e)
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
