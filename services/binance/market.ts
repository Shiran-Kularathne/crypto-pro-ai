import { z } from 'zod';

const value = z.union([z.number(), z.string()]);
const klineSchema = z.tuple([value, value, value, value, value, value]).rest(z.unknown());
const klinesSchema = z.array(klineSchema).min(200);

export async function getKlines(symbol: string, interval: string) {
  const response = await fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=220`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to retrieve Binance market data.');
  return klinesSchema.parse(await response.json());
}
