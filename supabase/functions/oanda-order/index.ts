import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    const { symbol, direction, units, stopLoss, takeProfit, signalId } = await req.json();

    // Validate input
    if (!symbol || !direction || !units) {
      throw new Error('Missing required fields: symbol, direction, units');
    }

    if (!['long', 'short'].includes(direction)) {
      throw new Error('Direction must be "long" or "short"');
    }

    // Get user's OANDA account
    const { data: accounts, error: accountError } = await supabase
      .from('oanda_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (accountError || !accounts) {
      throw new Error('No active OANDA account found');
    }

    const apiToken = accounts.api_token_encrypted;
    const oandaUrl = accounts.environment === 'demo' 
      ? 'https://api-fxpractice.oanda.com' 
      : 'https://api-fxtrade.oanda.com';

    // Prepare order data
    const orderData = {
      order: {
        type: 'MARKET',
        instrument: symbol,
        units: direction === 'long' ? Math.abs(units) : -Math.abs(units),
        timeInForce: 'FOK',
        positionFill: 'DEFAULT',
        ...(stopLoss && { stopLossOnFill: { price: stopLoss.toString() } }),
        ...(takeProfit && { takeProfitOnFill: { price: takeProfit.toString() } }),
      },
    };

    console.log('Placing OANDA order:', orderData);

    // Place order with OANDA
    const orderResponse = await fetch(`${oandaUrl}/v3/accounts/${accounts.account_id}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      console.error('OANDA order error:', errorData);
      throw new Error(`OANDA order failed: ${orderResponse.statusText}`);
    }

    const orderResult = await orderResponse.json();
    console.log('OANDA order result:', orderResult);

    // If order was filled, record it in our database
    if (orderResult.orderFillTransaction) {
      const fillTx = orderResult.orderFillTransaction;
      
      await supabase.from('oanda_trades').insert({
        user_id: user.id,
        oanda_account_id: accounts.id,
        oanda_trade_id: fillTx.tradeOpened?.tradeID || fillTx.id,
        symbol: symbol,
        direction: direction,
        units: Math.abs(parseInt(fillTx.units)),
        entry_price: parseFloat(fillTx.price),
        stop_loss: stopLoss,
        take_profit: takeProfit,
        signal_id: signalId || null,
        status: 'open',
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      orderResult,
      message: 'Order placed successfully',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in oanda-order function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});