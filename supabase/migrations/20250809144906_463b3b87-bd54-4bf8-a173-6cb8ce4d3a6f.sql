-- 1) Create admin_whitelist table if not exists
create table if not exists public.admin_whitelist (
  email text primary key,
  created_at timestamptz not null default now()
);

-- 2) Enable Row Level Security
alter table public.admin_whitelist enable row level security;

-- 3) Create RLS policies for admins (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'admin_whitelist' AND policyname = 'Admins can view admin_whitelist'
  ) THEN
    CREATE POLICY "Admins can view admin_whitelist"
    ON public.admin_whitelist
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'admin_whitelist' AND policyname = 'Admins can insert admin_whitelist'
  ) THEN
    CREATE POLICY "Admins can insert admin_whitelist"
    ON public.admin_whitelist
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'admin_whitelist' AND policyname = 'Admins can update admin_whitelist'
  ) THEN
    CREATE POLICY "Admins can update admin_whitelist"
    ON public.admin_whitelist
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'admin_whitelist' AND policyname = 'Admins can delete admin_whitelist'
  ) THEN
    CREATE POLICY "Admins can delete admin_whitelist"
    ON public.admin_whitelist
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- 4) Ensure the signup trigger exists to call public.handle_new_user()
-- Drop and recreate to guarantee correct linkage
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5) Seed admin whitelist with the primary admin email (idempotent)
INSERT INTO public.admin_whitelist (email)
VALUES ('wakemancapitallive@gmail.com')
ON CONFLICT DO NOTHING;