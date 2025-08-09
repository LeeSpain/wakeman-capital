-- Create economic events table for high impact news tracking
CREATE TABLE public.economic_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_time TIMESTAMP WITH TIME ZONE NOT NULL,
  impact_level TEXT NOT NULL CHECK (impact_level IN ('high', 'medium', 'low')),
  affected_currencies TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  country TEXT,
  actual_value TEXT,
  forecast_value TEXT,
  previous_value TEXT,
  event_url TEXT,
  buffer_start TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (event_time - INTERVAL '30 minutes') STORED,
  buffer_end TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (event_time + INTERVAL '30 minutes') STORED,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.economic_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Economic events are viewable by everyone" 
ON public.economic_events 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage economic events" 
ON public.economic_events 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_economic_events_time ON public.economic_events(event_time);
CREATE INDEX idx_economic_events_impact ON public.economic_events(impact_level);
CREATE INDEX idx_economic_events_currencies ON public.economic_events USING GIN(affected_currencies);
CREATE INDEX idx_economic_events_buffer ON public.economic_events(buffer_start, buffer_end);

-- Create trigger for updated_at
CREATE TRIGGER update_economic_events_updated_at
BEFORE UPDATE ON public.economic_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();