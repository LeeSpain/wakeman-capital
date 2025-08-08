import React from 'react';
import { Helmet } from 'react-helmet-async';

const sample = [
  { title: 'EURUSD', sentiment: 0.91, source: 'NewsAPI', tags: ['bullish', 'accumulation', 'support'] },
  { title: 'BTCUSD', sentiment: 0.88, source: 'X', tags: ['rally', 'breakout', 'bullish', 'strength', 'demand'] },
  { title: 'XAUUSD', sentiment: -0.86, source: 'X', tags: ['decline', 'distribution', 'bearish'] },
  { title: 'BTCUSD', sentiment: -0.78, source: 'X', tags: ['profit taking', 'supply', 'decline', 'bearish', 'weakness'] },
  { title: 'ETHUSD', sentiment: 0.77, source: 'NewsAPI', tags: ['smart money', 'breakout', 'institutional buying', 'support'] },
  { title: 'GBPUSD', sentiment: -0.56, source: 'X', tags: ['sell-off', 'profit taking', 'correction', 'weakness', 'supply'] },
  { title: 'ETHUSD', sentiment: 0.49, source: 'X', tags: ['smart money', 'breakout', 'demand', 'rally'] },
  { title: 'EURUSD', sentiment: -0.48, source: 'X', tags: ['profit taking', 'resistance', 'breakdown'] },
  { title: 'XAUUSD', sentiment: 0.46, source: 'NewsAPI', tags: ['demand', 'accumulation'] },
];

const Trends = () => (
  <>
    <Helmet>
      <title>Market Trends | Trend Pulse</title>
      <meta name="description" content="AI-powered sentiment from X and news to guide SMC trades." />
      <link rel="canonical" href="/trends" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Market Trends</h1>
          <p className="text-muted-foreground">AI-powered sentiment from X and news to guide your SMC trades.</p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sample.map((c, idx) => (
            <article key={idx} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-card-foreground">{c.title}</h3>
                <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">{c.source}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Sentiment: {c.sentiment > 0 ? `+${c.sentiment.toFixed(2)}` : c.sentiment.toFixed(2)}</p>
              <div className="h-2 rounded bg-muted overflow-hidden">
                <div
                  className={`${c.sentiment >= 0 ? 'bg-primary' : 'bg-destructive'} h-2`}
                  style={{ width: `${Math.min(100, Math.abs(c.sentiment) * 100)}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tags.map(t => (
                  <span key={t} className="text-xs rounded-full border border-border px-2 py-1 text-muted-foreground">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  </>
);

export default Trends;
