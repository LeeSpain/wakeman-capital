import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../integrations/supabase/client'

export interface TrendRow {
  id: string
  symbol: string
  timeframe: string
  trend_direction: string
  trend_strength: number
  confluence_score: number | null
  key_levels?: any[] | null
  higher_tf_alignment?: boolean | null
  analysis_timestamp: string
  created_at: string
  updated_at: string
}

export function useTrends() {
  const [data, setData] = useState<TrendRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('trend_analysis')
      .select('*')
      .order('analysis_timestamp', { ascending: false })
      .limit(300)

    if (error) {
      setError(error.message)
      setData([])
    } else {
      setError(null)
      setData((data as unknown as TrendRow[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('public:trend_analysis')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trend_analysis' }, () => fetchData())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  const timeframes = useMemo(() => Array.from(new Set(data.map(d => d.timeframe))).sort(), [data])

  return { data, loading, error, refresh: fetchData, timeframes }
}
