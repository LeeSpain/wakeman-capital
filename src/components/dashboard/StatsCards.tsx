import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserTrades } from '../../hooks/useTrades';
import { useTopOpportunities } from '../../hooks/useSignals';
import { useTrends } from '../../hooks/useTrends';
import { useOandaAccount } from '../../hooks/useOandaAccount';

const Stat: React.FC<{ label: string; value: React.ReactNode; helper?: string; emphasize?: boolean }>= ({ label, value, helper, emphasize }) => (
  <div className="rounded-lg border border-border p-4 bg-card">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className={`text-3xl font-bold ${emphasize ? 'text-primary' : 'text-card-foreground'}`}>{value}</div>
    {helper && <div className="text-xs text-muted-foreground">{helper}</div>}
  </div>
);

export const StatsCards: React.FC = () => {
  const { user } = useAuth();
  const { trades, loading: tradesLoading } = useUserTrades(user?.id ?? null);
  const { data: opps, loading: oppsLoading } = useTopOpportunities();
  const { data: trends } = useTrends();
  const { data: oandaData } = useOandaAccount();

  const metrics = useMemo(() => {
    const openTrades = trades.filter(t => t.status === 'open').length;
    const closed = trades.filter(t => t.status === 'closed');
    const wins = closed.filter(t => (t.pl ?? 0) > 0).length;
    const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;
    const totalPnL = trades.reduce((acc, t) => acc + (Number(t.pl) || 0), 0);
    const activeSignals = opps.length;
    const trackedPairs = trends.length;
    return { openTrades, winRate, totalPnL, activeSignals, trackedPairs };
  }, [trades, opps, trends]);

  return (
    <section className="grid md:grid-cols-6 gap-4">
      <Stat label="Open Trades" value={tradesLoading ? '…' : metrics.openTrades} helper={user ? 'Paper' : 'Sign in to track'} />
      <Stat label="Win Rate" value={`${metrics.winRate}%`} helper={`${trades.filter(t=>t.status==='closed').length} closed`} />
      <Stat label="Total P&L" value={(metrics.totalPnL>=0?'+':'') + metrics.totalPnL.toFixed(2)} emphasize />
      {oandaData && (
        <Stat 
          label="Live Balance" 
          value={`${oandaData.currency} ${oandaData.balance.toFixed(0)}`} 
          helper={`${oandaData.environment} • ${oandaData.trades.length} open`}
          emphasize 
        />
      )}
      <Stat label="Active Signals" value={oppsLoading ? '…' : metrics.activeSignals} />
      <Stat label="Tracked Pairs" value={metrics.trackedPairs} helper="24h analysis" />
    </section>
  );
};

export default StatsCards;
