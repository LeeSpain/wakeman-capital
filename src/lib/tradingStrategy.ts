// Enhanced trading strategy utilities with improved confluence filtering
// Targets minimum 1:4 RRR with 70%+ win rate through strict criteria

export interface StrategyConfig {
  minConfidenceScore: number;
  requiredConfluenceFactors: number;
  sessionFilterEnabled: boolean;
  riskPercentage: number;
  maxConcurrentTrades: number;
  maxDailyDrawdown: number;
}

export interface SessionTiming {
  name: string;
  startHour: number;
  endHour: number;
  timezone: string;
  pairs: string[];
}

export const DEFAULT_STRATEGY_CONFIG: StrategyConfig = {
  minConfidenceScore: 88,
  requiredConfluenceFactors: 5,
  sessionFilterEnabled: true,
  riskPercentage: 1.0,
  maxConcurrentTrades: 3,
  maxDailyDrawdown: 3.0
};

export const TRADING_SESSIONS: SessionTiming[] = [
  {
    name: 'London',
    startHour: 7,
    endHour: 11,
    timezone: 'GMT',
    pairs: ['EURUSD', 'GBPUSD', 'GBPJPY', 'EURGBP', 'EURJPY', 'XAUUSD']
  },
  {
    name: 'New York',
    startHour: 13,
    endHour: 17,
    timezone: 'GMT',
    pairs: ['USDJPY', 'USDCAD', 'AUDUSD', 'NZDUSD', 'NAS100', 'SPX500', 'US30']
  },
  {
    name: 'London-NY Overlap',
    startHour: 13,
    endHour: 15,
    timezone: 'GMT',
    pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD']
  }
];

export const CONFLUENCE_FACTORS = {
  // Multi-timeframe analysis (3+ points required)
  WEEKLY_STRUCTURE: { name: 'weekly_structure_alignment', points: 3, priority: 'high' },
  DAILY_STRUCTURE: { name: 'daily_structure_confirmation', points: 2, priority: 'high' },
  FOUR_HOUR_SETUP: { name: 'four_hour_setup_valid', points: 2, priority: 'medium' },
  
  // Supply/Demand zones (2+ points required)
  WEEKLY_ZONE: { name: 'weekly_supply_demand_zone', points: 3, priority: 'high' },
  DAILY_ZONE: { name: 'daily_supply_demand_zone', points: 2, priority: 'high' },
  FOUR_HOUR_ZONE: { name: 'four_hour_zone_respect', points: 1, priority: 'medium' },
  
  // Market structure (2+ points required)
  CHOCH_CONFIRMATION: { name: 'choch_confirmation', points: 2, priority: 'high' },
  BOS_CONFIRMATION: { name: 'bos_confirmation', points: 2, priority: 'high' },
  ORDER_BLOCK: { name: 'order_block_alignment', points: 1, priority: 'medium' },
  IMBALANCE_FILL: { name: 'imbalance_targeting', points: 1, priority: 'medium' },
  
  // Session and timing (1+ point required)
  OPTIMAL_SESSION: { name: 'optimal_session_timing', points: 1, priority: 'high' },
  HIGH_VOLATILITY: { name: 'high_volatility_period', points: 1, priority: 'medium' },
  
  // Technical confluence (1+ point required)
  MOMENTUM_DIVERGENCE: { name: 'momentum_divergence', points: 1, priority: 'medium' },
  VOLUME_CONFIRMATION: { name: 'volume_confirmation', points: 1, priority: 'medium' },
  FIBONACCI_LEVEL: { name: 'fibonacci_retracement', points: 1, priority: 'low' },
  
  // Fundamental confluence (bonus points)
  CORRELATION_ALIGNMENT: { name: 'correlation_alignment', points: 1, priority: 'low' },
  NEWS_CATALYST: { name: 'fundamental_catalyst', points: 1, priority: 'low' }
};

export function calculateSignalScore(confluenceFactors: string[]): number {
  let totalScore = 0;
  
  for (const factor of confluenceFactors) {
    const confluenceFactor = Object.values(CONFLUENCE_FACTORS)
      .find(cf => cf.name === factor || factor.includes(cf.name.split('_')[0]));
    
    if (confluenceFactor) {
      totalScore += confluenceFactor.points;
    }
  }
  
  return Math.min(totalScore, 10); // Cap at 10
}

export function validateSignalCriteria(signal: any, config: StrategyConfig): {
  isValid: boolean;
  reasons: string[];
  score: number;
} {
  const reasons: string[] = [];
  let isValid = true;
  
  // Check confidence score
  if (signal.confidence_score < config.minConfidenceScore) {
    isValid = false;
    reasons.push(`Confidence score ${signal.confidence_score} below minimum ${config.minConfidenceScore}`);
  }
  
  // Check RRR requirement
  const rrr = signal.risk_reward_ratio || calculateRRR(signal);
  if (rrr < 4.0) {
    isValid = false;
    reasons.push(`Risk-reward ratio ${rrr.toFixed(1)} below minimum 4:1`);
  }
  
  // Check confluence factors
  const confluenceCount = signal.confluence_factors?.length || 0;
  if (confluenceCount < config.requiredConfluenceFactors) {
    isValid = false;
    reasons.push(`Only ${confluenceCount} confluence factors, need ${config.requiredConfluenceFactors}`);
  }
  
  // Check session timing if enabled
  if (config.sessionFilterEnabled && !isOptimalSessionTiming(signal)) {
    isValid = false;
    reasons.push('Trade outside optimal session timing');
  }
  
  // Calculate signal score
  const score = calculateSignalScore(signal.confluence_factors || []);
  
  return { isValid, reasons, score };
}

