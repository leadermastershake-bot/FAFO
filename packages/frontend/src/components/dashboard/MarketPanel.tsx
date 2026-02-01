import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import './MarketPanel.css';

export const MarketPanel: React.FC = () => {
  const { data, lastUpdated, isLoading } = useMarketData();
  const [ageColor, setAgeColor] = useState('#00ff88');

  useEffect(() => {
    const interval = setInterval(() => {
      const age = (Date.now() - lastUpdated) / 1000;
      if (age > 60) {
        setAgeColor('#ff4444'); // Red after 1 minute
      } else if (age > 30) {
        setAgeColor('#ffaa00'); // Orange after 30 seconds
      } else {
        setAgeColor('#00ff88'); // Green when fresh
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (isLoading || !data) return <div>Loading market data...</div>;

  return (
    <div className="market-panel">
      <div className="timestamp" style={{ color: ageColor }}>
        Last Updated: {new Date(lastUpdated).toLocaleTimeString()}
      </div>
      <div className="market-grid">
        {Object.entries(data).map(([id, values]: [string, any]) => (
          <div key={id} className="market-item">
            <div className="market-id">{id.toUpperCase()}</div>
            <div className="market-price">${values.usd.toLocaleString()}</div>
            <div className={`market-change ${values.usd_24h_change >= 0 ? 'up' : 'down'}`}>
              {values.usd_24h_change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
