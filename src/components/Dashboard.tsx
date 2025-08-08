import React from 'react';
import { useAuth } from '../hooks/useAuth';
import StatsCards from './dashboard/StatsCards';
import RecentTrades from './dashboard/RecentTrades';
import TopOpportunities from './dashboard/TopOpportunities';
import { TrendsSummary } from './trends/TrendsSummary';
import { useTrends } from '../hooks/useTrends';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: trends } = useTrends();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Welcome back{user?.email ? ',' : ''}</div>
            <h2 className="text-2xl font-bold text-card-foreground">{user?.email ?? 'Guest'}</h2>
          </div>
          <button className="px-3 py-2 rounded-md border border-border">Quick top-up</button>
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