import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';


const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cards = [
    { title: 'BTCUSD', sentiment: 0.45, source: 'X', tags: ['bullish', 'ETF', 'breakout'] },
    { title: 'EURUSD', sentiment: -0.30, source: 'NewsAPI', tags: ['ECB', 'policy', 'weakness'] },
    { title: 'ETHUSD', sentiment: 0.20, source: 'X', tags: ['upgrade', 'flows'] },
  ];

  return (
    <>
      <Helmet>
        <title>Wakeman Capital — AI Market Intelligence</title>
        <meta name="description" content="Wakeman Capital delivers AI-powered market intelligence, trend analysis, and actionable insights for SMC traders and investors." />
        <meta name="keywords" content="AI trading, market sentiment, trend analysis, financial data, trading dashboard" />
        <link rel="canonical" href="/" />
      </Helmet>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 px-4">
          <div className="absolute inset-0 bg-hero-gradient bg-grid-subtle opacity-30 pointer-events-none" aria-hidden="true"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="rounded-xl bg-card/80 backdrop-blur shadow-elegant p-8 md:p-12">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                <span className="text-primary">Wakeman Capital</span> — AI Market Intelligence
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                Transform market noise into clear, SMC-aligned insights. Real-time narrative tracking across social and news, distilled into actionable context.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/40 p-4">
                  <div className="text-sm text-muted-foreground">Real-time Signals</div>
                  <div className="text-2xl font-semibold text-card-foreground">10,000+/day</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-4">
                  <div className="text-sm text-muted-foreground">Asset Coverage</div>
                  <div className="text-2xl font-semibold text-card-foreground">FX · Crypto · Indices</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-4">
                  <div className="text-sm text-muted-foreground">Avg. Latency</div>
                  <div className="text-2xl font-semibold text-card-foreground">~1.2s</div>
                </div>
              </div>

              {/* Benefits */}
              <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>SMC-aligned entries with clear invalidation and targets</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>London-session focus with macro- and event-aware context</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>Noise-filtered narratives from social and news feeds</span></li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>Exportable, journal-ready summaries for discipline</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sales Section */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="rounded-xl bg-card/80 backdrop-blur shadow-elegant p-6 md:p-8 border border-primary/20">
            {/* Hero Sales Message */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Turn Market Intelligence Into <span className="text-primary">Profit</span>
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Join traders who only pay when they profit. Our AI-powered insights deliver SMC-aligned opportunities with a simple 10% success fee model.
              </p>
            </div>

            {/* Value Proposition Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-muted/20 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Precision Entries</h3>
                <p className="text-sm text-muted-foreground">SMC-aligned signals with clear invalidation levels and profit targets</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Real-Time Intelligence</h3>
                <p className="text-sm text-muted-foreground">10,000+ daily signals processed in ~1.2s latency across all major markets</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/20 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">💰</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Profit-First Model</h3>
                <p className="text-sm text-muted-foreground">Only pay 10% when you profit. No monthly fees, no hidden costs</p>
              </div>
            </div>

            {/* Social Proof & Stats */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-primary">95%+</div>
                  <div className="text-sm text-muted-foreground">Signal Accuracy</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">$2.4M+</div>
                  <div className="text-sm text-muted-foreground">Profits Tracked</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">1,200+</div>
                  <div className="text-sm text-muted-foreground">Active Traders</div>
                </div>
              </div>
            </div>

            {/* Profit Sharing Highlight */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl">🤝</span>
                <h3 className="text-lg font-semibold text-foreground">Aligned Success Model</h3>
              </div>
              <p className="text-center text-muted-foreground mb-3 text-sm">
                We succeed when you succeed. Pay only 10% of your profits—no upfront costs, no monthly subscriptions, no risk.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  ✓ Zero risk, maximum reward alignment
                </span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Start Earning Today
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Already have an account? <Link to="/auth" className="text-primary hover:underline">Sign in here</Link>
              </p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">✓ No setup fees</span>
                <span className="flex items-center gap-1">✓ Cancel anytime</span>
                <span className="flex items-center gap-1">✓ 30-day money back</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trend Pulse cards */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Wakeman Capital Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <article key={c.title} className="rounded-xl bg-card p-6 shadow-elegant">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-card-foreground">{c.title}</h3>
                  <span className="text-xs text-muted-foreground rounded px-2 py-0.5 bg-muted/40">{c.source}</span>
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
                    <span key={t} className="text-xs rounded-full px-2 py-1 text-muted-foreground bg-muted/40">{t}</span>
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