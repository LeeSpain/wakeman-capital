import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import StatsCards from './dashboard/StatsCards';
import RecentTrades from './dashboard/RecentTrades';
import TopOpportunities from './dashboard/TopOpportunities';
import { MarketDataStatus } from './market/MarketDataStatus';
import { TrendsSummary } from './trends/TrendsSummary';
import { NewsAlert } from './news/NewsAlert';
import { useTrends } from '../hooks/useTrends';
import { useTopOpportunities } from '../hooks/useSignals';
import { useUserTrades } from '../hooks/useTrades';
import { useNewsAlerts } from '../hooks/useNewsAlerts';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { data: trends } = useTrends();
  const { trades, loading: tradesLoading } = useUserTrades(user?.id ?? null);
  const { data: opps, loading: oppsLoading } = useTopOpportunities();
  const { upcomingEvents, isWithinDangerZone } = useNewsAlerts();

  const displayName = profile?.first_name || profile?.display_name || user?.email || 'Guest';

  const activeSignals = oppsLoading ? null : opps.length;
  const openTrades = trades.filter(t => t.status === 'open').length;
  const trackedPairs = trends.length;

  const LiveClock: React.FC = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
      const t = setInterval(() => setNow(new Date()), 30000);
      return () => clearInterval(t);
    }, []);
    const formatter = new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    return <span className="text-sm text-muted-foreground">{formatter.format(now)}</span>;
  };

  const Chip: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="ml-1 font-medium text-foreground">{value ?? '…'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="rounded-xl bg-card p-6 shadow-elegant">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Welcome back{displayName ? ',' : ''}</div>
            <h2 className="text-2xl font-bold text-card-foreground">{displayName}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip label="Active signals" value={activeSignals} />
              <Chip label="Open trades" value={tradesLoading ? '…' : openTrades} />
              <Chip label="Tracked pairs" value={trackedPairs} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">As of</div>
              <LiveClock />
            </div>
            <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Quick top-up</button>
          </div>
        </div>
        <div className="mt-6">
          <StatsCards />
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-card-foreground">Dashboard</h3>
        <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground">Add Funds</button>
      </div>

      {/* Trends Snapshot */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h4 className="text-xl font-semibold text-card-foreground mb-3">Trends Snapshot</h4>
        <TrendsSummary data={trends} />
      </section>

      {/* News Alerts */}
      <NewsAlert events={upcomingEvents} isWithinDangerZone={isWithinDangerZone} />

      {/* Market Data Status */}
      <MarketDataStatus />

      {/* Two-column sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TopOpportunities />
        <RecentTrades />
      </div>
    </div>
  );
};

export default Dashboard;