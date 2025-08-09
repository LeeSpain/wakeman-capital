import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export type Profile = {
  id: string;
  display_name: string | null;
  preferred_currency: string | null;
  preferred_language: string | null;
  region: string | null;
  first_name: string | null;
  last_name: string | null;
  mobile: string | null;
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
        .select('id, display_name, preferred_currency, first_name, last_name, mobile')
        .eq('id', userId)
        .maybeSingle();

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
    const payload = {
      id: userId,
      ...(updates.display_name !== undefined ? { display_name: updates.display_name } : {}),
      ...(updates.preferred_currency !== undefined ? { preferred_currency: updates.preferred_currency } : {}),
      ...(updates.first_name !== undefined ? { first_name: updates.first_name } : {}),
      ...(updates.last_name !== undefined ? { last_name: updates.last_name } : {}),
      ...(updates.mobile !== undefined ? { mobile: updates.mobile } : {}),
    };

    const { error, data } = await supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (!error && data) setProfile(data as Profile);
    return { error } as const;
  };

  return { profile, loading, error, updateProfile };
};
