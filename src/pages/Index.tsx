import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
const heroImageUrl = new URL('../assets/hero-trend-grid.jpg', import.meta.url).href;

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

        {/* Account Access */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Account Access</h2>
              <p className="text-sm text-muted-foreground mb-4">Sign in to your Trend Pulse account.</p>
              <form
                className="space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setLoading(true);
                  const { error } = await supabase.auth.signInWithPassword({ email, password });
                  setLoading(false);
                  if (error) setError(error.message);
                  else navigate('/dashboard');
                }}
              >
                <div className="grid gap-2">
                  <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-muted-foreground" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Your password"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                  <a href="/auth" className="text-sm text-primary hover:underline">Create account</a>
                </div>
              </form>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Quick start</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Use the Dashboard for an overview of your signals and trades</li>
                <li>Explore Trends for real-time narrative shifts</li>
                <li>Upgrade in Billing to unlock pro features</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Trend Pulse cards */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
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