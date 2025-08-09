-- Add multiple take profit levels to signals_detailed table
ALTER TABLE signals_detailed 
ADD COLUMN take_profit_2 NUMERIC,
ADD COLUMN take_profit_3 NUMERIC;

-- Add risk percentage and lot size calculation fields to oanda_trades
ALTER TABLE oanda_trades 
ADD COLUMN risk_percentage NUMERIC DEFAULT 1.0,
ADD COLUMN calculated_lot_size NUMERIC,
ADD COLUMN take_profit_2 NUMERIC,
ADD COLUMN take_profit_3 NUMERIC,
ADD COLUMN partial_close_tp1 BOOLEAN DEFAULT false,
ADD COLUMN partial_close_tp2 BOOLEAN DEFAULT false,
ADD COLUMN breakeven_moved BOOLEAN DEFAULT false;

-- Create position management events table for tracking TP hits and SL moves
CREATE TABLE position_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'tp1_hit', 'tp2_hit', 'tp3_hit', 'sl_moved', 'position_closed'
  event_data JSONB DEFAULT '{}',
  price_at_event NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on position_events
ALTER TABLE position_events ENABLE ROW LEVEL SECURITY;

-- Create policies for position_events
CREATE POLICY "Users can view their own position events" 
ON position_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM oanda_trades 
  WHERE oanda_trades.id = position_events.trade_id 
  AND oanda_trades.user_id = auth.uid()
));

CREATE POLICY "System can create position events" 
ON position_events 
FOR INSERT 
WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_position_events_trade_id ON position_events(trade_id);
CREATE INDEX idx_oanda_trades_status ON oanda_trades(status, user_id);