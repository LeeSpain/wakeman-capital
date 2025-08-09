import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

interface OandaAccountData {
  balance: number;
  equity: number;
  margin_used: number;
  margin_available: number;
  currency: string;
  environment: 'demo' | 'live';
  trades: any[];
}

export const useOandaAccount = () => {
  const { user } = useAuth();
  const [data, setData] = useState<OandaAccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async () => {
    if (!user) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('oanda-account', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;
      
      if (result.error) {
        throw new Error(result.error);
      }

      const account = result.account;
      setData({
        balance: parseFloat(account.balance),
        equity: parseFloat(account.equity || account.balance),
        margin_used: parseFloat(account.marginUsed || 0),
        margin_available: parseFloat(account.marginAvailable || account.balance),
        currency: account.currency,
        environment: result.environment,
        trades: result.trades || [],
      });
    } catch (err) {
      console.error('Error fetching OANDA account:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch account data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const placeOrder = async (orderData: {
    symbol: string;
    direction: 'long' | 'short';
    units?: number;
    stopLoss?: number;
    takeProfit?: number;
    takeProfit2?: number;
    takeProfit3?: number;
    riskPercentage?: number; // % of balance to risk; if provided and units not set, server computes units
    signalId?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data: result, error } = await supabase.functions.invoke('oanda-order', {
      body: orderData,
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) throw error;
    if (result.error) throw new Error(result.error);

    // Refresh account data after placing order
    await fetchAccountData();
    
    return result;
  };

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return {
    data,
    loading,
    error,
    refetch: fetchAccountData,
    placeOrder,
  };
};