import React from 'react';
import { Helmet } from 'react-helmet-async';
import TrendPulse from '../components/TrendPulse';

const Analytics = () => {
  return (
    <>
      <Helmet>
        <title>Market Analytics | Trend Pulse</title>
        <meta name="description" content="Advanced market sentiment analysis and trend detection powered by AI algorithms for better trading decisions." />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Market Analytics</h1>
            <p className="text-muted-foreground">AI-powered sentiment analysis and trend detection</p>
          </header>
          <TrendPulse />
        </div>
      </main>
    </>
  );
};

export default Analytics;