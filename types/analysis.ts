export type Analysis = {
  symbol: string; interval: string; price: number; signal: 'BUY' | 'SELL' | 'WAIT'; score: number;
  direction: string; rsi: number; ema20: number; ema50: number; ema200: number; atr: number;
  support: number; resistance: number; entryLow: number; entryHigh: number; stopLoss: number;
  takeProfit1: number; takeProfit2: number; reasons: string[]; disclaimer: string;
};
