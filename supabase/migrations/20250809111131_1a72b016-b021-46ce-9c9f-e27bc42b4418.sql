-- Create a function to promote user to admin and grant premium access
CREATE OR REPLACE FUNCTION public.grant_admin_premium_access(target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
  
  -- Add admin role (INSERT ... ON CONFLICT DO NOTHING to avoid duplicates)
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Update profile to premium with paid status
  UPDATE public.profiles 
  SET 
    access_level = 'premium',
    payment_status = 'paid',
    updated_at = now()
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$function$;

-- Grant admin premium access to coreywakeman@gmail.com
SELECT public.grant_admin_premium_access('coreywakeman@gmail.com');