import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Welcome back,</div>
            <h2 className="text-2xl font-bold text-card-foreground">icesoslite@gmail.com</h2>
          </div>
          <button className="px-3 py-2 rounded-md border border-border">Quick top-up</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-lg border border-border p-4 bg-background/60">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-semibold">$0.00</div>
            <div className="text-xs text-muted-foreground">Available for trading</div>
          </div>
          <div className="rounded-lg border border-border p-4 bg-background/60">
            <div className="text-sm text-muted-foreground">Open trades</div>
            <div className="text-2xl font-semibold">3</div>
            <div className="text-xs text-muted-foreground">Active positions</div>
          </div>
          <div className="rounded-lg border border-border p-4 bg-background/60">
            <div className="text-sm text-muted-foreground">Today's P&L</div>
            <div className="text-2xl font-semibold text-primary">$0.00</div>
            <div className="text-xs text-muted-foreground">Daily performance</div>
          </div>
        </div>
      </section>

      {/* Dashboard header with action */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-card-foreground">Dashboard</h3>
        <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground">Add Funds</button>
      </div>

      {/* Stats Cards */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="text-sm text-muted-foreground">Account Balance</div>
          <div className="text-3xl font-bold">$0.00</div>
          <div className="text-xs text-muted-foreground">Available for trading</div>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="text-sm text-muted-foreground">Open Trades</div>
          <div className="text-3xl font-bold">3</div>
          <div className="text-xs text-muted-foreground">Active positions</div>
        </div>
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="text-sm text-muted-foreground">Today's P&L</div>
          <div className="text-3xl font-bold text-primary">$0.00</div>
          <div className="text-xs text-muted-foreground">Daily performance</div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h4 className="text-xl font-semibold text-card-foreground">Market Overview</h4>
        <p className="text-sm text-muted-foreground mb-4">Latest market insights and signals</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border border-border p-3 bg-background/60">
            <div>
              <div className="font-medium">EUR/USD Bullish Signal</div>
              <div className="text-sm text-muted-foreground">4H Break of Structure confirmed</div>
            </div>
            <span className="text-xs rounded-full px-2 py-1 border border-border text-primary">High Confidence</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3 bg-background/60">
            <div>
              <div className="font-medium">GBP/USD Range Bound</div>
              <div className="text-sm text-muted-foreground">Consolidating between key levels</div>
            </div>
            <span className="text-xs rounded-full px-2 py-1 border border-border">Medium</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3 bg-background/60">
            <div>
              <div className="font-medium">USD/JPY Bearish Sentiment</div>
              <div className="text-sm text-muted-foreground">News driven weakness</div>
            </div>
            <span className="text-xs rounded-full px-2 py-1 border border-border">Monitor</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;