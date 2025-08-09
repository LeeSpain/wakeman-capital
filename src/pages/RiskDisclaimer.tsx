import React from 'react';
import { Helmet } from 'react-helmet-async';

const RiskDisclaimer: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Risk Disclaimer | Wakeman Capital</title>
        <meta name="description" content="Risk Disclaimer for trading and investment information provided by Wakeman Capital." />
        <link rel="canonical" href="/risk-disclaimer" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-foreground mb-6">Risk Disclaimer</h1>
          <section className="prose prose-invert max-w-none text-card-foreground/90">
            <p>Trading involves substantial risk and is not suitable for every investor. Past performance is not indicative of future results.</p>
            <h2>No Financial Advice</h2>
            <p>Content provided is for educational purposes only and should not be considered financial advice.</p>
          </section>
        </div>
      </main>
    </>
  );
};

export default RiskDisclaimer;
