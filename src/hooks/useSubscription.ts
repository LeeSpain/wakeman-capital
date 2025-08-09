import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string | null;
  subscription_end?: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [data, setData] = useState<SubscriptionData>({ subscribed: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.functions.invoke<SubscriptionData>('check-subscription');
    if (error) {
      console.error('check-subscription error', error);
      setError(error.message);
    } else if (data) {
      setData(data);
    }
    setLoading(false);
  }, [user]);

  const openCheckout = useCallback(async (amountCents: number, description: string) => {
    const { data, error } = await supabase.functions.invoke<{ url?: string }>('create-payment', {
      body: { amount: amountCents, description },
    });
    if (error || !data?.url) {
      console.error('create-payment error', error);
      throw new Error(error?.message || 'Unable to start checkout');
    }
    window.open(data.url, '_blank');
  }, []);

  const openPortal = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke<{ url?: string }>('customer-portal');
    if (error || !data?.url) {
      console.error('customer-portal error', error);
      throw new Error(error?.message || 'Unable to open customer portal');
    }
    window.open(data.url, '_blank');
  }, []);

  useEffect(() => {
    if (!user) {
      setData({ subscribed: false });
      return;
    }
    refresh();
    const id = setInterval(refresh, 10000);
    return () => clearInterval(id);
  }, [user, refresh]);

  const tierLabel = useMemo(() => data.subscription_tier ?? (data.subscribed ? 'Premium' : 'Free'), [data]);

  return { ...data, tierLabel, loading, error, refresh, openCheckout, openPortal };
};
