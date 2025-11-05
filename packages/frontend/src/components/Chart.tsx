import { createChart, IChartApi, ISeriesApi, LineData } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import './Chart.css';

interface ChartProps {
  coinId: string;
}

export function Chart({ coinId }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const [days, setDays] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#e1e1e1' },
        horzLines: { color: '#e1e1e1' },
      },
    });

    seriesRef.current = chartRef.current.addLineSeries();

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 300);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!coinId || !seriesRef.current) return;

    async function fetchData() {
      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch(`/api/market/chart?coinId=${coinId}&days=${days}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch chart data');
        }
        const data = await response.json();
        const chartData: LineData[] = data.prices.map((price: [number, number]) => ({
          time: price[0] / 1000,
          value: price[1],
        }));
        seriesRef.current?.setData(chartData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [coinId, days]);

  return (
    <div className="chart-component">
      <h3>Market Chart</h3>
      <div className="chart-controls">
        <button onClick={() => setDays(1)} className={days === 1 ? 'active' : ''}>24H</button>
        <button onClick={() => setDays(7)} className={days === 7 ? 'active' : ''}>7D</button>
        <button onClick={() => setDays(30)} className={days === 30 ? 'active' : ''}>30D</button>
      </div>
      <div ref={chartContainerRef} className="chart-container" />
      {isLoading && <p>Loading chart data...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
