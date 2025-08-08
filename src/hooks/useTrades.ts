import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../integrations/supabase/client'

export type TradeStatus = 'open' | 'closed'
export type TradeDirection = 'LONG' | 'SHORT'

export interface TradeRow {
  id: string
  user_id: string
  symbol: string
  direction: TradeDirection
  entry_price: number
  stop_price?: number | null
  take_profit?: number | null
  rr_target?: number | null
  timeframe?: string | null
  risk_percent?: number | null
  notes?: string | null
  status: TradeStatus
  entry_time: string
  exit_time?: string | null
  created_at: string
  updated_at: string
  pl?: number | null
}

export interface NewTradeInput {
  symbol: string
  direction: TradeDirection
  entry_price: number
  stop_price?: number
  take_profit?: number
  rr_target?: number
  timeframe?: string
  risk_percent?: number
  notes?: string
}

const demoTrades: TradeRow[] = [
  {
    id: 'demo-t1', user_id: 'demo', symbol: 'EURUSD', direction: 'LONG', entry_price: 1.0932,
    stop_price: 1.0912, take_profit: 1.0985, rr_target: 2.65, timeframe: 'M15', risk_percent: 1,
    notes: 'CHoCH + OB confluence', status: 'closed', entry_time: new Date().toISOString(),
    exit_time: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), pl: 1.2
  },
  {
    id: 'demo-t2', user_id: 'demo', symbol: 'GBPJPY', direction: 'SHORT', entry_price: 185.61,
    stop_price: 186.00, take_profit: 184.70, rr_target: 2.15, timeframe: 'H1', risk_percent: 1,
    notes: 'Liquidity sweep into OB', status: 'open', entry_time: new Date().toISOString(),
    exit_time: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), pl: 0
  }
]

export function useUserTrades(userId: string | null) {
  const [trades, setTrades] = useState<TradeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrades = useCallback(async () => {
    if (!userId) {
      setTrades(demoTrades)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      setError(error.message)
      setTrades([])
    } else {
      setError(null)
      setTrades((data as unknown as TradeRow[]) ?? [])
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchTrades()

    if (!userId) return

    const channel = supabase
      .channel('public:trades')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trades', filter: `user_id=eq.${userId}` }, () => {
        fetchTrades()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchTrades])

  const addTrade = useCallback(async (input: NewTradeInput) => {
    if (!userId) throw new Error('Not authenticated')
    const insert = { ...input, user_id: userId }
    const { data, error } = await supabase.from('trades').insert(insert).select('*').maybeSingle()
    if (error) throw error
    return data as unknown as TradeRow
  }, [userId])

  const deleteTrade = useCallback(async (id: string) => {
    if (!userId) throw new Error('Not authenticated')
    const { error } = await supabase.from('trades').delete().eq('id', id).eq('user_id', userId)
    if (error) throw error
  }, [userId])

  const updateTrade = useCallback(async (id: string, patch: Partial<NewTradeInput>) => {
    if (!userId) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('trades').update(patch).eq('id', id).eq('user_id', userId).select('*').maybeSingle()
    if (error) throw error
    return data as unknown as TradeRow
  }, [userId])

  const data = useMemo(() => {
    if (!userId) return demoTrades
    return trades
  }, [trades, userId])

  return { trades: data, loading, error, addTrade, deleteTrade, updateTrade, isDemo: !userId }
}
