import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserTrades } from '../../hooks/useTrades';

export const RecentTrades: React.FC = () => {
  const { user } = useAuth();
  const { trades, loading } = useUserTrades(user?.id ?? null);
  const rows = trades.slice(0, 5);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h4 className="text-xl font-semibold text-card-foreground mb-3">Recent Trades</h4>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading trades...</p>
      ) : !user ? (
        <p className="text-sm text-muted-foreground">Sign in to view your trading history.</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No trades yet. Start trading to see your history here.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs">
              <tr>
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Dir</th>
                <th className="text-left py-2">Status</th>
                <th className="text-right py-2">P&L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2">{r.symbol}</td>
                  <td className="py-2">{r.direction}</td>
                  <td className="py-2">{r.status}</td>
                  <td className={`py-2 text-right ${Number(r.pl||0) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {(Number(r.pl||0) >= 0 ? '+' : '') + (Number(r.pl||0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentTrades;
