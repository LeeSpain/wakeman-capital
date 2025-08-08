import { useEffect, useMemo, useRef, useState } from 'react';

export type AssetId = 'bitcoin' | 'ethereum' | 'solana';

export interface AssetMeta {
  id: AssetId;
  symbol: 'BTC' | 'ETH' | 'SOL';
  name: string;
}

export const ASSETS: AssetMeta[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
];

export interface PricesState {
  [key: string]: {
    usd: number;
    lastUpdated: number;
  };
}

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';

export function useMarketPrices(pollMs: number = 10000) {
  const [prices, setPrices] = useState<PricesState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fallbackRef = useRef<PricesState | null>(null);

  // Initialize fallback prices if needed
  useEffect(() => {
    if (!fallbackRef.current) {
      fallbackRef.current = {
        bitcoin: { usd: 65000, lastUpdated: Date.now() },
        ethereum: { usd: 3500, lastUpdated: Date.now() },
        solana: { usd: 150, lastUpdated: Date.now() },
      };
    }
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await fetch(COINGECKO_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mapped: PricesState = {
        bitcoin: { usd: data.bitcoin.usd, lastUpdated: Date.now() },
        ethereum: { usd: data.ethereum.usd, lastUpdated: Date.now() },
        solana: { usd: data.solana.usd, lastUpdated: Date.now() },
      };
      setPrices(mapped);
      setError(null);
    } catch (e: any) {
      // Fallback to a gentle random walk around last known or default values
      const prev = Object.keys(prices).length ? prices : fallbackRef.current!;
      const drifted: PricesState = Object.fromEntries(
        Object.entries(prev).map(([k, v]) => {
          const noise = (Math.random() - 0.5) * 0.01; // ±1%
          const next = Math.max(0.01, v.usd * (1 + noise));
          return [k, { usd: Number(next.toFixed(2)), lastUpdated: Date.now() }];
        })
      );
      setPrices(drifted);
      setError(e?.message ?? 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, pollMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs]);

  const getPrice = (assetId: AssetId) => prices[assetId]?.usd ?? null;

  const lastUpdated = useMemo(() => {
    const times = Object.values(prices).map((p) => p.lastUpdated);
    return times.length ? Math.max(...times) : null;
  }, [prices]);

  return { prices, getPrice, loading, error, lastUpdated };
}
