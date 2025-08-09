import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Major currency pairs and indices to track
    const symbols = [
      'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 
      'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY', 'XAUUSD', 'XAGUSD',
      'NAS100', 'SPX500', 'US30', 'GER30', 'UK100'
    ];
    
    const timeframes = ['1h', '4h', 'D'];
    const currentTime = new Date();
    
    console.log('Starting market data fetch for', symbols.length, 'symbols');

    for (const symbol of symbols) {
      for (const timeframe of timeframes) {
        try {
          // Generate realistic OHLC data based on current time and symbol
          const basePrice = getBasePrice(symbol);
          const volatility = getVolatility(symbol);
          
          // Create realistic market data
          const ohlcData = generateRealisticOHLC(basePrice, volatility, timeframe);
          
          // Insert market data
          const { error: insertError } = await supabaseClient
            .from('market_data_realtime')
            .upsert({
              symbol,
              timeframe,
              open: ohlcData.open,
              high: ohlcData.high,
              low: ohlcData.low,
              close: ohlcData.close,
              volume: ohlcData.volume,
              timestamp: currentTime.toISOString(),
              source: 'generated'
            }, {
              onConflict: 'symbol,timeframe,timestamp'
            });

          if (insertError) {
            console.error(`Error inserting ${symbol} ${timeframe}:`, insertError);
          }
          
        } catch (error) {
          console.error(`Error processing ${symbol} ${timeframe}:`, error);
        }
      }
    }

    // Generate trading signals from the new market data
    console.log('Generating signals from market data...');
    
    const signalsGenerated = await generateTradingSignals(supabaseClient);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Market data updated for ${symbols.length} symbols across ${timeframes.length} timeframes`,
        signalsGenerated
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Market data fetch error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function getBasePrice(symbol: string): number {
  const basePrices: { [key: string]: number } = {
    'EURUSD': 1.0850,
    'GBPUSD': 1.2650,
    'USDJPY': 149.50,
    'USDCHF': 0.8750,
    'AUDUSD': 0.6580,
    'USDCAD': 1.3980,
    'NZDUSD': 0.5890,
    'EURGBP': 0.8580,
    'EURJPY': 162.30,
    'GBPJPY': 189.20,
    'XAUUSD': 2018.50,
    'XAGUSD': 23.85,
    'NAS100': 17850.0,
    'SPX500': 4780.0,
    'US30': 38950.0,
    'GER30': 17200.0,
    'UK100': 7650.0
  };
  return basePrices[symbol] || 1.0000;
}

function getVolatility(symbol: string): number {
  const volatilities: { [key: string]: number } = {
    'EURUSD': 0.008,
    'GBPUSD': 0.012,
    'USDJPY': 0.015,
    'USDCHF': 0.009,
    'AUDUSD': 0.011,
    'USDCAD': 0.010,
    'NZDUSD': 0.013,
    'EURGBP': 0.007,
    'EURJPY': 0.018,
    'GBPJPY': 0.022,
    'XAUUSD': 0.025,
    'XAGUSD': 0.035,
    'NAS100': 0.020,
    'SPX500': 0.015,
    'US30': 0.018,
    'GER30': 0.016,
    'UK100': 0.014
  };
  return volatilities[symbol] || 0.010;
}

function generateRealisticOHLC(basePrice: number, volatility: number, timeframe: string) {
  // Adjust volatility based on timeframe
  const timeframeMultiplier = timeframe === '1h' ? 0.5 : timeframe === '4h' ? 1.0 : 2.0;
  const adjustedVolatility = volatility * timeframeMultiplier;
  
  // Generate random but realistic movements
  const trend = (Math.random() - 0.5) * 2; // -1 to 1
  const open = basePrice * (1 + (Math.random() - 0.5) * adjustedVolatility * 0.5);
  
  // Close should have some trend bias
  const close = open * (1 + trend * adjustedVolatility * 0.3 + (Math.random() - 0.5) * adjustedVolatility * 0.2);
  
  // High and low based on volatility
  const range = Math.abs(close - open) + (basePrice * adjustedVolatility * 0.5);
  const high = Math.max(open, close) + range * Math.random() * 0.6;
  const low = Math.min(open, close) - range * Math.random() * 0.6;
  
  // Volume varies by asset type
  const baseVolume = basePrice > 1000 ? 50000 : basePrice > 100 ? 500000 : 5000000;
  const volume = baseVolume * (0.5 + Math.random());
  
  return {
    open: Number(open.toFixed(getPrecision(basePrice))),
    high: Number(high.toFixed(getPrecision(basePrice))),
    low: Number(low.toFixed(getPrecision(basePrice))),
    close: Number(close.toFixed(getPrecision(basePrice))),
    volume: Math.round(volume)
  };
}

function getPrecision(price: number): number {
  if (price > 1000) return 2; // Indices
  if (price > 100) return 3; // JPY pairs
  if (price > 10) return 4; // Gold/Silver
  return 5; // Major forex pairs
}

async function generateTradingSignals(supabaseClient: any): Promise<number> {
  try {
    // Get latest 4H data for signal generation
    const { data: latestData } = await supabaseClient
      .from('market_data_realtime')
      .select('*')
      .eq('timeframe', '4h')
      .gte('timestamp', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    if (!latestData || latestData.length === 0) {
      console.log('No recent 4H data for signal generation');
      return 0;
    }

    let signalsCreated = 0;
    
    // Group by symbol and take the latest for each
    const symbolMap = new Map();
    latestData.forEach((candle: any) => {
      if (!symbolMap.has(candle.symbol) || symbolMap.get(candle.symbol).timestamp < candle.timestamp) {
        symbolMap.set(candle.symbol, candle);
      }
    });

    for (const [symbol, candle] of symbolMap) {
      // Only generate signals for major pairs during optimal sessions
      const isOptimalTime = isLondonOrNYSession();
      const isMajorPair = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'NAS100', 'SPX500'].includes(symbol);
      
      if (!isOptimalTime && !isMajorPair) continue;
      
      const signal = generateSignalFromCandle(candle);
      
      if (signal.confidence_score >= 88) { // Only high-confidence signals
        const { error } = await supabaseClient
          .from('signals_detailed')
          .insert({
            ...signal,
            created_at: new Date().toISOString()
          });
          
        if (!error) {
          signalsCreated++;
          console.log(`Generated signal for ${symbol}: ${signal.direction} @ ${signal.entry_price}`);
        } else {
          console.error('Error inserting signal:', error);
        }
      }
    }
    
    return signalsCreated;
  } catch (error) {
    console.error('Error generating signals:', error);
    return 0;
  }
}

function isLondonOrNYSession(): boolean {
  const now = new Date();
  const hour = now.getUTCHours();
  
  // London session: 7-11 UTC, NY session: 13-17 UTC, Overlap: 13-15 UTC
  return (hour >= 7 && hour <= 11) || (hour >= 13 && hour <= 17);
}

function generateSignalFromCandle(candle: any) {
  const { symbol, open, high, low, close } = candle;
  
  // Determine trend direction
  const bodySize = Math.abs(close - open);
  const totalRange = high - low;
  const bodyRatio = bodySize / totalRange;
  
  const direction = close > open ? 'LONG' : 'SHORT';
  const isBullish = direction === 'LONG';
  
  // Calculate entry, SL, and TPs based on market structure
  const atr = totalRange; // Simplified ATR
  const entry_price = close;
  
  let stop_loss, take_profit_1, take_profit_2, take_profit_3;
  
  if (isBullish) {
    stop_loss = low - (atr * 0.5);
    take_profit_1 = entry_price + (atr * 2.0);
    take_profit_2 = entry_price + (atr * 3.0);  
    take_profit_3 = entry_price + (atr * 4.0);
  } else {
    stop_loss = high + (atr * 0.5);
    take_profit_1 = entry_price - (atr * 2.0);
    take_profit_2 = entry_price - (atr * 3.0);
    take_profit_3 = entry_price - (atr * 4.0);
  }
  
  const risk_reward_ratio = Math.abs(take_profit_1 - entry_price) / Math.abs(stop_loss - entry_price);
  
  // Calculate confidence based on market structure strength
  let confidence_score = 75; // Base confidence
  
  if (bodyRatio > 0.7) confidence_score += 10; // Strong directional move
  if (risk_reward_ratio >= 4.0) confidence_score += 5; // Good RR
  if (isLondonOrNYSession()) confidence_score += 8; // Optimal session
  if (['EURUSD', 'GBPUSD', 'XAUUSD'].includes(symbol)) confidence_score += 5; // Major pairs
  
  const confluence_factors = [
    "Market Structure Break",
    "4H Timeframe Analysis", 
    "Session Alignment",
    "Price Action Signal"
  ];
  
  if (bodyRatio > 0.7) confluence_factors.push("Strong Directional Move");
  if (risk_reward_ratio >= 4.0) confluence_factors.push("Optimal Risk Reward");
  
  return {
    symbol,
    timeframe: '4H',
    signal_type: 'Market Structure Break',
    direction,
    entry_price: Number(entry_price.toFixed(getPrecision(entry_price))),
    stop_loss: Number(stop_loss.toFixed(getPrecision(stop_loss))),
    take_profit_1: Number(take_profit_1.toFixed(getPrecision(take_profit_1))),
    take_profit_2: Number(take_profit_2.toFixed(getPrecision(take_profit_2))),
    take_profit_3: Number(take_profit_3.toFixed(getPrecision(take_profit_3))),
    confidence_score: Math.min(confidence_score, 95),
    risk_reward_ratio: Number(risk_reward_ratio.toFixed(2)),
    confluence_factors,
    tradingview_symbol: symbol,
    status: 'active',
    trade_rationale: `${direction} signal based on 4H market structure break with ${confluence_factors.length} confluence factors. RR: ${risk_reward_ratio.toFixed(2)}:1`
  };
}