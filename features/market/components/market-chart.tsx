'use client';

import { CandlestickSeries, ColorType, createChart, type UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

type Candle = { time: number; open: number; high: number; low: number; close: number };

export function MarketChart({ candles }: { candles?: Candle[] }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current || !candles?.length) return;
    const chart = createChart(host.current, {
      autoSize: true, height: 180,
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7890a7' },
      grid: { vertLines: { color: '#17304a' }, horzLines: { color: '#17304a' } },
      rightPriceScale: { borderColor: '#17304a' }, timeScale: { borderColor: '#17304a', timeVisible: true },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#2ee6a6', downColor: '#ff7580', borderVisible: false,
      wickUpColor: '#2ee6a6', wickDownColor: '#ff7580',
    });
    series.setData(candles.map((candle) => ({ ...candle, time: candle.time as UTCTimestamp })));
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [candles]);

  return <div className="chart-placeholder" ref={host} aria-label="Candlestick price chart" />;
}
