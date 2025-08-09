import React from 'react';
import { useRealMarketData } from '../../hooks/useRealMarketData';

export const MarketDataStatus: React.FC = () => {
  const { marketData, loading, error, lastUpdated, refreshMarketData } = useRealMarketData();

  const handleRefresh = async () => {
    await refreshMarketData();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-card-foreground">Market Data Status</h4>
          <div className="text-xs text-muted-foreground mt-1">
            {loading ? (
              'Updating market data...'
            ) : error ? (
              <span className="text-destructive">Error: {error}</span>
            ) : (
              <>
                {marketData.length > 0 ? (
                  <>
                    <span className="text-green-500">●</span> Live data active ({marketData.length} data points)
                    {lastUpdated && (
                      <div>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</div>
                    )}
                  </>
                ) : (
                  <span className="text-yellow-500">●</span> Initializing market data...
                )}
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-3 py-1 text-xs rounded border border-border hover:bg-muted disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Refresh'}
        </button>
      </div>
      
      {marketData.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Active Symbols:</span>
            <div className="font-mono">
              {(() => {
                const symbols = [...new Set(marketData.map(d => d.symbol))];
                const displayed = symbols.slice(0, 6).join(', ');
                return displayed + (symbols.length > 6 ? '...' : '');
              })()}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Timeframes:</span>
            <div className="font-mono">
              {[...new Set(marketData.map(d => d.timeframe))].join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};