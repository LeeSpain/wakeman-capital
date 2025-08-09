import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error('Invalid auth token');

    const { symbol, entryPrice, stopLoss, riskPercentage } = await req.json();

    if (!symbol || typeof entryPrice !== 'number' || typeof stopLoss !== 'number' || typeof riskPercentage !== 'number') {
      throw new Error('Missing required fields: symbol, entryPrice, stopLoss, riskPercentage');
    }

    // Fetch active OANDA account
    const { data: account } = await supabase
      .from('oanda_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!account) throw new Error('No active OANDA account found');

    const oandaUrl = account.environment === 'demo' ? 'https://api-fxpractice.oanda.com' : 'https://api-fxtrade.oanda.com';
    const apiToken = account.api_token_encrypted as string;

    // Fetch account summary to get balance
    const summaryRes = await fetch(`${oandaUrl}/v3/accounts/${account.account_id}/summary`, {
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });
    const summary = await summaryRes.json();
    const balance = parseFloat(summary?.account?.balance ?? '0');

    // Basic units calc (approximation). Users should verify before live trading.
    const priceRisk = Math.max(0.0001, Math.abs(entryPrice - stopLoss));
    let units = Math.floor((balance * (riskPercentage / 100)) / priceRisk);
    if (!Number.isFinite(units) || units <= 0) units = 0;

    return new Response(JSON.stringify({ units, balance }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('oanda-risk-calc error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});