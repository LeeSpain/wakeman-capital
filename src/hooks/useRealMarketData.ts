import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface MarketDataPoint {
  id: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
  timeframe: string;
  source: string;
}

export const useRealMarketData = () => {
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      const { data, error } = await supabase
        .from('market_data_realtime')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      setMarketData(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshMarketData = async () => {
    try {
      setLoading(true);
      
      // Call the market data fetcher edge function
      const { data, error } = await supabase.functions.invoke('market-data-fetcher');
      
      if (error) throw error;
      
      console.log('Market data refresh result:', data);
      
      // Fetch updated data
      await fetchMarketData();
      
    } catch (err: any) {
      setError(err.message);
      console.error('Error refreshing market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();

    // Set up real-time subscription
    const channel = supabase
      .channel('market-data-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'market_data_realtime' }, 
        () => {
          fetchMarketData();
        }
      )
      .subscribe();

    // Auto-refresh market data every 5 minutes
    const interval = setInterval(refreshMarketData, 5 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const getLatestPrice = (symbol: string) => {
    const latest = marketData
      .filter(d => d.symbol === symbol)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return latest?.close || null;
  };

  const getSymbolData = (symbol: string, timeframe: string = '4h') => {
    return marketData
      .filter(d => d.symbol === symbol && d.timeframe === timeframe)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  return {
    marketData,
    loading,
    error,
    refreshMarketData,
    getLatestPrice,
    getSymbolData,
    lastUpdated: marketData.length > 0 ? marketData[0].timestamp : null
  };
};