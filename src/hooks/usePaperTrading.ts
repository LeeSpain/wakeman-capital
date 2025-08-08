import { useCallback, useEffect, useMemo, useState } from 'react';
// Removed dependency on ASSETS; allow dynamic asset IDs
export type AssetId = string;

const STORAGE_KEY = 'paper-trading-state-v1';

export interface Position {
  id: string;
  assetId: AssetId;
  symbol: string;
  qty: number;
  entryPrice: number;
  openedAt: string; // ISO
}

export interface ClosedTrade extends Position {
  closedAt: string; // ISO
  exitPrice: number;
  realizedPnl: number; // USD
}

export interface PaperState {
  balance: number; // USD
  positions: Position[];
  history: ClosedTrade[];
}

const defaultState: PaperState = {
  balance: 0,
  positions: [],
  history: [],
};

function loadState(): PaperState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed } as PaperState;
  } catch {
    return defaultState;
  }
}

function saveState(state: PaperState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePaperTrading(getPrice: (id: any) => number | null) {
  const [state, setState] = useState<PaperState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const deposit = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    setState((s) => ({ ...s, balance: Number((s.balance + amount).toFixed(2)) }));
    return true;
  }, []);


  const canAfford = (usdAmount: number) => Number.isFinite(usdAmount) && usdAmount > 0 && usdAmount <= state.balance;

  const buy = useCallback(
    (assetId: AssetId, usdAmount: number, symbol: string) => {
      if (!canAfford(usdAmount)) return { ok: false, error: 'Insufficient balance' } as const;
      const price = getPrice(assetId);
      if (!price) return { ok: false, error: 'Price unavailable' } as const;
      const qty = usdAmount / price;

      const pos: Position = {
        id: crypto.randomUUID(),
        assetId,
        symbol,
        qty: Number(qty.toFixed(6)),
        entryPrice: price,
        openedAt: new Date().toISOString(),
      };

      setState((s) => ({
        ...s,
        balance: Number((s.balance - usdAmount).toFixed(2)),
        positions: [pos, ...s.positions],
      }));

      return { ok: true, position: pos } as const;
    },
    [getPrice, state.balance]
  );

  const sell = useCallback(
    (positionId: string) => {
      const pos = state.positions.find((p) => p.id === positionId);
      if (!pos) return { ok: false, error: 'Position not found' } as const;
      const price = getPrice(pos.assetId);
      if (!price) return { ok: false, error: 'Price unavailable' } as const;

      const proceeds = pos.qty * price;
      const cost = pos.qty * pos.entryPrice;
      const realizedPnl = Number((proceeds - cost).toFixed(2));

      const closed: ClosedTrade = {
        ...pos,
        closedAt: new Date().toISOString(),
        exitPrice: price,
        realizedPnl,
      };

      setState((s) => ({
        balance: Number((s.balance + proceeds).toFixed(2)),
        positions: s.positions.filter((p) => p.id !== positionId),
        history: [closed, ...s.history],
      }));

      return { ok: true, trade: closed } as const;
    },
    [getPrice, state.positions]
  );
 
   const sellPartial = useCallback(
     (positionId: string, qty: number) => {
       const pos = state.positions.find((p) => p.id === positionId);
       if (!pos) return { ok: false, error: 'Position not found' } as const;
       if (!Number.isFinite(qty) || qty <= 0) return { ok: false, error: 'Invalid quantity' } as const;
       if (qty > pos.qty) return { ok: false, error: 'Quantity exceeds position' } as const;
       const price = getPrice(pos.assetId);
       if (!price) return { ok: false, error: 'Price unavailable' } as const;
 
       const proceeds = qty * price;
       const cost = qty * pos.entryPrice;
       const realizedPnl = Number((proceeds - cost).toFixed(2));
 
       const closed: ClosedTrade = {
         ...pos,
         qty: Number(qty.toFixed(6)),
         closedAt: new Date().toISOString(),
         exitPrice: price,
         realizedPnl,
       };
 
       setState((s) => {
         const remainingQty = Number((pos.qty - qty).toFixed(6));
         const positions = remainingQty > 0
           ? s.positions.map((p) => (p.id === positionId ? { ...p, qty: remainingQty } : p))
           : s.positions.filter((p) => p.id !== positionId);
         return {
           balance: Number((s.balance + proceeds).toFixed(2)),
           positions,
           history: [closed, ...s.history],
         };
       });
 
       return { ok: true, trade: closed } as const;
     },
     [getPrice, state.positions]
   );
 
   const equity = useMemo(() => {
    const positionsValue = state.positions.reduce((sum, p) => {
      const price = getPrice(p.assetId) ?? p.entryPrice;
      return sum + p.qty * price;
    }, 0);
    return Number((state.balance + positionsValue).toFixed(2));
  }, [state.balance, state.positions, getPrice]);

  const unrealizedPnl = useMemo(() => {
    return state.positions.reduce((sum, p) => {
      const price = getPrice(p.assetId) ?? p.entryPrice;
      return sum + p.qty * (price - p.entryPrice);
    }, 0);
  }, [state.positions, getPrice]);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  return {
     state,
     deposit,
     buy,
     sell,
     sellPartial,
     equity: Number(equity.toFixed(2)),
     unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
     reset,
   };
 }
