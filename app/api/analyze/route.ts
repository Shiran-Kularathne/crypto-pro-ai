import { NextRequest, NextResponse } from 'next/server';
import { atr, ema, rsi } from '../../../lib/indicators';
import { getKlines } from '../../../services/binance/market';
import type { Analysis } from '../../../types/analysis';

const ALLOWED = new Set(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']);
const INTERVALS = new Set(['15m', '1h', '4h', '1d']);

export async function GET(request: NextRequest) {
  try {
    const symbol = (request.nextUrl.searchParams.get('symbol') || 'BTCUSDT').toUpperCase();
    const interval = request.nextUrl.searchParams.get('interval') || '1h';
    if (!ALLOWED.has(symbol) || !INTERVALS.has(interval)) {
      return NextResponse.json({ error: 'Select a valid coin and timeframe.' }, { status: 400 });
    }

    const rows = await getKlines(symbol, interval);

    const highs = rows.map((r) => Number(r[2]));
    const lows = rows.map((r) => Number(r[3]));
    const closes = rows.map((r) => Number(r[4]));
    const volumes = rows.map((r) => Number(r[5]));
    const price = closes.at(-1)!;
    const currentRsi = rsi(closes);
    const ema20 = ema(closes, 20);
    const ema50 = ema(closes, 50);
    const ema200 = ema(closes, 200);
    const currentAtr = atr(highs, lows, closes);
    const recentHigh = Math.max(...highs.slice(-30));
    const recentLow = Math.min(...lows.slice(-30));
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const volumeRatio = volumes.at(-1)! / avgVolume;

    let score = 50;
    if (price > ema20) score += 8; else score -= 8;
    if (ema20 > ema50) score += 10; else score -= 10;
    if (ema50 > ema200) score += 12; else score -= 12;
    if (currentRsi >= 45 && currentRsi <= 65) score += 8;
    if (currentRsi > 72) score -= 12;
    if (currentRsi < 30) score += 6;
    if (volumeRatio > 1.2) score += 7;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const signal = score >= 68 ? 'BUY' : score <= 35 ? 'SELL' : 'WAIT';
    const direction = ema20 > ema50 && ema50 > ema200 ? 'Bullish trend' : ema20 < ema50 && ema50 < ema200 ? 'Bearish trend' : 'Mixed or unconfirmed trend';
    const entryLow = signal === 'BUY' ? Math.max(recentLow, price - currentAtr * 0.6) : price;
    const entryHigh = signal === 'BUY' ? price + currentAtr * 0.15 : price;
    const stopLoss = signal === 'BUY' ? entryLow - currentAtr * 1.25 : price + currentAtr * 1.25;
    const takeProfit1 = signal === 'BUY' ? price + currentAtr * 1.5 : price - currentAtr * 1.5;
    const takeProfit2 = signal === 'BUY' ? price + currentAtr * 2.5 : price - currentAtr * 2.5;

    const reasons = [
      `Current price is ${price > ema20 ? 'above' : 'below'} EMA 20.`,
      `The EMA 20 and EMA 50 relationship is ${ema20 > ema50 ? 'bullish' : 'bearish'}.`,
      `RSI is currently ${currentRsi.toFixed(1)}.`,
      `Current volume is ${volumeRatio.toFixed(2)} times the 20-period average.`,
    ];

    const analysis: Analysis = {
      symbol, interval, price, signal, score, direction,
      rsi: currentRsi, ema20, ema50, ema200, atr: currentAtr,
      support: recentLow, resistance: recentHigh,
      entryLow, entryHigh, stopLoss, takeProfit1, takeProfit2, reasons,
      disclaimer: 'This is educational technical analysis only. Profit is not guaranteed.'
    };
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected server error.' }, { status: 500 });
  }
}
