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

    // Get active OANDA account
    const { data: account } = await supabase
      .from('oanda_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!account) throw new Error('No active OANDA account found');

    const oandaUrl = account.environment === 'demo' ? 'https://api-fxpractice.oanda.com' : 'https://api-fxtrade.oanda.com';
    const apiToken = account.api_token_encrypted as string;

    // Fetch open trades from OANDA
    const openTradesRes = await fetch(`${oandaUrl}/v3/accounts/${account.account_id}/openTrades`, {
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (!openTradesRes.ok) {
      const errText = await openTradesRes.text();
      throw new Error(`OANDA open trades failed: ${errText}`);
    }

    const openTradesData = await openTradesRes.json();
    const oandaTrades = openTradesData.trades ?? [];

    // Fetch our records for mapping
    const { data: dbTrades } = await supabase
      .from('oanda_trades')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'open');

    const dbById = new Map((dbTrades ?? []).map((t: any) => [t.oanda_trade_id, t]));

    // Process and update
    for (const t of oandaTrades) {
      const tradeId = t.id;
      const dbTrade = dbById.get(tradeId);
      const currentPrice = parseFloat(t.price ?? t.averageClosePrice ?? t.price ?? '0');
      const unrealized = parseFloat(t.unrealizedPL ?? '0');

      if (dbTrade) {
        // Update PnL and price
        await supabase
          .from('oanda_trades')
          .update({ current_price: currentPrice, unrealized_pnl: unrealized })
          .eq('id', dbTrade.id);

        // Simple TP2/TP3 event detection
        const direction = dbTrade.direction as 'long' | 'short';
        const checkHit = (tp?: number | null) => {
          if (!tp) return false;
          return direction === 'long' ? currentPrice >= tp : currentPrice <= tp;
        };

        if (checkHit(dbTrade.take_profit_2) && !dbTrade.partial_close_tp1) {
          await supabase.from('position_events').insert({
            trade_id: dbTrade.id,
            event_type: 'tp2_hit',
            price_at_event: currentPrice,
          });
          await supabase.from('oanda_trades').update({ partial_close_tp1: true }).eq('id', dbTrade.id);
        }
        if (checkHit(dbTrade.take_profit_3) && !dbTrade.partial_close_tp2) {
          await supabase.from('position_events').insert({
            trade_id: dbTrade.id,
            event_type: 'tp3_hit',
            price_at_event: currentPrice,
          });
          await supabase.from('oanda_trades').update({ partial_close_tp2: true }).eq('id', dbTrade.id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, updated: oandaTrades.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('oanda-sync-trades error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});