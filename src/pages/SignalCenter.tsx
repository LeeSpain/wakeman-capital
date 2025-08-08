import React from 'react';
import { Helmet } from 'react-helmet-async';

const SignalCenter = () => (
  <>
    <Helmet>
      <title>Signal Center | Trend Pulse</title>
      <meta name="description" content="View trading signals and market alerts in the Signal Center." />
      <link rel="canonical" href="/signal-center" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Signal Center</h1>
          <p className="text-muted-foreground">Centralized feed of AI and technical signals.</p>
        </header>
        <section className="p-6 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">Signals will appear here. Restoration in progress.</p>
        </section>
      </div>
    </main>
  </>
);

export default SignalCenter;
