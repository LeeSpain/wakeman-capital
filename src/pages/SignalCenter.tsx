import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const tabs = ['Top 5 Opportunities', 'Trade Alerts', 'All Signals'] as const;

const SignalCenter = () => {
  const [active, setActive] = useState<(typeof tabs)[number]>('Top 5 Opportunities');

  return (
    <>
      <Helmet>
        <title>Signal Center | Trend Pulse</title>
        <meta name="description" content="High-confidence SMC setups with session focus and RRR ≥ 2:1." />
        <link rel="canonical" href="/signals" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">Signal Center</h1>
            <p className="text-muted-foreground">High-confidence SMC setups with London session focus and RRR ≥ 2:1.</p>
          </header>

          <div className="rounded-lg border border-border bg-card">
            <div className="grid grid-cols-3 gap-0 border-b border-border text-sm">
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

            <div className="p-6 space-y-6">
              {/* London Session Status */}
              <section className="rounded-lg border border-border bg-background/60">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Current Time</div>
                    <div className="text-lg font-semibold">15:14:49 <span className="text-muted-foreground">UTC</span></div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Next Open</div>
                    <div className="text-lg font-semibold">Aug 09, 10:00 UTC</div>
                  </div>
                  <span className="text-xs rounded-full px-2 py-1 border border-border text-primary">ACTIVE</span>
                </div>
              </section>

              {/* Top Opportunity Card */}
              {active === 'Top 5 Opportunities' && (
                <section className="rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">GBPJPY</span>
                      <span className="text-xs rounded-full px-2 py-0.5 border border-border">LONG</span>
                      <span className="text-xs rounded-full px-2 py-0.5 border border-border">H1</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Score: 10/10</div>
                  </div>

                  <div className="grid md:grid-cols-5 gap-6 p-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Entry Point</div>
                      <div className="text-primary font-semibold">185.94468</div>
                      <div className="text-xs text-muted-foreground">CHoCH + Order Block</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Stop Loss</div>
                      <div className="text-destructive font-semibold">185.60223</div>
                      <div className="text-xs text-muted-foreground">Invalidation Level</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Take Profit</div>
                      <div className="text-primary font-semibold">186.77498</div>
                      <div className="text-xs text-muted-foreground">Target Level</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Risk-Reward</div>
                      <div className="text-primary font-semibold">2.42:1</div>
                      <div className="text-xs text-muted-foreground">Minimum 3:1</div>
                    </div>
                    <div className="flex items-center justify-end">
                      <button className="px-3 py-2 rounded-md border border-border">Enable Alerts</button>
                    </div>
                  </div>

                  <div className="p-6 border-t border-border text-sm text-muted-foreground">
                    <div className="font-medium text-foreground mb-2">Trade Rationale</div>
                    CHoCH + Order Block setup on GBPJPY H1 timeframe. Key confluence factors include: CHoCH Confirmed, Strong Order Block, Trend Alignment, Liquidity Session Alignment. Perfect session alignment detected.
                  </div>

                  <div className="grid md:grid-cols-4 gap-6 p-6 border-t border-border text-sm">
                    <div>
                      <div className="text-muted-foreground">Historical Win Rate</div>
                      <div className="text-foreground font-semibold">60.8%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg RRR</div>
                      <div className="text-foreground font-semibold">2.91</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Profit Factor</div>
                      <div className="text-foreground font-semibold">1.68</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Expectancy</div>
                      <div className="text-foreground font-semibold">1.378</div>
                    </div>
                  </div>
                </section>
              )}

              {active === 'Trade Alerts' && <p className="text-muted-foreground">Your configured trade alerts will show here.</p>}
              {active === 'All Signals' && <p className="text-muted-foreground">All generated signals will list here.</p>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignalCenter;
