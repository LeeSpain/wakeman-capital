import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../integrations/supabase/client'
import { useRealMarketData } from './useRealMarketData'

export interface SignalRecord {
  id: string
  symbol: string
  timeframe: string
  direction: 'LONG' | 'SHORT' | 'buy' | 'sell' | string
  entry_price: number
  stop_loss: number
  take_profit_1?: number | null
  take_profit_2?: number | null
  take_profit_3?: number | null
  risk_reward_ratio?: number | null
  confidence_score: number
  backtested_win_rate?: number | null
  backtested_avg_rr?: number | null
  status: string
  signal_type?: string
  tradingview_symbol?: string
  trade_rationale?: string
  chart_template?: string
  higher_tf_bias?: string
  confluence_factors?: string[]
  supply_zones?: any[]
  demand_zones?: any[]
  order_blocks?: any[]
  imbalances_data?: any[]
  choch_levels?: any[]
  higher_tf_context?: any
  created_at?: string
}

// Demo signals removed - system now relies entirely on live data

export function useTopOpportunities() {
  const [data, setData] = useState<SignalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { refreshMarketData } = useRealMarketData()

  const fetchData = async () => {
    setLoading(true)
    
    try {
      // Refresh market data first to ensure we have latest signals
      await refreshMarketData()
      
      const { data, error } = await supabase
        .from('signals_detailed')
        .select('*')
        .eq('status', 'active')
        .gte('confidence_score', 88)
        .order('confidence_score', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching signals:', error)
        setError(error.message)
        setData([])
      } else {
        console.log(`Found ${data?.length || 0} real market signals`)
        setError(null)
        setData((data as unknown as SignalRecord[]) ?? [])
      }
    } catch (err: any) {
      console.error('Error fetching real signals:', err)
      setError(err.message)
      setData([])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('public:signals_detailed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signals_detailed' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const finalData = useMemo(() => {
    return data
  }, [data])

  return { data: finalData, loading, error }
}

export function useAllSignals() {
  const [data, setData] = useState<SignalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('signals_detailed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      console.error('Error fetching all signals:', error)
      setError(error.message)
      setData([])
    } else {
      console.log(`Fetched ${data?.length || 0} total signals`)
      setError(null)
      setData((data as unknown as SignalRecord[]) ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('public:signals_detailed_all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signals_detailed' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { data, loading, error }
}
