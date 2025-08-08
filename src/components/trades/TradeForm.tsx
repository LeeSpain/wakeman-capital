import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { NewTradeInput, TradeDirection } from '@/hooks/useTrades'

interface Props {
  onSubmit: (input: NewTradeInput) => Promise<void> | void
}

const initialState: NewTradeInput = {
  symbol: '',
  direction: 'LONG',
  entry_price: 0,
  stop_price: undefined,
  take_profit: undefined,
  rr_target: undefined,
  timeframe: '',
  risk_percent: 1,
  notes: ''
}

export const TradeForm: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState<NewTradeInput>(initialState)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (key: keyof NewTradeInput, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.symbol || !form.entry_price || !form.direction) return
    try {
      setSubmitting(true)
      await onSubmit(form)
      setForm(initialState)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border p-4 bg-card grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Symbol</label>
        <input
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          placeholder="EURUSD"
          value={form.symbol}
          onChange={e => handleChange('symbol', e.target.value.toUpperCase())}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Direction</label>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={form.direction}
          onChange={e => handleChange('direction', e.target.value as TradeDirection)}
        >
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Entry Price</label>
        <input
          type="number"
          step="any"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={form.entry_price}
          onChange={e => handleChange('entry_price', Number(e.target.value))}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Stop</label>
        <input
          type="number"
          step="any"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={form.stop_price ?? ''}
          onChange={e => handleChange('stop_price', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">TP</label>
        <input
          type="number"
          step="any"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={form.take_profit ?? ''}
          onChange={e => handleChange('take_profit', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Timeframe</label>
        <input
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          placeholder="M15"
          value={form.timeframe ?? ''}
          onChange={e => handleChange('timeframe', e.target.value)}
        />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={submitting} className="w-full md:w-auto">
          {submitting ? 'Adding…' : 'Add Trade'}
        </Button>
      </div>
    </form>
  )
}
