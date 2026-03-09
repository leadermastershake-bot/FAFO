import React, { createContext, useContext, useState, useEffect } from 'react';

interface MarketData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export interface MarketDataContextType {
  data: MarketData | null;
  lastUpdated: number;
  isLoading: boolean;
  isStale: boolean;
}

const MarketDataContext = createContext<MarketDataContextType>({
  data: null,
  lastUpdated: 0,
  isLoading: true,
  isStale: false
});

export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MarketData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/market');
      const marketData = await response.json();
      setData(marketData);
      setLastUpdated(Date.now());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch every 30s
    return () => clearInterval(interval);
  }, []);

  const isStale = lastUpdated > 0 && (Date.now() - lastUpdated) > 60000;

  return (
    <MarketDataContext.Provider value={{ data, lastUpdated, isLoading, isStale }}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useMarketData = () => useContext(MarketDataContext);
