-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Policies for videos
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'videos' AND policyname = 'Public can view published videos'
  ) THEN
    CREATE POLICY "Public can view published videos"
      ON public.videos
      FOR SELECT
      USING (is_published = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'videos' AND policyname = 'Admins can manage videos'
  ) THEN
    CREATE POLICY "Admins can manage videos"
      ON public.videos
      FOR ALL
      USING (has_role(auth.uid(), 'admin'))
      WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Trigger to keep updated_at fresh
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_videos_updated_at'
  ) THEN
    CREATE TRIGGER trg_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- Create videos_settings table
CREATE TABLE IF NOT EXISTS public.videos_settings (
  key TEXT PRIMARY KEY,
  nav_label TEXT NOT NULL DEFAULT 'Videos',
  page_title TEXT NOT NULL DEFAULT 'How‑to Videos',
  page_description TEXT,
  show_in_nav BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.videos_settings ENABLE ROW LEVEL SECURITY;

-- Policies for videos_settings
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'videos_settings' AND policyname = 'Settings are viewable by everyone'
  ) THEN
    CREATE POLICY "Settings are viewable by everyone"
      ON public.videos_settings
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'videos_settings' AND policyname = 'Admins can manage video settings'
  ) THEN
    CREATE POLICY "Admins can manage video settings"
      ON public.videos_settings
      FOR ALL
      USING (has_role(auth.uid(), 'admin'))
      WITH CHECK (has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Trigger to keep updated_at fresh
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_videos_settings_updated_at'
  ) THEN
    CREATE TRIGGER trg_videos_settings_updated_at
    BEFORE UPDATE ON public.videos_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Seed a default settings row if missing
INSERT INTO public.videos_settings (key, nav_label, page_title, page_description, show_in_nav)
VALUES ('default', 'Videos', 'How‑to Videos', 'Short tutorials to get the most out of the platform.', true)
ON CONFLICT (key) DO NOTHING;