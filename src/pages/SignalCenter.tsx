import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTopOpportunities, useAllSignals } from '@/hooks/useSignals';
import { OpportunityCard } from '@/components/signals/OpportunityCard';
import { SignalsTable } from '@/components/signals/SignalsTable';
import { AlertsList } from '@/components/signals/AlertsList';

const tabs = ['Top 5 Opportunities', 'Trade Alerts', 'All Signals'] as const;

type Tab = typeof tabs[number]

function useLondonSessionStatus(now = new Date()) {
  const utcHour = now.getUTCHours()
  // Approx London session 08:00–17:00 UTC (simplified, ignores DST nuances)
  const isActive = utcHour >= 8 && utcHour < 17
  const currentTimeStr = `${now.toUTCString().split(' ')[4]} UTC`

  const nextOpen = useMemo(() => {
    const d = new Date(now)
    const hour = d.getUTCHours()
    if (hour >= 17) {
      d.setUTCDate(d.getUTCDate() + 1)
      d.setUTCHours(8, 0, 0, 0)
    } else if (hour < 8) {
      d.setUTCHours(8, 0, 0, 0)
    } else {
      // Already open, show close time instead
      d.setUTCHours(17, 0, 0, 0)
    }
    return d
  }, [now])

  const nextOpenLabel = `${nextOpen.toUTCString().slice(5, 16)}, ${String(nextOpen.getUTCHours()).padStart(2, '0')}:00 UTC`

  return { isActive, currentTimeStr, nextOpenLabel }
}

const SignalCenter = () => {
  const [active, setActive] = useState<Tab>('Top 5 Opportunities');
  const { data: topFive, loading: loadingTop } = useTopOpportunities()
  const { data: allSignals, loading: loadingAll } = useAllSignals()
  const { isActive, currentTimeStr, nextOpenLabel } = useLondonSessionStatus()

  return (
    <>
      <Helmet>
        <title>Signal Center | SMC Top 5 Opportunities</title>
        <meta name="description" content="Live SMC signals with London session focus. Top 5 opportunities, alerts, and all signals updated in real-time." />
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
                    <div className="text-lg font-semibold">{currentTimeStr}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{isActive ? 'Session Closes' : 'Next Open'}</div>
                    <div className="text-lg font-semibold">{nextOpenLabel}</div>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-1 border border-border ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{isActive ? 'ACTIVE' : 'CLOSED'}</span>
                </div>
              </section>

              {/* Top Opportunities */}
              {active === 'Top 5 Opportunities' && (
                <div className="space-y-6">
                  {loadingTop ? (
                    <p className="text-muted-foreground">Loading opportunities…</p>
                  ) : (
                    topFive.map(sig => (
                      <OpportunityCard key={sig.id} signal={sig} />
                    ))
                  )}
                </div>
              )}

              {/* Trade Alerts */}
              {active === 'Trade Alerts' && (
                <div>
                  <AlertsList />
                </div>
              )}

              {/* All Signals */}
              {active === 'All Signals' && (
                <SignalsTable signals={allSignals} loading={loadingAll} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignalCenter;
