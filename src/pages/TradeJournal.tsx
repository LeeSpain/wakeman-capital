import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import { useUserTrades } from '../hooks/useTrades';
import { TradeForm } from '../components/trades/TradeForm';
import { TradesTable } from '../components/trades/TradesTable';

const TradeJournal = () => {
  const { user } = useAuth();
  const { trades, loading, error, addTrade, deleteTrade } = useUserTrades(user?.id ?? null);
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = useCallback(async (input: Parameters<typeof addTrade>[0]) => {
    if (!user) {
      alert('Please sign in to add trades to your journal.');
      return;
    }
    try {
      setSubmitting(true)
      await addTrade(input)
    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : 'Failed to add trade')
    } finally {
      setSubmitting(false)
    }
  }, [addTrade, user])

  const handleDelete = useCallback(async (id: string) => {
    if (!user) return
    try {
      await deleteTrade(id)
    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : 'Failed to delete trade')
    }
  }, [deleteTrade, user])

  return (
    <>
      <Helmet>
        <title>Trade Journal | Wakeman Capital</title>
        <meta name="description" content="Live trade journal to record and review your SMC trades with P/L, R:R and notes." />
        <link rel="canonical" href="/journal" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Trade Journal</h1>
            <p className="text-muted-foreground">Track your performance and learn from each trade.</p>
          </header>

          {!user && (
            <div className="mb-6 rounded-md border border-border p-4 bg-card text-sm text-muted-foreground">
              Sign in to create and manage your personal trade journal.
            </div>
          )}

          {user && (
            <div className="mb-6">
              <TradeForm onSubmit={handleAdd} />
            </div>
          )}

          <section className="rounded-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-card-foreground">Recent Trades</h2>
              {loading && <span className="text-xs text-muted-foreground">Loading…</span>}
            </div>
            {error && <p className="text-destructive text-sm mb-3">{error}</p>}
            <TradesTable trades={trades} canEdit={!!user} onDelete={handleDelete} />
          </section>
        </div>
      </main>
    </>
  );
};

export default TradeJournal;
