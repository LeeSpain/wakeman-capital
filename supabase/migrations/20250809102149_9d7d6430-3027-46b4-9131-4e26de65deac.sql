-- Create AI Coach Sources table for persisting user-provided sources
-- This enables the coach to recall sources per user and control activation

-- 1) Table
CREATE TABLE IF NOT EXISTS public.ai_coach_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Enable RLS
ALTER TABLE public.ai_coach_sources ENABLE ROW LEVEL SECURITY;

-- 3) Policies (owner access + admin override via has_role)
DROP POLICY IF EXISTS "Users can view their own ai_coach_sources" ON public.ai_coach_sources;
CREATE POLICY "Users can view their own ai_coach_sources"
ON public.ai_coach_sources
FOR SELECT
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can insert their own ai_coach_sources" ON public.ai_coach_sources;
CREATE POLICY "Users can insert their own ai_coach_sources"
ON public.ai_coach_sources
FOR INSERT
WITH CHECK ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can update their own ai_coach_sources" ON public.ai_coach_sources;
CREATE POLICY "Users can update their own ai_coach_sources"
ON public.ai_coach_sources
FOR UPDATE
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can delete their own ai_coach_sources" ON public.ai_coach_sources;
CREATE POLICY "Users can delete their own ai_coach_sources"
ON public.ai_coach_sources
FOR DELETE
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

-- 4) Updated-at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_ai_coach_sources_updated_at ON public.ai_coach_sources;
CREATE TRIGGER trg_ai_coach_sources_updated_at
BEFORE UPDATE ON public.ai_coach_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Helpful index for per-user lookups
CREATE INDEX IF NOT EXISTS idx_ai_coach_sources_user_active
ON public.ai_coach_sources (user_id, is_active);
