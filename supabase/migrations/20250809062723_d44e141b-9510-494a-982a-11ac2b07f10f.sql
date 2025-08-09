-- Add unique constraint to market_data_realtime table to enable upsert operations
ALTER TABLE public.market_data_realtime 
ADD CONSTRAINT market_data_realtime_symbol_timeframe_timestamp_key 
UNIQUE (symbol, timeframe, timestamp);

-- Create index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_market_data_realtime_symbol_timeframe 
ON public.market_data_realtime (symbol, timeframe);

-- Create index for timestamp queries
CREATE INDEX IF NOT EXISTS idx_market_data_realtime_timestamp 
ON public.market_data_realtime (timestamp DESC);