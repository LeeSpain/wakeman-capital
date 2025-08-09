import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendData {
  symbol: string;
  trend_direction: string;
  confidence: number;
  analysis_timestamp: string;
}

const TrendPulse = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      const { data } = await supabase
        .from('trend_analysis')
        .select('symbol, trend_direction, confidence, analysis_timestamp')
        .order('analysis_timestamp', { ascending: false })
        .limit(6);
      
      setTrends(data || []);
      setLoading(false);
    };

    fetchTrends();

    const channel = supabase
      .channel('trend-analysis-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trend_analysis' }, () => {
        fetchTrends();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTrendIcon = (direction: string) => {
    if (direction === 'bullish') return <TrendingUp className="h-4 w-4 text-primary" />;
    if (direction === 'bearish') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="p-6 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Market Sentiment Analysis
      </h3>
      {loading ? (
        <p className="text-muted-foreground">Loading market sentiment...</p>
      ) : trends.length === 0 ? (
        <p className="text-muted-foreground">No trend analysis data available yet.</p>
      ) : (
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTrendIcon(trend.trend_direction)}
                <span className="font-medium">{trend.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground capitalize">
                  {trend.trend_direction}
                </span>
                <span className="text-xs px-2 py-1 rounded border border-border">
                  {Math.round(trend.confidence)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendPulse;