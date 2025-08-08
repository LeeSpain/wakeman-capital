import React from 'react';
import { Helmet } from 'react-helmet-async';
const heroImageUrl = new URL('../assets/hero-trend-grid.jpg', import.meta.url).href;

const Index = () => {
  const cards = [
    { title: 'BTCUSD', sentiment: 0.45, source: 'X', tags: ['bullish', 'ETF', 'breakout'] },
    { title: 'EURUSD', sentiment: -0.30, source: 'NewsAPI', tags: ['ECB', 'policy', 'weakness'] },
    { title: 'ETHUSD', sentiment: 0.20, source: 'X', tags: ['upgrade', 'flows'] },
  ];

  return (
    <>
      <Helmet>
        <title>Trend Pulse — AI Market Sentiment | Wakeman Capital</title>
        <meta name="description" content="Advanced AI-powered market sentiment analysis and trading dashboard. Get real-time insights, trend analysis, and data-driven trading decisions with Trend Pulse." />
        <meta name="keywords" content="AI trading, market sentiment, trend analysis, financial data, trading dashboard" />
        <link rel="canonical" href="/" />
      </Helmet>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 px-4">
          <div className="absolute inset-0 opacity-10">
            <img src={heroImageUrl} alt="Market trend analysis grid visualization" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
          <div className="relative max-w-7xl mx-auto">
            <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                <span className="text-primary">Trend Pulse</span> for SMC Traders
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-6">
                Monitor X and news in real time with AI. Turn market narratives into clear, actionable signals that complement your Smart Money Concepts.
              </p>
              <div className="flex gap-3">
                <a href="/trends" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Explore Trends</a>
                <a href="/dashboard" className="px-4 py-2 rounded-md border border-border bg-secondary text-secondary-foreground">Learn more</a>
              </div>
            </div>
          </div>
        </section>

        {/* Trend Pulse cards */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Trend Pulse</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <article key={c.title} className="rounded-lg border border-border bg-card p-6">
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
        </section>
      </main>
    </>
  );
};

export default Index;