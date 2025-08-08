import React from 'react'
import type { TrendRow } from '@/hooks/useTrends'

export const TrendCard: React.FC<{ row: TrendRow }> = ({ row }) => {
  const positive = (row.trend_direction || '').toLowerCase().includes('up') || (row.trend_direction || '').toLowerCase().includes('bull')
  const negative = (row.trend_direction || '').toLowerCase().includes('down') || (row.trend_direction || '').toLowerCase().includes('bear')
  const directionLabel = row.trend_direction?.toUpperCase() || '—'
  const barWidth = Math.max(0, Math.min(100, Number(row.trend_strength)))

  return (
    <article className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-card-foreground">{row.symbol}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs rounded-full px-2 py-0.5 border border-border">{row.timeframe}</span>
          <span className={`text-xs rounded-full px-2 py-0.5 border border-border ${positive ? 'text-primary' : negative ? 'text-destructive' : 'text-muted-foreground'}`}>{directionLabel}</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground mb-3">Confluence: {row.confluence_score ?? '—'}</div>
      <div className="h-2 rounded bg-muted overflow-hidden">
        <div
          className={`${positive ? 'bg-primary' : negative ? 'bg-destructive' : 'bg-accent'} h-2`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Higher TF Align: {row.higher_tf_alignment ? 'Yes' : 'No'}</span>
        <span>{new Date(row.analysis_timestamp).toUTCString()}</span>
      </div>
      {Array.isArray(row.key_levels) && row.key_levels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {row.key_levels.slice(0, 6).map((lvl, idx) => (
            <span key={idx} className="text-xs rounded-full border border-border px-2 py-1 text-muted-foreground">{String(lvl)}</span>
          ))}
        </div>
      )}
    </article>
  )
}
