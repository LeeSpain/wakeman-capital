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

// Demo trades removed - system now requires authentication for all trade data

export function useUserTrades(userId: string | null) {
  const [trades, setTrades] = useState<TradeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrades = useCallback(async () => {
    if (!userId) {
      setTrades([])
      setLoading(false)
      setError('Please sign in to view your trades')
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
      console.error('Error fetching trades:', error)
      setError(error.message)
      setTrades([])
    } else {
      console.log(`Fetched ${data?.length || 0} trades for user`)
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

  return { trades, loading, error, addTrade, deleteTrade, updateTrade, isDemo: !userId }
}
