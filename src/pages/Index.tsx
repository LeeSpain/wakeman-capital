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
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-6">
                Monitor X and news in real time with AI. Turn market narratives into clear, actionable signals that complement your Smart Money Concepts.
              </p>
              <div className="flex gap-3">
                <Link to="/trends" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Explore Trends</Link>
                <Link to="/dashboard" className="px-4 py-2 rounded-md border border-border bg-secondary text-secondary-foreground">Learn more</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Account Access */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-card p-6 shadow-elegant">
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Account Access</h2>
              <p className="text-sm text-muted-foreground mb-4">Sign in to your Wakeman Capital account.</p>
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
                  <Link to="/auth" className="text-sm text-primary hover:underline">Create account</Link>
                </div>
              </form>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-elegant">
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