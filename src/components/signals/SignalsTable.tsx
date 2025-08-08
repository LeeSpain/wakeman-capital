import React from 'react'
import type { SignalRecord } from '@/hooks/useSignals'

export const SignalsTable: React.FC<{ signals: SignalRecord[]; loading?: boolean }>
= ({ signals, loading }) => {
  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-card border-b border-border">
          <tr className="text-left">
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Timeframe</th>
            <th className="px-4 py-3">Direction</th>
            <th className="px-4 py-3">Entry</th>
            <th className="px-4 py-3">Stop</th>
            <th className="px-4 py-3">TP1</th>
            <th className="px-4 py-3">RRR</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={9}>Loading signals…</td></tr>
          ) : signals.length === 0 ? (
            <tr><td className="px-4 py-6 text-center text-muted-foreground" colSpan={9}>No signals found.</td></tr>
          ) : (
            signals.map(s => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{s.symbol}</td>
                <td className="px-4 py-3">{s.timeframe}</td>
                <td className="px-4 py-3">{s.direction}</td>
                <td className="px-4 py-3">{s.entry_price}</td>
                <td className="px-4 py-3">{s.stop_loss}</td>
                <td className="px-4 py-3">{s.take_profit_1 ?? '—'}</td>
                <td className="px-4 py-3">{s.risk_reward_ratio ?? '—'}</td>
                <td className="px-4 py-3">{s.confidence_score}</td>
                <td className="px-4 py-3">{s.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
