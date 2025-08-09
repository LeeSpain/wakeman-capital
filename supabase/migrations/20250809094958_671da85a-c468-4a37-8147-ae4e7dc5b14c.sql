-- Grant admin access to the account that just signed up with leewakeman@hotmail.co.uk
-- regardless of the password used

DO $$
DECLARE
  lee_user_id uuid;
BEGIN
  -- Find Lee's user ID by email
  SELECT id INTO lee_user_id 
  FROM auth.users 
  WHERE email = 'leewakeman@hotmail.co.uk';
  
  -- If account exists, grant admin privileges
  IF lee_user_id IS NOT NULL THEN
    -- Add admin role
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (lee_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Update profile to premium access
    INSERT INTO public.profiles (id, display_name, preferred_currency, access_level, payment_status)
    VALUES (lee_user_id, 'Lee Wakeman', 'GBP', 'premium', 'paid')
    ON CONFLICT (id) DO UPDATE SET
      access_level = 'premium',
      payment_status = 'paid',
      preferred_currency = 'GBP',
      display_name = 'Lee Wakeman';
      
    RAISE NOTICE 'Admin access granted to leewakeman@hotmail.co.uk (ID: %)', lee_user_id;
  ELSE
    RAISE NOTICE 'User leewakeman@hotmail.co.uk not found';
  END IF;
END $$;