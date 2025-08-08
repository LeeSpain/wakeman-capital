import React from 'react';
import { Helmet } from 'react-helmet-async';
import Dashboard from '../components/Dashboard';
import TrendPulse from '../components/TrendPulse';
const heroImageUrl = new URL('../assets/hero-trend-grid.jpg', import.meta.url).href;

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Trend Pulse — AI Market Sentiment | CMWTrading</title>
        <meta name="description" content="Advanced AI-powered market sentiment analysis and trading dashboard. Get real-time insights, trend analysis, and data-driven trading decisions with Trend Pulse." />
        <meta name="keywords" content="AI trading, market sentiment, trend analysis, financial data, trading dashboard" />
        <link rel="canonical" href="/" />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="absolute inset-0 opacity-10">
            <img 
              src={heroImageUrl} 
              alt="Market trend analysis grid visualization" 
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              AI-Powered Market Intelligence
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Harness advanced sentiment analysis and trend detection to make data-driven trading decisions with confidence.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          <Dashboard />
          <TrendPulse />
        </section>
      </main>
    </>
  );
};

export default Index;