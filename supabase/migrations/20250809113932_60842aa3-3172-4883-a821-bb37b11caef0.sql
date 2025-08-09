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

-- Create trigger for updated_at
CREATE TRIGGER update_economic_events_updated_at
BEFORE UPDATE ON public.economic_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if current time is within news buffer
CREATE OR REPLACE FUNCTION public.is_within_news_buffer()
RETURNS TABLE (
  event_id UUID,
  event_name TEXT,
  event_time TIMESTAMP WITH TIME ZONE,
  impact_level TEXT,
  affected_currencies TEXT[],
  minutes_until_event INTEGER
) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    id,
    event_name,
    event_time,
    impact_level,
    affected_currencies,
    EXTRACT(EPOCH FROM (event_time - now())) / 60 AS minutes_until_event
  FROM public.economic_events
  WHERE is_active = true
    AND impact_level = 'high'
    AND event_time >= now() - INTERVAL '30 minutes'
    AND event_time <= now() + INTERVAL '2 hours'
  ORDER BY event_time ASC;
$$;