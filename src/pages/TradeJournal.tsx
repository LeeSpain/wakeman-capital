import React from 'react';
import { Helmet } from 'react-helmet-async';

const TradeJournal = () => (
  <>
    <Helmet>
      <title>Trade Journal | Trend Pulse</title>
      <meta name="description" content="Record and review your trades in the Trade Journal." />
      <link rel="canonical" href="/journal" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trade Journal</h1>
          <p className="text-muted-foreground">Log trades and analyze performance over time.</p>
        </header>
        <section className="p-6 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">Your journal entries will be restored here.</p>
        </section>
      </div>
    </main>
  </>
);

export default TradeJournal;
