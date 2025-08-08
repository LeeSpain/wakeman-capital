import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const tabs = ['Chat', 'Settings', 'Sources', 'Alerts'] as const;

type Tab = typeof tabs[number];

const AICoach = () => {
  const [active, setActive] = useState<Tab>('Chat');

  return (
    <>
      <Helmet>
        <title>AI Coach | Trend Pulse</title>
        <meta name="description" content="Chat on the dashboard; manage agent settings, sources, and alerts here." />
        <link rel="canonical" href="/coach" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Coach</h1>
            <p className="text-muted-foreground">Chat on the dashboard; manage agent settings, sources, and alerts here.</p>
          </header>

          <div className="rounded-lg border border-border bg-card">
            <div className="grid grid-cols-4 gap-0 border-b border-border text-sm">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={`py-3 px-4 text-center ${active === t ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-6">
              {active === 'Chat' && (
                <section>
                  <div className="h-64 rounded-md border border-border bg-background/60 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="mb-2">🤖</div>
                      <div className="font-medium">Welcome to AI Trading Coach</div>
                      <p className="text-sm">Ask questions about trading strategies, market analysis, or get personalized advice.</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <textarea className="w-full rounded-md border border-border bg-background p-3" placeholder="Ask anything about SMC, risk, entries, or management..." />
                    <input className="w-full rounded-md border border-border bg-background p-3" placeholder="Optional: Attach a URL for the coach to crawl" />
                    <div className="flex justify-end">
                      <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Ask</button>
                    </div>
                  </div>
                </section>
              )}
              {active === 'Settings' && <p className="text-muted-foreground">Model: openai • gpt-4o-mini (restore full settings later)</p>}
              {active === 'Sources' && <p className="text-muted-foreground">Manage sources (X, News, custom URLs).</p>}
              {active === 'Alerts' && <p className="text-muted-foreground">Set up alerts for significant moves and new signals.</p>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AICoach;
