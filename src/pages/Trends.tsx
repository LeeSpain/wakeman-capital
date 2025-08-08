import React from 'react';
import { Helmet } from 'react-helmet-async';
import TrendPulse from '../components/TrendPulse';

const Trends = () => (
  <>
    <Helmet>
      <title>Trends | Trend Pulse</title>
      <meta name="description" content="Discover market trends and sentiment insights." />
      <link rel="canonical" href="/trends" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trends</h1>
          <p className="text-muted-foreground">Market sentiment and trend detection</p>
        </header>
        <TrendPulse />
      </div>
    </main>
  </>
);

export default Trends;
