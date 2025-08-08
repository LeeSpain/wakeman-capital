import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTrends } from '../hooks/useTrends';
import { TrendCard } from '../components/trends/TrendCard';
import { TrendsSummary } from '../components/trends/TrendsSummary';

const Trends = () => {
  const { data, loading, error, timeframes } = useTrends();
  const [q, setQ] = useState('');
  const [tf, setTf] = useState<string>('');

  const filtered = useMemo(() => {
    return data.filter(d => {
      const passQ = q ? (d.symbol?.toLowerCase().includes(q.toLowerCase()) || d.trend_direction?.toLowerCase().includes(q.toLowerCase())) : true
      const passTf = tf ? d.timeframe === tf : true
      return passQ && passTf
    }).sort((a,b) => (Number(b.confluence_score||0) - Number(a.confluence_score||0)) || (new Date(b.analysis_timestamp).getTime() - new Date(a.analysis_timestamp).getTime()))
  }, [data, q, tf])

  return (
    <>
      <Helmet>
        <title>Market Trends | Wakeman Capital</title>
        <meta name="description" content="Live AI-powered SMC trend analysis with confluence and timeframe filters." />
        <link rel="canonical" href="/trends" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">Market Trends</h1>
            <p className="text-muted-foreground">Live sentiment and structure alignment to guide your SMC trades.</p>
          </header>

          <TrendsSummary data={data} />

          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="Search symbol or direction (e.g., EURUSD, bullish)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search trends"
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={tf}
              onChange={(e) => setTf(e.target.value)}
              aria-label="Filter timeframe"
            >
              <option value="">All timeframes</option>
              {timeframes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="h-10 rounded-md border border-border bg-card text-sm px-3 flex items-center text-muted-foreground">
              {loading ? 'Loading…' : error ? `Error: ${error}` : `${filtered.length} results`}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((row) => (
              <TrendCard key={row.id} row={row} />
            ))}
            {!loading && filtered.length === 0 && (
              <p className="text-muted-foreground">No trends found. Try adjusting filters.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Trends;
