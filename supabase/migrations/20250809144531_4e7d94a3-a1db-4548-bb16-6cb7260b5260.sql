-- Admin whitelist + enhanced handle_new_user + trigger

-- 1) Create admin_whitelist table
CREATE TABLE IF NOT EXISTS public.admin_whitelist (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Ensure helper tables referenced exist (no changes here) and update handle_new_user to respect preferred_currency and whitelist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Create profile with preferred currency coming from user metadata if present
  INSERT INTO public.profiles (id, display_name, preferred_currency)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'preferred_currency', 'AUD')
  )
  ON CONFLICT (id) DO UPDATE
    SET 
      display_name = EXCLUDED.display_name,
      preferred_currency = EXCLUDED.preferred_currency,
      updated_at = now();
  
  -- Create default wallet using preferred currency (if wallets table exists)
  INSERT INTO public.wallets (user_id, currency, balance)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'preferred_currency', 'AUD'), 0)
  ON CONFLICT DO NOTHING;
  
  -- Assign default user role (idempotent)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- If user is whitelisted, grant admin and premium access
  IF EXISTS (SELECT 1 FROM public.admin_whitelist WHERE lower(email) = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    UPDATE public.profiles 
      SET access_level = 'premium', payment_status = 'paid', updated_at = now()
      WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3) Create trigger on auth.users if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created' 
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 4) Seed whitelist with the confirmed admin email
INSERT INTO public.admin_whitelist (email)
VALUES ('wakemancapitallive@gmail.com')
ON CONFLICT (email) DO NOTHING;
