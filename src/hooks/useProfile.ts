import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Profile = {
  id: string;
  display_name: string | null;
  preferred_currency: string | null;
};

export const useProfile = (userId?: string) => {
  const canFetch = useMemo(() => Boolean(userId), [userId]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!canFetch);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canFetch) return;
    let mounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, preferred_currency')
        .eq('id', userId)
        .single();

      if (!mounted) return;
      if (error) {
        setError(error.message);
      } else {
        setProfile(data as Profile);
      }
      setLoading(false);
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [canFetch, userId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return { error: 'Not authenticated' } as const;
    const { error } = await supabase
      .from('profiles')
      .update({
        ...(updates.display_name !== undefined ? { display_name: updates.display_name } : {}),
        ...(updates.preferred_currency !== undefined ? { preferred_currency: updates.preferred_currency } : {}),
      })
      .eq('id', userId);
    if (!error) setProfile((p) => (p ? { ...p, ...updates } as Profile : p));
    return { error } as const;
  };

  return { profile, loading, error, updateProfile };
};
