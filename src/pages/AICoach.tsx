import React from 'react';
import { Helmet } from 'react-helmet-async';

const AICoach = () => (
  <>
    <Helmet>
      <title>AI Coach | Trend Pulse</title>
      <meta name="description" content="AI Coach for trading guidance and personalized insights." />
      <link rel="canonical" href="/ai-coach" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Coach</h1>
          <p className="text-muted-foreground">Chat with your AI trading coach for guidance.</p>
        </header>
        <section className="p-6 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">AI Coach interface coming back soon. Restoring connections next.</p>
        </section>
      </div>
    </main>
  </>
);

export default AICoach;
