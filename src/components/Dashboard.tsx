import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import StatsCards from './dashboard/StatsCards';
import RecentTrades from './dashboard/RecentTrades';
import TopOpportunities from './dashboard/TopOpportunities';
import { TrendsSummary } from './trends/TrendsSummary';
import { useTrends } from '../hooks/useTrends';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { data: trends } = useTrends();
  const displayName = profile?.first_name || profile?.display_name || user?.email || 'Guest';
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="rounded-xl bg-card p-6 shadow-elegant">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Welcome back{displayName ? ',' : ''}</div>
            <h2 className="text-2xl font-bold text-card-foreground">{displayName}</h2>
          </div>
          <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Quick top-up</button>
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

      {/* Two-column sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTrades />
        <TopOpportunities />
      </div>
    </div>
  );
};

export default Dashboard;