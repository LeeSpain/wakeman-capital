// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DEFAULT_SYS = `You are an AI Trading Coach specialized in Smart Money Concepts (SMC) for Wakeman Capital.
- Be concise and actionable.
- Prefer London session focus, risk:reward ≥ 2:1, disciplined risk management.
- When asked for entries, include invalidation (stop) and target rationale.
- You have tools to access platform data (signals, trends, market data) and to summarize provided sources.
- If a question requires fresh market context or internal data, call the relevant tool before answering.`

// Supabase client (server-side key preferred, fallback to anon)
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
const supabase = createClient(
  SUPABASE_URL!,
  (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY)!
)

// Utilities
const tvInterval = (tf: string | undefined) => {
  const map: Record<string, string> = { '1m': '1', '3m': '3', '5m': '5', '15m': '15', '30m': '30', '45m': '45', '1h': '60', '2h': '120', '3h': '180', '4h': '240', '1D': 'D', 'd': 'D', 'D': 'D', 'daily': 'D', '1W': 'W', 'weekly': 'W' }
  if (!tf) return '240'
  const key = tf.toLowerCase()
  return map[tf] || map[key] || '240'
}

const generateChartUrl = (symbol: string, timeframe?: string) => {
  const interval = tvInterval(timeframe)
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}`
}

async function getSignals(args: any) {
  const {
    symbol,
    timeframe,
    min_confidence = 80,
    status = 'active',
    limit = 5
  } = args || {}

  let q = supabase
    .from('signals_detailed')
    .select('id,symbol,timeframe,direction,signal_type,confidence_score,entry_price,stop_loss,take_profit_1,take_profit_2,take_profit_3,tradingview_symbol,created_at,status,trade_rationale')
    .order('confidence_score', { ascending: false })
    .limit(Math.min(Number(limit) || 5, 20))

  if (symbol) q = q.eq('symbol', symbol)
  if (timeframe) q = q.eq('timeframe', timeframe)
  if (status) q = q.eq('status', status)
  if (min_confidence) q = q.gte('confidence_score', Number(min_confidence))

  const { data, error } = await q
  if (error) return { error: error.message }
  return { rows: data }
}

async function getTrends(args: any) {
  const { symbol, timeframe, limit = 20 } = args || {}
  let q = supabase
    .from('trend_analysis')
    .select('id,symbol,timeframe,trend_direction,trend_strength,confluence_score,higher_tf_alignment,analysis_timestamp')
    .order('analysis_timestamp', { ascending: false })
    .limit(Math.min(Number(limit) || 20, 100))

  if (symbol) q = q.eq('symbol', symbol)
  if (timeframe) q = q.eq('timeframe', timeframe)

  const { data, error } = await q
  if (error) return { error: error.message }
  return { rows: data }
}

async function getMarketData(args: any) {
  const { symbol, timeframe = '4h', limit = 50 } = args || {}
  if (!symbol) return { error: 'symbol is required' }
  const { data, error } = await supabase
    .from('market_data_realtime')
    .select('timestamp,open,high,low,close,volume,symbol,timeframe')
    .eq('symbol', symbol)
    .eq('timeframe', timeframe)
    .order('timestamp', { ascending: false })
    .limit(Math.min(Number(limit) || 50, 200))
  if (error) return { error: error.message }
  return { rows: data }
}

async function fetchWithTimeout(url: string, ms = 8000) {
  const c = new AbortController()
  const t = setTimeout(() => c.abort(), ms)
  try {
    const res = await fetch(url, { signal: c.signal })
    const text = await res.text()
    return { ok: res.ok, status: res.status, text }
  } catch (e) {
    return { ok: false, status: 0, text: String(e) }
  } finally {
    clearTimeout(t)
  }
}

function htmlToPlain(text: string, max = 2000) {
  const stripped = text.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return stripped.slice(0, max)
}

async function searchSources(args: any) {
  const { sources = [], max = 3 } = args || {}
  const items: any[] = []
  for (const s of sources.slice(0, max)) {
    try {
      const isUrl = (() => { try { new URL(s); return true } catch { return false } })()
      if (!isUrl) {
        items.push({ source: s, note: 'keyword provided; no fetch performed' })
        continue
      }
      const res = await fetchWithTimeout(s)
      if (!res.ok) {
        items.push({ source: s, error: `fetch failed (${res.status})` })
        continue
      }
      const plain = htmlToPlain(res.text, 1800)
      items.push({ source: s, excerpt: plain })
    } catch (e) {
      items.push({ source: s, error: String(e) })
    }
  }
  return { items }
}

