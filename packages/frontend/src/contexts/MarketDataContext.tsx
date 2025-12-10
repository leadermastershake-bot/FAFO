import React, { createContext, useContext, useEffect, useState } from 'react';
import { marketDataService, type MarketData } from '../services/marketDataService';

interface MarketDataContextValue {
  data: MarketData | null;
  isStale: boolean;
}

const MarketDataContext = createContext<MarketDataContextValue>({
  data: null,
  isStale: false,
});

export const useMarketData = () => useContext(MarketDataContext);

export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const handleData = (newData: MarketData) => {
      setData(newData);
    };

    marketDataService.subscribe(handleData);
    marketDataService.start();

    return () => {
      marketDataService.unsubscribe(handleData);
      marketDataService.stop();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data && Date.now() - data.timestamp > 60000) {
        setIsStale(true);
      } else {
        setIsStale(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <MarketDataContext.Provider value={{ data, isStale }}>
      {children}
    </MarketDataContext.Provider>
  );
};