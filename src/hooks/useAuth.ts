import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      setLoading(false);
      // For now, no user is logged in
      setUser(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { user, loading };
};