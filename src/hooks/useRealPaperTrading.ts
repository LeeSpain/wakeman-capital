import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import { useRealMarketData } from './useRealMarketData';

export interface Position {
  id: string;
  user_id: string;
  symbol: string;
  qty: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  opened_at: string;
  created_at: string;
  updated_at: string;
}

export interface ClosedTrade extends Position {
  closed_at: string;
  exit_price: number;
  realized_pnl: number;
}

export interface PaperWallet {
  id: string;
  user_id: string;
  balance: number;
  total_equity: number;
  total_pnl: number;
  created_at: string;
  updated_at: string;
}

export function useRealPaperTrading() {
  const { user } = useAuth();
  const { getLatestPrice } = useRealMarketData();
  const [wallet, setWallet] = useState<PaperWallet | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [history, setHistory] = useState<ClosedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('paper_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Create initial wallet
      const { data: newWallet, error: createError } = await supabase
        .from('paper_wallets')
        .insert({
          user_id: user.id,
          balance: 10000,
          total_equity: 10000,
          total_pnl: 0
        })
        .select()
        .single();

      if (createError) {
        setError(createError.message);
      } else {
        setWallet(newWallet);
      }
    } else if (error) {
      setError(error.message);
    } else {
      setWallet(data);
    }
  }, [user]);

  const fetchPositions = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('paper_positions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPositions(data || []);
    }
  }, [user]);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('paper_trades_history')
      .select('*')
      .eq('user_id', user.id)
      .order('closed_at', { ascending: false })
      .limit(50);

    if (error) {
      setError(error.message);
    } else {
      setHistory(data || []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchWallet(), fetchPositions(), fetchHistory()]);
      setLoading(false);
    };

    loadData();
  }, [user, fetchWallet, fetchPositions, fetchHistory]);

  const buy = useCallback(async (symbol: string, usdAmount: number) => {
    if (!user || !wallet) return { ok: false, error: 'Not authenticated' };
    if (usdAmount > wallet.balance) return { ok: false, error: 'Insufficient balance' };
    
    const price = getLatestPrice(symbol);
    if (!price) return { ok: false, error: 'Price unavailable' };
    
    const qty = usdAmount / price;

    const { data, error } = await supabase
      .from('paper_positions')
      .insert({
        user_id: user.id,
        symbol,
        qty: Number(qty.toFixed(6)),
        entry_price: price,
        current_price: price,
        unrealized_pnl: 0,
        opened_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    // Update wallet balance
    await supabase
      .from('paper_wallets')
      .update({ balance: wallet.balance - usdAmount })
      .eq('id', wallet.id);

    await fetchWallet();
    await fetchPositions();
    
    return { ok: true, position: data };
  }, [user, wallet, getLatestPrice, fetchWallet, fetchPositions]);

  const sell = useCallback(async (positionId: string) => {
    if (!user) return { ok: false, error: 'Not authenticated' };
    
    const position = positions.find(p => p.id === positionId);
    if (!position) return { ok: false, error: 'Position not found' };
    
    const price = getLatestPrice(position.symbol);
    if (!price) return { ok: false, error: 'Price unavailable' };

    const proceeds = position.qty * price;
    const cost = position.qty * position.entry_price;
    const realizedPnl = proceeds - cost;

    // Move to history
    const { error: historyError } = await supabase
      .from('paper_trades_history')
      .insert({
        ...position,
        closed_at: new Date().toISOString(),
        exit_price: price,
        realized_pnl: realizedPnl
      });

    if (historyError) {
      return { ok: false, error: historyError.message };
    }

    // Remove from positions
    const { error: deleteError } = await supabase
      .from('paper_positions')
      .delete()
      .eq('id', positionId);

    if (deleteError) {
      return { ok: false, error: deleteError.message };
    }

    // Update wallet
    if (wallet) {
      await supabase
        .from('paper_wallets')
        .update({ 
          balance: wallet.balance + proceeds,
          total_pnl: wallet.total_pnl + realizedPnl
        })
        .eq('id', wallet.id);
    }

    await fetchWallet();
    await fetchPositions();
    await fetchHistory();
    
    return { ok: true, realizedPnl };
  }, [user, positions, wallet, getLatestPrice, fetchWallet, fetchPositions, fetchHistory]);

  const reset = useCallback(async () => {
    if (!user || !wallet) return;

    // Clear positions and history
    await Promise.all([
      supabase.from('paper_positions').delete().eq('user_id', user.id),
      supabase.from('paper_trades_history').delete().eq('user_id', user.id)
    ]);

    // Reset wallet
    await supabase
      .from('paper_wallets')
      .update({
        balance: 10000,
        total_equity: 10000,
        total_pnl: 0
      })
      .eq('id', wallet.id);

    await fetchWallet();
    await fetchPositions();
    await fetchHistory();
  }, [user, wallet, fetchWallet, fetchPositions, fetchHistory]);

  return {
    wallet,
    positions,
    history,
    loading,
    error,
    buy,
    sell,
    reset,
    isAuthenticated: !!user
  };
}