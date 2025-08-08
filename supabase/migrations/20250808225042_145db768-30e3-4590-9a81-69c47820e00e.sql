-- Enhance signals_detailed table for TradingView integration
ALTER TABLE public.signals_detailed 
ADD COLUMN tradingview_symbol text,
ADD COLUMN supply_zones jsonb DEFAULT '[]'::jsonb,
ADD COLUMN demand_zones jsonb DEFAULT '[]'::jsonb,
ADD COLUMN order_blocks jsonb DEFAULT '[]'::jsonb,
ADD COLUMN imbalances_data jsonb DEFAULT '[]'::jsonb,
ADD COLUMN choch_levels jsonb DEFAULT '[]'::jsonb,
ADD COLUMN higher_tf_context jsonb DEFAULT '{}'::jsonb,
ADD COLUMN trade_rationale text,
ADD COLUMN chart_template text DEFAULT 'TradingPlan2.0';

-- Create chart_annotations table for detailed level storage
CREATE TABLE public.chart_annotations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_id uuid NOT NULL REFERENCES public.signals_detailed(id) ON DELETE CASCADE,
  annotation_type text NOT NULL, -- 'supply_zone', 'demand_zone', 'order_block', 'imbalance', 'choch'
  timeframe text NOT NULL,
  price_high numeric NOT NULL,
  price_low numeric NOT NULL,
  formed_at timestamp with time zone NOT NULL,
  strength numeric DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on chart_annotations
ALTER TABLE public.chart_annotations ENABLE ROW LEVEL SECURITY;

-- Create policies for chart_annotations
CREATE POLICY "Chart annotations are viewable by everyone" 
ON public.chart_annotations 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage chart annotations" 
ON public.chart_annotations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_chart_annotations_signal_id ON public.chart_annotations(signal_id);
CREATE INDEX idx_chart_annotations_type_timeframe ON public.chart_annotations(annotation_type, timeframe);

-- Update existing signals with TradingView symbols
UPDATE public.signals_detailed 
SET tradingview_symbol = CASE 
  WHEN symbol = 'EURUSD' THEN 'FX:EURUSD'
  WHEN symbol = 'GBPUSD' THEN 'FX:GBPUSD'
  WHEN symbol = 'USDJPY' THEN 'FX:USDJPY'
  WHEN symbol = 'GBPJPY' THEN 'FX:GBPJPY'
  WHEN symbol = 'XAUUSD' THEN 'TVC:GOLD'
  WHEN symbol = 'NAS100' THEN 'TVC:NDX'
  WHEN symbol = 'US30' THEN 'TVC:DJI'
  WHEN symbol = 'SPX500' THEN 'TVC:SPX'
  ELSE 'FX:' || symbol
END;