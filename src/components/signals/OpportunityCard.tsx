import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../integrations/supabase/client'
import type { SignalRecord } from '../../hooks/useSignals'

function computeRR(signal: SignalRecord): number | null {
  if (signal.risk_reward_ratio) return signal.risk_reward_ratio
  if (!signal.take_profit_1 || !signal.entry_price || !signal.stop_loss) return null
  const risk = Math.abs(signal.entry_price - signal.stop_loss)
  const reward = signal.direction?.toUpperCase() === 'LONG' ? (signal.take_profit_1 - signal.entry_price) : (signal.entry_price - signal.take_profit_1)
  if (risk <= 0) return null
  return +(reward / risk).toFixed(2)
}

export const OpportunityCard: React.FC<{ signal: SignalRecord }> = ({ signal }) => {
  const { user } = useAuth()
  const [enabled, setEnabled] = useState(false)
  const rr = computeRR(signal)

  const onEnableAlerts = async () => {
    if (!user) {
      alert('Please sign in to enable alerts for this signal.')
      return
    }
    if (enabled) {
      setEnabled(false)
      return
    }
    setEnabled(true)
    await supabase.from('alerts').insert({
      user_id: user.id,
      title: `Alerts enabled: ${signal.symbol} ${signal.direction}`,
      message: `You will receive updates for ${signal.symbol} on ${signal.timeframe}.`,
      severity: 'info',
      source_id: signal.id,
    })
  }

  return (
    <section className="rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{signal.symbol}</span>
          <span className="text-xs rounded-full px-2 py-0.5 border border-border">{signal.direction?.toUpperCase()}</span>
          <span className="text-xs rounded-full px-2 py-0.5 border border-border">{signal.timeframe}</span>
        </div>
        <div className="text-xs text-muted-foreground">Score: {signal.confidence_score}/10</div>
      </div>

      <div className="grid md:grid-cols-5 gap-6 p-6">
        <div>
          <div className="text-sm text-muted-foreground">Entry Point</div>
          <div className="text-primary font-semibold">{signal.entry_price}</div>
          <div className="text-xs text-muted-foreground">Auto-calculated from SMC trigger</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Stop Loss</div>
          <div className="text-destructive font-semibold">{signal.stop_loss}</div>
          <div className="text-xs text-muted-foreground">Invalidation Level</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Take Profit</div>
          <div className="text-primary font-semibold">{signal.take_profit_1 ?? '—'}</div>
          <div className="text-xs text-muted-foreground">Target Level</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Risk-Reward</div>
          <div className="text-primary font-semibold">{rr ? `${rr}:1` : '—'}</div>
          <div className="text-xs text-muted-foreground">Minimum 2:1</div>
        </div>
        <div className="flex items-center justify-end">
          <Button onClick={onEnableAlerts} variant={enabled ? 'secondary' : 'outline'}>
            {enabled ? 'Alerts Enabled' : 'Enable Alerts'}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 p-6 border-t border-border text-sm">
        <div>
          <div className="text-muted-foreground">Historical Win Rate</div>
          <div className="text-foreground font-semibold">{signal.backtested_win_rate ? `${signal.backtested_win_rate}%` : '—'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Avg RRR</div>
          <div className="text-foreground font-semibold">{signal.backtested_avg_rr ?? '—'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Profit Factor</div>
          <div className="text-foreground font-semibold">—</div>
        </div>
        <div>
          <div className="text-muted-foreground">Expectancy</div>
          <div className="text-foreground font-semibold">—</div>
        </div>
      </div>
    </section>
  )
}
