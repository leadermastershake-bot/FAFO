import React, { useEffect, useRef } from 'react';
import { createChart, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import { Panel } from './Panel';
import { useMarketData } from '../contexts/MarketDataContext';

interface ChartingPanelProps {
  onClose: () => void;
}

export const ChartingPanel: React.FC<ChartingPanelProps> = ({ onClose }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const { data, isStale } = useMarketData();

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300, // Initial height
        layout: {
          background: { color: '#0a0a0a' },
          textColor: '#00ff88',
        },
        grid: {
          vertLines: { color: 'rgba(0, 255, 136, 0.1)' },
          horzLines: { color: 'rgba(0, 255, 136, 0.1)' },
        },
      });
      candlestickSeriesRef.current = (chartRef.current as any).addCandlestickSeries({
        upColor: '#00ff88',
        downColor: '#ff4444',
      });
    }

    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (data && candlestickSeriesRef.current) {
      const color = isStale ? '#ff4444' : '#00ff88';
      // This is a simplified example. A real implementation would manage a series of candlestick data.
      // For now, we'll just update a single point to show the real-time data.
      const candlestickData = {
          time: Math.floor(data.timestamp / 1000) as any,
          open: data.price,
          high: data.price,
          low: data.price,
          close: data.price,
          color,
      };
      candlestickSeriesRef.current.update(candlestickData);
    }
  }, [data, isStale]);

  return (
    <Panel title="📊 Financial Chart" onClose={onClose}>
      <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
    </Panel>
  );
};
