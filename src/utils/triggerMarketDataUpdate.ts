import { supabase } from '../integrations/supabase/client';

export const triggerMarketDataUpdate = async () => {
  try {
    console.log('Triggering market data update...');
    
    const { data, error } = await supabase.functions.invoke('market-data-fetcher', {
      body: { manual: true }
    });
    
    if (error) {
      console.error('Error triggering market data update:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Market data update triggered successfully:', data);
    return { success: true, data };
  } catch (err: any) {
    console.error('Error in triggerMarketDataUpdate:', err);
    return { success: false, error: err.message };
  }
};