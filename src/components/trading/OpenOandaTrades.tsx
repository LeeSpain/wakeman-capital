import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OandaTradeRow {
  id: string;
  symbol: string;
  direction: 'long' | 'short' | string;
  units: number;
  entry_price: number;
  current_price?: number | null;
  unrealized_pnl?: number | null;
  take_profit?: number | null;
  take_profit_2?: number | null;
  take_profit_3?: number | null;
  status: string;
  created_at: string;
}

const OpenOandaTrades: React.FC = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<OandaTradeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('oanda_trades')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (!error && data) setRows(data as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const sync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('oanda-sync-trades', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      if (error) throw error;
      await load();
    } catch (e) {
      console.error('Sync failed', e);
      alert('Failed to sync trades');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="p-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground">Open OANDA Trades</h3>
        <Button variant="outline" size="sm" onClick={sync} disabled={syncing}>
          {syncing ? 'Syncing…' : 'Sync Now'}
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-muted-foreground">No open trades.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Dir</th>
                <th className="text-right py-2">Units</th>
                <th className="text-right py-2">Entry</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">uPnL</th>
                <th className="text-right py-2">TP1/2/3</th>
                <th className="text-right py-2">Opened</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2">{r.symbol}</td>
                  <td className="py-2">{String(r.direction).toUpperCase()}</td>
                  <td className="py-2 text-right">{r.units}</td>
                  <td className="py-2 text-right">{r.entry_price}</td>
                  <td className="py-2 text-right">{r.current_price ?? '-'}</td>
                  <td className={`py-2 text-right ${((r.unrealized_pnl ?? 0) >= 0) ? 'text-emerald-500' : 'text-red-500'}`}>{r.unrealized_pnl?.toFixed?.(2) ?? '-'}</td>
                  <td className="py-2 text-right">{[r.take_profit, r.take_profit_2, r.take_profit_3].filter(Boolean).join(' / ') || '-'}</td>
                  <td className="py-2 text-right">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default OpenOandaTrades;