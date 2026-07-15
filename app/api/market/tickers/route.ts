import { NextRequest, NextResponse } from 'next/server';
import { getTicker24h } from '../../../../services/binance/market';

const DEFAULT_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT'];

export async function GET(request: NextRequest) {
  try {
    const requested = request.nextUrl.searchParams.get('symbols')?.split(',').map((symbol) => symbol.toUpperCase()).filter(Boolean);
    const symbols = requested?.length ? requested.slice(0, 12) : DEFAULT_SYMBOLS;
    return NextResponse.json(await getTicker24h(symbols));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load market movers.' }, { status: 502 });
  }
}
