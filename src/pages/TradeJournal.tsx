import React from 'react';
import { Helmet } from 'react-helmet-async';

const rows = [
  { symbol: 'EURUSD', entry: '2025-08-01 09:30', exit: '2025-08-01 12:40', outcome: 'win', pl: '+1.2%', rr: '2.1' },
  { symbol: 'BTCUSD', entry: '2025-08-03 14:10', exit: '2025-08-03 18:05', outcome: 'loss', pl: '-0.5%', rr: '-0.6' },
];

const TradeJournal = () => (
  <>
    <Helmet>
      <title>Trade Journal | Trend Pulse</title>
      <meta name="description" content="Track your performance and learn from each trade." />
      <link rel="canonical" href="/journal" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trade Journal</h1>
          <p className="text-muted-foreground">Track your performance and learn from each trade.</p>
        </header>
        <section className="rounded-xl border border-border bg-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Recent Trades</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">Entry Time</th>
                    <th className="py-3 px-4">Exit Time</th>
                    <th className="py-3 px-4">Outcome</th>
                    <th className="py-3 px-4">P/L</th>
                    <th className="py-3 px-4">R:R</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      <td className="py-3 px-4 font-medium">{r.symbol}</td>
                      <td className="py-3 px-4">{r.entry}</td>
                      <td className="py-3 px-4">{r.exit}</td>
                      <td className="py-3 px-4">
                        <span className={`capitalize ${r.outcome === 'win' ? 'text-primary' : 'text-destructive'}`}>{r.outcome}</span>
                      </td>
                      <td className="py-3 px-4">{r.pl}</td>
                      <td className="py-3 px-4">{r.rr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  </>
);

export default TradeJournal;
