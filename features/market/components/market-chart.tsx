'use client';

import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export function MarketChart({ price }: { price?: number }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current || !price) return;
    const chart = createChart(host.current, {
      autoSize: true, height: 180,
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7890a7' },
      grid: { vertLines: { color: '#17304a' }, horzLines: { color: '#17304a' } },
      rightPriceScale: { borderColor: '#17304a' }, timeScale: { borderColor: '#17304a', visible: false },
    });
    const series = chart.addSeries(LineSeries, { color: '#2ee6a6', lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
    const now = Math.floor(Date.now() / 1000);
    series.setData(Array.from({ length: 28 }, (_, index) => ({ time: (now - (27 - index) * 300) as never, value: price * (1 + (Math.sin(index * 0.8) * 0.003 + (index - 14) * 0.00045)) })));
    return () => chart.remove();
  }, [price]);

  return <div className="chart-placeholder" ref={host} aria-label="Price chart" />;
}
