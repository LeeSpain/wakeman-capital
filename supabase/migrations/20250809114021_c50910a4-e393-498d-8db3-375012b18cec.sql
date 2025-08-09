-- Fix the function security issue by setting search_path
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
SECURITY DEFINER
SET search_path TO ''
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