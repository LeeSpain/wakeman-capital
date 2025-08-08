import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface SignalRecord {
  id: string
  symbol: string
  timeframe: string
  direction: 'LONG' | 'SHORT' | string
  entry_price: number
  stop_loss: number
  take_profit_1?: number | null
  risk_reward_ratio?: number | null
  confidence_score: number
  backtested_win_rate?: number | null
  backtested_avg_rr?: number | null
  status: string
}

const demoSignals: SignalRecord[] = [
  {
    id: 'demo-1',
    symbol: 'GBPJPY',
    timeframe: 'H1',
    direction: 'LONG',
    entry_price: 185.94468,
    stop_loss: 185.60223,
    take_profit_1: 186.77498,
    risk_reward_ratio: 2.42,
    confidence_score: 10,
    backtested_win_rate: 60.8,
    backtested_avg_rr: 2.91,
    status: 'active',
  },
  {
    id: 'demo-2', symbol: 'EURUSD', timeframe: 'M15', direction: 'SHORT',
    entry_price: 1.0942, stop_loss: 1.0954, take_profit_1: 1.0910, risk_reward_ratio: 2.6,
    confidence_score: 9.4, backtested_win_rate: 57.3, backtested_avg_rr: 2.5, status: 'active'
  },
  {
    id: 'demo-3', symbol: 'XAUUSD', timeframe: 'H1', direction: 'LONG',
    entry_price: 2388.5, stop_loss: 2382.0, take_profit_1: 2404.0, risk_reward_ratio: 2.4,
    confidence_score: 9.1, backtested_win_rate: 55.2, backtested_avg_rr: 2.2, status: 'active'
  },
  {
    id: 'demo-4', symbol: 'USDJPY', timeframe: 'M30', direction: 'SHORT',
    entry_price: 160.45, stop_loss: 160.75, take_profit_1: 159.55, risk_reward_ratio: 3.0,
    confidence_score: 8.9, backtested_win_rate: 58.4, backtested_avg_rr: 2.8, status: 'active'
  },
  {
    id: 'demo-5', symbol: 'NAS100', timeframe: 'M15', direction: 'LONG',
    entry_price: 19650, stop_loss: 19610, take_profit_1: 19770, risk_reward_ratio: 3.0,
    confidence_score: 8.6, backtested_win_rate: 53.1, backtested_avg_rr: 2.1, status: 'active'
  },
]

export function useTopOpportunities() {
  const [data, setData] = useState<SignalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('signals_detailed')
      .select('*')
      .eq('status', 'active')
      .order('confidence_score', { ascending: false })
      .limit(5)

    if (error) {
      setError(error.message)
      setData(demoSignals)
    } else {
      setError(null)
      setData((data as unknown as SignalRecord[]) ?? [])
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
    if (!loading && (!data || data.length === 0)) return demoSignals
    return data
  }, [data, loading])

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
      setError(error.message)
      setData([])
    } else {
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
