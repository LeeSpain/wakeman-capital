import React, { useMemo } from 'react'
import type { TrendRow } from '../../hooks/useTrends'

export const TrendsSummary: React.FC<{ data: TrendRow[] }>= ({ data }) => {
  const summary = useMemo(() => {
    const total = data.length
    const bullish = data.filter(d => (d.trend_direction||'').toLowerCase().includes('up') || (d.trend_direction||'').toLowerCase().includes('bull')).length
    const bearish = data.filter(d => (d.trend_direction||'').toLowerCase().includes('down') || (d.trend_direction||'').toLowerCase().includes('bear')).length
    const neutral = total - bullish - bearish
    const avgConfluence = total ? (data.reduce((acc, d) => acc + (Number(d.confluence_score) || 0), 0) / total) : 0
    const lastUpdated = data.reduce<string>((acc, d) => {
      const t = new Date(d.analysis_timestamp).toISOString()
      return t > acc ? t : acc
    }, '')
    return { total, bullish, bearish, neutral, avgConfluence: Number(avgConfluence.toFixed(2)), lastUpdated }
  }, [data])

  const Card: React.FC<{ label: string; value: React.ReactNode }>= ({ label, value }) => (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold text-card-foreground">{value}</div>
    </div>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      <Card label="Tracked Pairs" value={summary.total} />
      <Card label="Bullish" value={summary.bullish} />
      <Card label="Bearish" value={summary.bearish} />
      <Card label="Neutral" value={summary.neutral} />
      <Card label="Avg Confluence" value={summary.avgConfluence} />
    </div>
  )
}
