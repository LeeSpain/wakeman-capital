// TradingView utility functions for chart integration

export interface TradingViewZone {
  high: number
  low: number
  type: 'supply' | 'demand' | 'order_block' | 'imbalance' | 'choch'
  timeframe: string
  strength?: number
}

export interface ChartAnnotations {
  entry_price: number
  stop_loss: number
  take_profit_1?: number
  take_profit_2?: number
  take_profit_3?: number
  supply_zones: TradingViewZone[]
  demand_zones: TradingViewZone[]
  order_blocks: TradingViewZone[]
  imbalances_data: TradingViewZone[]
  choch_levels: TradingViewZone[]
}

/**
 * Maps internal symbols to TradingView format
 */
export function mapToTradingViewSymbol(symbol: string): string {
  const symbolMap: Record<string, string> = {
    'EURUSD': 'FX:EURUSD',
    'GBPUSD': 'FX:GBPUSD',
    'USDJPY': 'FX:USDJPY',
    'GBPJPY': 'FX:GBPJPY',
    'AUDUSD': 'FX:AUDUSD',
    'USDCAD': 'FX:USDCAD',
    'NZDUSD': 'FX:NZDUSD',
    'EURGBP': 'FX:EURGBP',
    'EURJPY': 'FX:EURJPY',
    'XAUUSD': 'TVC:GOLD',
    'XAGUSD': 'TVC:SILVER',
    'NAS100': 'TVC:NDX',
    'US30': 'TVC:DJI',
    'SPX500': 'TVC:SPX',
    'UK100': 'TVC:UKX',
    'GER30': 'TVC:DAX',
    'BTCUSD': 'COINBASE:BTCUSD',
    'ETHUSD': 'COINBASE:ETHUSD'
  }
  
  return symbolMap[symbol] || `FX:${symbol}`
}

/**
 * Generates TradingView chart URL with annotations
 */
export function generateTradingViewChartUrl(
  symbol: string,
  template: string = 'TradingPlan2.0',
  annotations?: ChartAnnotations
): string {
  const tvSymbol = mapToTradingViewSymbol(symbol)
  const baseUrl = 'https://www.tradingview.com/chart/'
  
  // Build URL parameters
  const params = new URLSearchParams({
    symbol: tvSymbol,
    template: template
  })
  
  // Add annotation parameters if provided
  if (annotations) {
    // Add entry, SL, TP levels as price lines
    if (annotations.entry_price) {
      params.append('entry', annotations.entry_price.toString())
    }
    if (annotations.stop_loss) {
      params.append('sl', annotations.stop_loss.toString())
    }
    if (annotations.take_profit_1) {
      params.append('tp1', annotations.take_profit_1.toString())
    }
    if (annotations.take_profit_2) {
      params.append('tp2', annotations.take_profit_2.toString())
    }
    if (annotations.take_profit_3) {
      params.append('tp3', annotations.take_profit_3.toString())
    }
    
    // Add zone annotations
    const allZones = [
      ...annotations.supply_zones,
      ...annotations.demand_zones,
      ...annotations.order_blocks,
      ...annotations.imbalances_data,
      ...annotations.choch_levels
    ]
    
    if (allZones.length > 0) {
      params.append('zones', encodeZonesForUrl(allZones))
    }
  }
  
  return `${baseUrl}?${params.toString()}`
}

/**
 * Encodes zone data for URL parameters
 */
function encodeZonesForUrl(zones: TradingViewZone[]): string {
  const compactZones = zones.map(zone => ({
    h: zone.high,
    l: zone.low,
    t: zone.type[0], // First letter: s=supply, d=demand, o=order_block, i=imbalance, c=choch
    tf: zone.timeframe,
    s: zone.strength || 0
  }))
  
  return btoa(JSON.stringify(compactZones)).replace(/[+/=]/g, (match) => {
    return { '+': '-', '/': '_', '=': '' }[match] || match
  })
}

/**
 * Generates a quick TradingView chart link without annotations
 */
export function generateQuickChartUrl(symbol: string, timeframe: string = '1H'): string {
  const tvSymbol = mapToTradingViewSymbol(symbol)
  return `https://www.tradingview.com/chart/?symbol=${tvSymbol}&interval=${timeframe}`
}

/**
 * Formats signal data for TradingView integration
 */
export function formatSignalForTradingView(signal: any): ChartAnnotations {
  return {
    entry_price: signal.entry_price,
    stop_loss: signal.stop_loss,
    take_profit_1: signal.take_profit_1,
    take_profit_2: signal.take_profit_2,
    take_profit_3: signal.take_profit_3,
    supply_zones: signal.supply_zones || [],
    demand_zones: signal.demand_zones || [],
    order_blocks: signal.order_blocks || [],
    imbalances_data: signal.imbalances_data || [],
    choch_levels: signal.choch_levels || []
  }
}