function calculateRRR(signal: any): number {
  if (!signal.entry_price || !signal.stop_loss || !signal.take_profit_1) {
    return 0;
  }
  
  const risk = Math.abs(signal.entry_price - signal.stop_loss);
  const reward = Math.abs(signal.take_profit_1 - signal.entry_price);
  
  return risk > 0 ? reward / risk : 0;
}

function isOptimalSessionTiming(signal: any): boolean {
  const now = new Date();
  const currentHour = now.getUTCHours();
  
  return TRADING_SESSIONS.some(session => {
    const isInSession = currentHour >= session.startHour && currentHour <= session.endHour;
    const isPairSupported = session.pairs.includes(signal.symbol);
    return isInSession && isPairSupported;
  });
}

export function getOptimizedStopLoss(signal: any): number {
  const { symbol, entry_price, direction } = signal;
  
  // ATR-based stops for volatile pairs
  const volatilePairs = ['GBPJPY', 'XAUUSD', 'NAS100'];
  const atrMultiplier = volatilePairs.includes(symbol) ? 1.5 : 1.0;
  
  // Base stop distance
  let baseStop = signal.stop_loss;
  
  // Add buffer for spread and slippage
  const pipValue = getPipValue(symbol);
  const buffer = pipValue * (volatilePairs.includes(symbol) ? 5 : 3);
  
  if (direction.toLowerCase().includes('buy') || direction.toLowerCase() === 'long') {
    return baseStop - (buffer * atrMultiplier);
  } else {
    return baseStop + (buffer * atrMultiplier);
  }
}

export function calculateOptimalPositionSize(signal: any, accountBalance: number, riskPercentage: number): number {
  const riskAmount = accountBalance * (riskPercentage / 100);
  const stopDistance = Math.abs(signal.entry_price - signal.stop_loss);
  
  if (stopDistance === 0) return 0;
  
  const pipValue = getPipValue(signal.symbol);
  const positionSize = riskAmount / (stopDistance / pipValue);
  
  return Math.round(positionSize * 100) / 100; // Round to 2 decimal places
}

function getPipValue(symbol: string): number {
  // Basic pip values - would need real-time data in production
  const pipValues: Record<string, number> = {
    'EURUSD': 0.0001,
    'GBPUSD': 0.0001,
    'USDJPY': 0.01,
    'GBPJPY': 0.01,
    'XAUUSD': 0.1,
    'NAS100': 0.25,
    'SPX500': 0.1,
    'US30': 1.0
  };
  
  return pipValues[symbol] || 0.0001;
}

export const PAIR_SPECIFIC_RULES = {
  'GBPJPY': {
    minSessionVolatility: true,
    requiredSessions: ['London'],
    stopBufferMultiplier: 1.5,
    preferredTimeframes: ['1H', '4H'],
    avoidNews: ['GBP', 'JPY']
  },
  'XAUUSD': {
    minSessionVolatility: true,
    requiredSessions: ['London', 'New York'],
    stopBufferMultiplier: 1.3,
    preferredTimeframes: ['1H', '4H'],
    correlationPairs: ['DXY']
  },
  'EURUSD': {
    rangeAware: true,
    requiredSessions: ['London'],
    stopBufferMultiplier: 1.0,
    preferredTimeframes: ['1H', '4H'],
    majorLevelsOnly: true
  },
  'NAS100': {
    avoidEarnings: true,
    requiredSessions: ['New York'],
    stopBufferMultiplier: 1.2,
    preferredTimeframes: ['1H'],
    roundNumberTargets: true
  }
};

export function getEnhancedSignalQuality(signal: any): {
  quality: 'excellent' | 'good' | 'poor';
  improvements: string[];
  expectedWinRate: number;
  expectedRRR: number;
} {
  const validation = validateSignalCriteria(signal, DEFAULT_STRATEGY_CONFIG);
  const confluenceCount = signal.confluence_factors?.length || 0;
  const rrr = signal.risk_reward_ratio || calculateRRR(signal);
  
  let quality: 'excellent' | 'good' | 'poor' = 'poor';
  let expectedWinRate = 45;
  let expectedRRR = 2.0;
  const improvements: string[] = [];
  
  if (validation.isValid && confluenceCount >= 6 && rrr >= 4.0) {
    quality = 'excellent';
    expectedWinRate = 75;
    expectedRRR = 4.5;
  } else if (validation.score >= 7 && rrr >= 3.0) {
    quality = 'good';
    expectedWinRate = 65;
    expectedRRR = 3.5;
    
    if (confluenceCount < 6) {
      improvements.push('Add more confluence factors');
    }
    if (rrr < 4.0) {
      improvements.push('Extend take profit targets');
    }
  } else {
    improvements.push(...validation.reasons);
    if (confluenceCount < 5) {
      improvements.push('Insufficient confluence - need more confirmation');
    }
  }
  
  return { quality, improvements, expectedWinRate, expectedRRR };
}