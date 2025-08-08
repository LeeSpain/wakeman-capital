import React from 'react'
import { Button } from '@/components/ui/button'
import type { TradeRow } from '@/hooks/useTrades'

interface Props {
  trades: TradeRow[]
  onDelete?: (id: string) => void
  canEdit?: boolean
}

export const TradesTable: React.FC<Props> = ({ trades, onDelete, canEdit }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-card border-b border-border text-left">
          <tr>
            <th className="py-3 px-4">Symbol</th>
            <th className="py-3 px-4">Direction</th>
            <th className="py-3 px-4">Entry</th>
            <th className="py-3 px-4">Stop</th>
            <th className="py-3 px-4">TP</th>
            <th className="py-3 px-4">Timeframe</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Entry Time</th>
            <th className="py-3 px-4">Exit Time</th>
            {canEdit ? <th className="py-3 px-4 text-right">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td className="py-6 px-4 text-center text-muted-foreground" colSpan={canEdit ? 10 : 9}>No trades yet.</td>
            </tr>
          ) : trades.map(t => (
            <tr key={t.id} className="border-t border-border">
              <td className="py-3 px-4 font-medium">{t.symbol}</td>
              <td className="py-3 px-4">{t.direction}</td>
              <td className="py-3 px-4">{t.entry_price}</td>
              <td className="py-3 px-4">{t.stop_price ?? '—'}</td>
              <td className="py-3 px-4">{t.take_profit ?? '—'}</td>
              <td className="py-3 px-4">{t.timeframe ?? '—'}</td>
              <td className="py-3 px-4">{t.status}</td>
              <td className="py-3 px-4">{new Date(t.entry_time).toUTCString()}</td>
              <td className="py-3 px-4">{t.exit_time ? new Date(t.exit_time).toUTCString() : '—'}</td>
              {canEdit ? (
                <td className="py-3 px-4 text-right">
                  <Button variant="outline" onClick={() => onDelete?.(t.id)}>Delete</Button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
