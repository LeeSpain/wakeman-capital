import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { useMarketPrices, ASSETS, AssetId, AssetMeta } from '../hooks/useMarketPrices';
import { usePaperTrading, Position, ClosedTrade } from '../hooks/usePaperTrading';

const Currency: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <span className={className}>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
);

const Section: React.FC<React.PropsWithChildren<{ title: string; sub?: string }>> = ({ title, sub, children }) => (
  <section className="rounded-xl border border-border bg-card p-6">
    <h2 className="text-2xl font-semibold text-card-foreground">{title}</h2>
    {sub ? <p className="text-sm text-muted-foreground mt-1">{sub}</p> : null}
    <div className="mt-4">{children}</div>
  </section>
);

const PaperTrading: React.FC = () => {
  const { prices, getPrice, loading, error, lastUpdated } = useMarketPrices(10000);
  const { state, deposit, withdraw, buy, sell, equity, unrealizedPnl, reset } = usePaperTrading(getPrice);

  const [depositAmount, setDepositAmount] = useState('1000');
  const [buyAmounts, setBuyAmounts] = useState<Record<AssetId, string>>({
    bitcoin: '100',
    ethereum: '100',
    solana: '100',
  });

  const handleDeposit = () => {
    const amt = Number(depositAmount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    deposit(amt);
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    const amt = Number(depositAmount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    const ok = withdraw(amt);
    if (ok) setDepositAmount('');
  };
  const handleBuy = (assetId: AssetId) => {
    const amt = Number(buyAmounts[assetId]);
    if (!Number.isFinite(amt) || amt <= 0) return;
    const res = buy(assetId, amt);
    if (res.ok) {
      setBuyAmounts((s) => ({ ...s, [assetId]: '' }));
    }
  };

  const lastUpdatedText = useMemo(() => {
    if (!lastUpdated) return '—';
    const d = new Date(lastUpdated);
    return d.toLocaleTimeString();
  }, [lastUpdated]);

  const pnlChips = useMemo(() => {
    return state.positions.map((p) => {
      const price = getPrice(p.assetId) ?? p.entryPrice;
      const pnl = p.qty * (price - p.entryPrice);
      const val = Number(pnl.toFixed(2));
      const sign = val >= 0 ? '+' : '−';
      const formatted = `${sign}$${Math.abs(val).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      return { id: p.id, symbol: p.symbol, value: val, label: `${p.symbol} ${formatted}` };
    });
  }, [state.positions, getPrice]);

  return (
    <>
      <Helmet>
        <title>Paper Trading Demo | Wakeman Capital</title>
        <meta name="description" content="Practice trading with a virtual wallet and real-time crypto prices." />
        <link rel="canonical" href="/paper" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <header>
            <h1 className="text-3xl font-bold text-foreground">Paper Trading Demo</h1>
            <p className="text-muted-foreground mt-1">
              Learn by doing—risk-free. Deposit virtual USD, buy crypto assets, and track your PnL in real time.
            </p>
          </header>

          {/* Live PnL Overview */}
          {state.positions.length > 0 && (
            <div className="rounded-lg border border-border bg-card/60 p-3 flex items-center gap-3 overflow-x-auto">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                <span className="relative flex h-2 w-2"><span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-primary/40" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
                Live PnL
              </span>
              <div className="flex items-center gap-2">
                {pnlChips.map((c) => (
                  <span
                    key={c.id}
                    className={`px-2 py-1 rounded-full text-xs border border-border bg-background whitespace-nowrap ${c.value >= 0 ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--destructive))]'}`}
                    title={c.label}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Section title="Wallet" sub="Demo-only funds. No real money involved.">
              <div className="flex items-end gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="text-2xl font-semibold"><Currency value={state.balance} /></div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Equity</div>
                  <div className="text-2xl font-semibold"><Currency value={equity} /></div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Unrealized PnL</div>
                  <div className={`text-2xl font-semibold ${unrealizedPnl >= 0 ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--destructive))]'}`}>
                    <Currency value={unrealizedPnl} />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  min={0}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Amount (USD)"
                  className="w-full sm:w-64 rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                />
                <Button onClick={handleDeposit} disabled={!Number.isFinite(Number(depositAmount)) || Number(depositAmount) <= 0}>Deposit</Button>
                <Button variant="outline" onClick={handleWithdraw} disabled={!Number.isFinite(Number(depositAmount)) || Number(depositAmount) <= 0 || Number(depositAmount) > state.balance}>Withdraw</Button>
                <Button variant="secondary" onClick={reset}>Reset</Button>
              </div>
            </Section>

            <Section title="Market" sub={`Live prices • Updated: ${lastUpdatedText}`}>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading prices…</p>
              ) : (
                <ul className="divide-y divide-border">
                  {ASSETS.map((a: AssetMeta) => {
                    const price = prices[a.id]?.usd ?? null;
                    return (
                      <li key={a.id} className="py-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">{a.symbol} · {a.name}</div>
                          <div className="text-sm text-muted-foreground">{price ? `$${price.toLocaleString()}` : '—'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            step="10"
                            value={buyAmounts[a.id]}
                            onChange={(e) => setBuyAmounts((s) => ({ ...s, [a.id]: e.target.value }))}
                            placeholder="USD"
                            className="w-28 rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
                          />
                          <Button onClick={() => handleBuy(a.id)}>Buy</Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              {error ? <p className="text-xs text-muted-foreground mt-2">Price feed fallback active: {error}</p> : null}
            </Section>

            <Section title="Open Positions" sub="Your current holdings and unrealized PnL.">
              {state.positions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No positions yet. Buy from the Market to open one.</p>
              ) : (
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full text-sm">
                    <thead className="bg-card border-b border-border text-left">
                      <tr>
                        <th className="py-3 px-4">Asset</th>
                        <th className="py-3 px-4">Qty</th>
                        <th className="py-3 px-4">Entry</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Unrealized</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.positions.map((p: Position) => {
                        const price = getPrice(p.assetId) ?? p.entryPrice;
                        const pnl = p.qty * (price - p.entryPrice);
                        const pnlPct = ((price - p.entryPrice) / p.entryPrice) * 100;
                        return (
                          <tr key={p.id} className="border-t border-border">
                            <td className="py-3 px-4 font-medium">{p.symbol}</td>
                            <td className="py-3 px-4">{p.qty}</td>
                            <td className="py-3 px-4">${p.entryPrice.toLocaleString()}</td>
                            <td className="py-3 px-4">${price.toLocaleString()}</td>
                            <td className={`py-3 px-4 ${pnl >= 0 ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--destructive))]'}`}>
                              <Currency value={Number(pnl.toFixed(2))} />
                              <span className="text-xs text-muted-foreground ml-2">{pnlPct.toFixed(2)}%</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="outline" onClick={() => sell(p.id)}>Sell</Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </div>

          <Section title="Closed Trades" sub="Realized PnL from your closed positions.">
            {state.history.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't closed any positions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-card border-b border-border text-left">
                    <tr>
                      <th className="py-3 px-4">Asset</th>
                      <th className="py-3 px-4">Qty</th>
                      <th className="py-3 px-4">Entry</th>
                      <th className="py-3 px-4">Exit</th>
                      <th className="py-3 px-4">Realized PnL</th>
                      <th className="py-3 px-4">Opened</th>
                      <th className="py-3 px-4">Closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.history.map((t: ClosedTrade) => (
                      <tr key={t.id} className="border-t border-border">
                        <td className="py-3 px-4 font-medium">{t.symbol}</td>
                        <td className="py-3 px-4">{t.qty}</td>
                        <td className="py-3 px-4">${t.entryPrice.toLocaleString()}</td>
                        <td className="py-3 px-4">${t.exitPrice.toLocaleString()}</td>
                        <td className={`py-3 px-4 ${t.realizedPnl >= 0 ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--destructive))]'}`}>
                          <Currency value={t.realizedPnl} />
                        </td>
                        <td className="py-3 px-4">{new Date(t.openedAt).toLocaleString()}</td>
                        <td className="py-3 px-4">{new Date(t.closedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </div>
      </main>

      {/* Structured data for SEO: FAQ-like context about paper trading */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is paper trading?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Paper trading lets you practice buying and selling assets with virtual money to learn before risking real capital.',
              },
            },
            {
              '@type': 'Question',
              name: 'Which assets are available?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Bitcoin (BTC), Ethereum (ETH), and Solana (SOL) with live USD prices.',
              },
            },
          ],
        })}
      </script>
    </>
  );
};

export default PaperTrading;
