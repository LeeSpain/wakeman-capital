-- First, remove all existing admin roles
DELETE FROM public.user_roles WHERE role = 'admin';

-- Create or update the specific admin accounts
-- Note: These accounts need to be created via the auth.users table first through sign-up
-- This migration will grant admin roles once the accounts exist

-- Function to safely promote users to admin by email
CREATE OR REPLACE FUNCTION promote_specific_admins()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  lee_user_id uuid;
  corey_user_id uuid;
BEGIN
  -- Find Lee's user ID
  SELECT id INTO lee_user_id 
  FROM auth.users 
  WHERE email = 'leewakeman@hotmail.co.uk';
  
  -- Find Corey's user ID  
  SELECT id INTO corey_user_id
  FROM auth.users 
  WHERE email = 'coreywakeman@gmail.com';
  
  -- Add admin role for Lee if account exists
  IF lee_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (lee_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Update profile to ensure it exists
    INSERT INTO public.profiles (id, display_name, preferred_currency, access_level, payment_status)
    VALUES (lee_user_id, 'Lee Wakeman', 'GBP', 'premium', 'paid')
    ON CONFLICT (id) DO UPDATE SET
      access_level = 'premium',
      payment_status = 'paid',
      preferred_currency = 'GBP';
  END IF;
  
  -- Add admin role for Corey if account exists
  IF corey_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (corey_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Update profile to ensure it exists
    INSERT INTO public.profiles (id, display_name, preferred_currency, access_level, payment_status)
    VALUES (corey_user_id, 'Corey Wakeman', 'USD', 'premium', 'paid')
    ON CONFLICT (id) DO UPDATE SET
      access_level = 'premium',
      payment_status = 'paid',
      preferred_currency = 'USD';
  END IF;
  
END;
$$;

-- Execute the function
SELECT promote_specific_admins();

-- Clean up the function
DROP FUNCTION promote_specific_admins();