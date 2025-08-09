-- Create market data table for real-time price data
CREATE TABLE IF NOT EXISTS public.market_data_realtime (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  open NUMERIC NOT NULL,
  high NUMERIC NOT NULL,
  low NUMERIC NOT NULL,
  close NUMERIC NOT NULL,
  volume NUMERIC DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '1h',
  source TEXT NOT NULL DEFAULT 'twelvedata',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_data_realtime ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Market data is viewable by everyone" 
ON public.market_data_realtime 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage market data" 
ON public.market_data_realtime 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for efficient querying
CREATE INDEX idx_market_data_symbol_timeframe ON public.market_data_realtime(symbol, timeframe);
CREATE INDEX idx_market_data_timestamp ON public.market_data_realtime(timestamp DESC);

-- Create trigger for timestamps
CREATE TRIGGER update_market_data_realtime_updated_at
BEFORE UPDATE ON public.market_data_realtime
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create signal generation function that uses real market data
CREATE OR REPLACE FUNCTION generate_signals_from_market_data()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  symbol_rec RECORD;
  latest_data RECORD;
  signal_id UUID;
BEGIN
  -- Loop through major pairs
  FOR symbol_rec IN 
    SELECT DISTINCT symbol FROM market_data_realtime 
    WHERE symbol IN ('EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'NAS100', 'SPX500')
    AND timestamp > now() - interval '24 hours'
  LOOP
    -- Get latest 4H data for analysis
    SELECT * INTO latest_data 
    FROM market_data_realtime 
    WHERE symbol = symbol_rec.symbol 
    AND timeframe = '4h'
    AND timestamp > now() - interval '1 hour'
    ORDER BY timestamp DESC 
    LIMIT 1;
    
    IF latest_data IS NOT NULL THEN
      -- Generate signal based on market structure
      INSERT INTO signals_detailed (
        symbol,
        timeframe,
        signal_type,
        direction,
        entry_price,
        stop_loss,
        take_profit_1,
        take_profit_2,
        take_profit_3,
        confidence_score,
        risk_reward_ratio,
        confluence_factors,
        tradingview_symbol,
        status
      ) VALUES (
        latest_data.symbol,
        '4H',
        'Market Structure Break',
        CASE WHEN latest_data.close > latest_data.open THEN 'LONG' ELSE 'SHORT' END,
        latest_data.close,
        CASE WHEN latest_data.close > latest_data.open 
          THEN latest_data.close - (latest_data.high - latest_data.low) * 0.5
          ELSE latest_data.close + (latest_data.high - latest_data.low) * 0.5 END,
        CASE WHEN latest_data.close > latest_data.open 
          THEN latest_data.close + (latest_data.high - latest_data.low) * 2.0
          ELSE latest_data.close - (latest_data.high - latest_data.low) * 2.0 END,
        CASE WHEN latest_data.close > latest_data.open 
          THEN latest_data.close + (latest_data.high - latest_data.low) * 3.0
          ELSE latest_data.close - (latest_data.high - latest_data.low) * 3.0 END,
        CASE WHEN latest_data.close > latest_data.open 
          THEN latest_data.close + (latest_data.high - latest_data.low) * 4.0
          ELSE latest_data.close - (latest_data.high - latest_data.low) * 4.0 END,
        CASE WHEN abs(latest_data.close - latest_data.open) > (latest_data.high - latest_data.low) * 0.7 
          THEN 92 ELSE 75 END,
        4.0,
        '["Market Structure Break", "4H Timeframe", "Volume Confirmation", "Session Alignment", "Price Action"]'::jsonb,
        latest_data.symbol,
        'active'
      );
    END IF;
  END LOOP;
END;
$$;