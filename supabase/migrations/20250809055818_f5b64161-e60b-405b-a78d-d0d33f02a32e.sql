-- Create market_data_realtime table with proper structure
CREATE TABLE public.market_data_realtime (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  open NUMERIC NOT NULL,
  high NUMERIC NOT NULL,
  low NUMERIC NOT NULL,
  close NUMERIC NOT NULL,
  volume NUMERIC DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  timeframe TEXT NOT NULL,
  source TEXT DEFAULT 'generated',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_market_data_realtime_symbol_timeframe ON public.market_data_realtime(symbol, timeframe);
CREATE INDEX idx_market_data_realtime_timestamp ON public.market_data_realtime(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.market_data_realtime ENABLE ROW LEVEL SECURITY;

-- Create policies for market data access
CREATE POLICY "Admin can manage market data realtime" 
ON public.market_data_realtime 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Market data realtime is viewable by everyone" 
ON public.market_data_realtime 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_market_data_realtime_updated_at
BEFORE UPDATE ON public.market_data_realtime
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the table
ALTER TABLE public.market_data_realtime REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_data_realtime;