async function handleToolCall(name: string, args: any) {
  switch (name) {
    case 'get_signals':
      return await getSignals(args)
    case 'get_trends':
      return await getTrends(args)
    case 'get_market_data':
      return await getMarketData(args)
    case 'generate_chart_link':
      if (!args?.symbol) return { error: 'symbol is required' }
      return { url: generateChartUrl(args.symbol, args.timeframe) }
    case 'search_sources':
      return await searchSources(args)
    default:
      return { error: `unknown tool ${name}` }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

    const body = await req.json().catch(() => ({}))
    const { messages = [], settings = {}, sources = [] } = body || {}

    const provider = settings.provider || 'OpenAI'
    if (provider !== 'OpenAI') {
      // For now, only OpenAI is supported in this function
      console.log('Unsupported provider requested, falling back to OpenAI:', provider)
    }

    const selectedModel = settings.model || body.model || 'gpt-4o-mini'
    const temperature = typeof settings.temperature === 'number' ? settings.temperature : 0.3

    const systemPrompt = [DEFAULT_SYS, settings.systemPrompt?.trim() ? `\nUser system overrides:\n${settings.systemPrompt.trim()}` : '' ].join('')

    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_signals',
          description: 'Fetch top trading signals with optional filters',
          parameters: {
            type: 'object',
            properties: {
              symbol: { type: 'string' },
              timeframe: { type: 'string' },
              min_confidence: { type: 'number' },
              limit: { type: 'number' },
              status: { type: 'string', enum: ['active','closed','invalidated'] }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_trends',
          description: 'Fetch recent trend analysis rows',
          parameters: {
            type: 'object',
            properties: {
              symbol: { type: 'string' },
              timeframe: { type: 'string' },
              limit: { type: 'number' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_market_data',
          description: 'Fetch recent OHLCV market data for a symbol',
          parameters: {
            type: 'object',
            properties: {
              symbol: { type: 'string' },
              timeframe: { type: 'string' },
              limit: { type: 'number' }
            },
            required: ['symbol']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'generate_chart_link',
          description: 'Generate a TradingView chart URL for a symbol and timeframe',
          parameters: {
            type: 'object',
            properties: {
              symbol: { type: 'string' },
              timeframe: { type: 'string' }
            },
            required: ['symbol']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'search_sources',
          description: 'Fetch and summarize the given source URLs or keywords (best-effort, short excerpts)',
          parameters: {
            type: 'object',
            properties: {
              sources: { type: 'array', items: { type: 'string' } },
              max: { type: 'number' }
            }
          }
        }
      }
    ]

    // Build message history for the model
    const history = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    let loopMessages = [...history]
    const usedTools = new Set<string>()
    const usedSources: string[] = []

    for (let i = 0; i < 3; i++) {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          temperature,
          messages: loopMessages,
          tools,
          tool_choice: 'auto'
        })
      })

      if (!resp.ok) {
        const errText = await resp.text()
        throw new Error(`OpenAI error: ${errText}`)
      }

      const data = await resp.json()
      const msg = data.choices?.[0]?.message
      const toolCalls = msg?.tool_calls || []

      if (toolCalls.length === 0) {
        const reply = msg?.content ?? 'Sorry, I could not generate a response.'
        return new Response(JSON.stringify({ reply, used_tools: Array.from(usedTools), used_sources: usedSources }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      // Append assistant w/ tool calls
      loopMessages.push({ role: 'assistant', content: msg?.content || '', tool_calls: toolCalls })

      // Execute tools, append results
      for (const tc of toolCalls) {
        try {
          const name = tc.function?.name
          const argsRaw = tc.function?.arguments || '{}'
          let args: any
          try { args = JSON.parse(argsRaw) } catch { args = {} }

          // Attach user-provided sources by default if not passed
          if (name === 'search_sources' && (!args?.sources || args.sources.length === 0)) {
            args.sources = Array.isArray(sources) ? sources : []
          }

          const result = await handleToolCall(name, args)
          if (name) usedTools.add(name)
          if (name === 'search_sources' && result?.items) {
            for (const it of result.items) {
              if (it?.source && !usedSources.includes(it.source)) usedSources.push(it.source)
            }
          }
          loopMessages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) })
        } catch (e) {
          loopMessages.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify({ error: String(e) }) })
        }
      }
    }

    // If we reach here, too many tool hops
    return new Response(JSON.stringify({ reply: 'I gathered context but reached tool limit. Please ask again with a narrower focus.', used_tools: Array.from(usedTools), used_sources: usedSources }), {
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
