'use client';

import { useQuery } from '@tanstack/react-query';

const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT'];
const names: Record<string, string> = { BTCUSDT: 'Bitcoin', ETHUSDT: 'Ethereum', SOLUSDT: 'Solana', XRPUSDT: 'XRP' };
type Ticker = { symbol: string; lastPrice: string; priceChangePercent: string };

async function loadTickers(): Promise<Ticker[]> {
  const response = await fetch(`/api/market/tickers?symbols=${symbols.join(',')}`);
  if (!response.ok) throw new Error('Market movers unavailable.');
  return response.json();
}

export function LiveWatchlist() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['market-tickers', symbols], queryFn: loadTickers, refetchInterval: 30_000 });
  if (isLoading) return <div className="watchlist-loading">Loading live market movers…</div>;
  if (isError || !data) return <div className="watchlist-loading">Market movers unavailable.</div>;
  return <div className="watchlist">{data.map((coin) => { const change = Number(coin.priceChangePercent); return <div className="watch-row" key={coin.symbol}><div className="coin-icon">{coin.symbol[0]}</div><div className="coin-name"><strong>{coin.symbol.replace('USDT', '')}</strong><span>{names[coin.symbol] || coin.symbol}</span></div><div className="coin-quote"><span>${Number(coin.lastPrice).toLocaleString('en-US', { maximumFractionDigits: 4 })}</span><strong className={change >= 0 ? 'positive' : 'negative'}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</strong></div></div>; })}</div>;
}
