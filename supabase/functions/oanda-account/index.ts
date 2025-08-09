import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const encryptionKey = Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-in-production';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid auth token');
    }

    // Get user's OANDA account
    const { data: accounts, error: accountError } = await supabase
      .from('oanda_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (accountError || !accounts) {
      return new Response(JSON.stringify({ 
        error: 'No active OANDA account found. Please configure your OANDA connection in Settings.' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simple decrypt (in production, use proper encryption)
    const apiToken = accounts.api_token_encrypted;
    const oandaUrl = accounts.environment === 'demo' 
      ? 'https://api-fxpractice.oanda.com' 
      : 'https://api-fxtrade.oanda.com';

    // Fetch account details from OANDA
    const accountResponse = await fetch(`${oandaUrl}/v3/accounts/${accounts.account_id}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!accountResponse.ok) {
      throw new Error(`OANDA API error: ${accountResponse.statusText}`);
    }

    const accountData = await accountResponse.json();
    
    // Fetch open trades
    const tradesResponse = await fetch(`${oandaUrl}/v3/accounts/${accounts.account_id}/openTrades`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    const tradesData = tradesResponse.ok ? await tradesResponse.json() : { trades: [] };

    return new Response(JSON.stringify({ 
      account: accountData.account,
      trades: tradesData.trades || [],
      environment: accounts.environment,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in oanda-account function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});