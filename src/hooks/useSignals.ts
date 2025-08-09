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

const demoSignals: SignalRecord[] = [
  {
    id: 'demo-1',
    symbol: 'EURUSD',
    timeframe: '1H',
    direction: 'buy',
    entry_price: 1.0850,
    stop_loss: 1.0820,
    take_profit_1: 1.0970, // 1:4 RRR
    take_profit_2: 1.1090, // 1:8 RRR
    take_profit_3: 1.1210, // 1:12 RRR
    confidence_score: 92,
    risk_reward_ratio: 4.0,
    signal_type: 'confluence_reversal',
    status: 'active',
    created_at: new Date().toISOString(),
    higher_tf_bias: 'bullish',
    backtested_win_rate: 78,
    backtested_avg_rr: 4.2,
    trade_rationale: 'Weekly demand zone + Daily CHoCH + London session confluence. 3 timeframe alignment with momentum confirmation.',
    confluence_factors: [
      'weekly_demand_zone',
      'daily_choch_confirmation', 
      'london_session_timing',
      'rsi_bullish_divergence',
      'volume_confirmation',
      'fib_618_retracement'
    ],
    supply_zones: [],
    demand_zones: [
      { high: 1.0860, low: 1.0840, type: 'demand', timeframe: 'Weekly', strength: 10 },
      { high: 1.0855, low: 1.0845, type: 'demand', timeframe: 'Daily', strength: 9 }
    ],
    order_blocks: [
      { high: 1.0852, low: 1.0848, type: 'order_block', timeframe: '4H', strength: 8 }
    ],
    imbalances_data: [
      { high: 1.0858, low: 1.0854, type: 'imbalance', timeframe: '15M', strength: 7 }
    ],
    choch_levels: [
      { high: 1.0862, low: 1.0848, type: 'choch', timeframe: 'Daily', strength: 9 }
    ]
  },
  {
    id: 'demo-2',
    symbol: 'GBPJPY',
    timeframe: '1H',
    direction: 'sell',
    entry_price: 184.50,
    stop_loss: 185.30,
    take_profit_1: 181.30, // 1:4 RRR
    take_profit_2: 178.10, // 1:8 RRR
    take_profit_3: 174.90, // 1:12 RRR
    confidence_score: 89,
    risk_reward_ratio: 4.0,
    signal_type: 'multi_tf_breakdown',
    status: 'active',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    higher_tf_bias: 'bearish',
    backtested_win_rate: 74,
    backtested_avg_rr: 4.1,
    trade_rationale: 'Weekly supply rejection + Daily BOS + London session volatility. Clear multi-timeframe bearish structure.',
    confluence_factors: [
      'weekly_supply_rejection',
      'daily_bos_confirmation',
      'london_session_volatility',
      'momentum_divergence',
      'previous_daily_high_resistance',
      'atr_expansion'
    ],
    supply_zones: [
      { high: 185.20, low: 184.80, type: 'supply', timeframe: 'Weekly', strength: 10 },
      { high: 185.00, low: 184.60, type: 'supply', timeframe: 'Daily', strength: 9 }
    ],
    demand_zones: [],
    order_blocks: [
      { high: 184.80, low: 184.40, type: 'order_block', timeframe: '4H', strength: 8 }
    ],
    imbalances_data: [
      { high: 184.90, low: 184.70, type: 'imbalance', timeframe: '1H', strength: 7 }
    ],
    choch_levels: [
      { high: 184.95, low: 184.45, type: 'choch', timeframe: 'Daily', strength: 9 }
    ]
  },
  {
    id: 'demo-3',
    symbol: 'XAUUSD',
    timeframe: '1H',
    direction: 'buy',
    entry_price: 2018.50,
    stop_loss: 2010.00,
    take_profit_1: 2052.50, // 1:4 RRR
    take_profit_2: 2086.50, // 1:8 RRR
    take_profit_3: 2120.50, // 1:12 RRR
    confidence_score: 95,
    risk_reward_ratio: 4.0,
    signal_type: 'institutional_reversal',
    status: 'active',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    higher_tf_bias: 'bullish',
    backtested_win_rate: 81,
    backtested_avg_rr: 4.8,
    trade_rationale: 'Monthly demand + Weekly CHoCH + NY session institutional buying. Perfect storm setup with DXY weakness.',
    confluence_factors: [
      'monthly_demand_zone',
      'weekly_choch_bullish',
      'ny_session_institutional_flow',
      'dxy_weakness_correlation',
      'volume_spike_confirmation',
      'fib_786_retracement',
      'previous_week_low_support'
    ],
    supply_zones: [],
    demand_zones: [
      { high: 2020.00, low: 2010.00, type: 'demand', timeframe: 'Monthly', strength: 10 },
      { high: 2019.00, low: 2015.00, type: 'demand', timeframe: 'Weekly', strength: 9 }
    ],
    order_blocks: [
      { high: 2019.50, low: 2017.50, type: 'order_block', timeframe: '4H', strength: 9 }
    ],
    imbalances_data: [
      { high: 2021.00, low: 2019.00, type: 'imbalance', timeframe: '1H', strength: 8 }
    ],
    choch_levels: [
      { high: 2022.00, low: 2016.00, type: 'choch', timeframe: 'Weekly', strength: 10 }
    ]
  },
  {
    id: 'demo-4',
    symbol: 'NAS100',
    timeframe: '1H',
    direction: 'sell',
    entry_price: 15250.0,
    stop_loss: 15330.0,
    take_profit_1: 14930.0, // 1:4 RRR
    take_profit_2: 14610.0, // 1:8 RRR
    take_profit_3: 14290.0, // 1:12 RRR
    confidence_score: 91,
    risk_reward_ratio: 4.0,
    signal_type: 'institutional_distribution',
    status: 'active',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    higher_tf_bias: 'bearish',
    backtested_win_rate: 76,
    backtested_avg_rr: 4.3,
    trade_rationale: 'Weekly supply distribution + Daily BOS + NY session selling pressure. Tech sector rotation confluence.',
    confluence_factors: [
      'weekly_supply_distribution',
      'daily_bos_bearish',
      'ny_session_selling_pressure',
      'tech_sector_rotation',
      'vix_spike_confirmation',
      'previous_month_high_resistance',
      'institutional_flow_bearish'
    ],
    supply_zones: [
      { high: 15320.0, low: 15280.0, type: 'supply', timeframe: 'Weekly', strength: 10 },
      { high: 15280.0, low: 15240.0, type: 'supply', timeframe: 'Daily', strength: 9 }
    ],
    demand_zones: [],
    order_blocks: [
      { high: 15270.0, low: 15230.0, type: 'order_block', timeframe: '4H', strength: 8 }
    ],
    imbalances_data: [
      { high: 15260.0, low: 15240.0, type: 'imbalance', timeframe: '1H', strength: 8 }
    ],
    choch_levels: [
      { high: 15275.0, low: 15225.0, type: 'choch', timeframe: 'Daily', strength: 9 }
    ]
  },
  {
    id: 'demo-5',
    symbol: 'USDJPY',
    timeframe: '4H',
    direction: 'buy',
    entry_price: 149.80,
    stop_loss: 148.60,
    take_profit_1: 154.60, // 1:4 RRR
    take_profit_2: 159.40, // 1:8 RRR
    take_profit_3: 164.20, // 1:12 RRR
    confidence_score: 88,
    risk_reward_ratio: 4.0,
    signal_type: 'trend_continuation_breakout',
    status: 'active',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    higher_tf_bias: 'bullish',
    backtested_win_rate: 73,
    backtested_avg_rr: 4.5,
    trade_rationale: 'Monthly uptrend + Weekly demand + BoJ intervention levels. Strong USD fundamentals with JPY weakness.',
    confluence_factors: [
      'monthly_uptrend_continuation',
      'weekly_demand_hold',
      'boj_intervention_levels',
      'usd_strength_fundamentals',
      'jpy_weakness_correlation',
      'carry_trade_momentum',
      'fib_382_retracement_hold'
    ],
    supply_zones: [],
    demand_zones: [
      { high: 150.20, low: 149.00, type: 'demand', timeframe: 'Monthly', strength: 10 },
      { high: 150.00, low: 149.60, type: 'demand', timeframe: 'Weekly', strength: 9 }
    ],
    order_blocks: [
      { high: 149.90, low: 149.70, type: 'order_block', timeframe: '4H', strength: 8 }
    ],
    imbalances_data: [
      { high: 150.10, low: 149.85, type: 'imbalance', timeframe: '1H', strength: 7 }
    ],
    choch_levels: [
      { high: 150.15, low: 149.45, type: 'choch', timeframe: 'Weekly', strength: 9 }
    ]
  }
]

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
