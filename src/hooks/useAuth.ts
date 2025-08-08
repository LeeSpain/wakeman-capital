import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface User {
  id: string;
  email: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (mounted) {
        setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email } : null);
        setLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email } : null);
      setLoading(false);
    });

    init();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};