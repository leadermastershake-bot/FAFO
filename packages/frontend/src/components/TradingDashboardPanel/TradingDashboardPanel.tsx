import React, { useState, useEffect } from 'react';
import './TradingDashboardPanel.css';

interface Trade {
  id: number;
  type: 'BUY' | 'SELL';
  pair: string;
  price: number;
  profit: number;
  success: boolean;
}

interface TradingDashboard {
  currentCapital: number;
  target: number;
  progress: number;
  recentTrades: Trade[];
}

const TradingDashboardPanel: React.FC = () => {
  const [dashboard, setDashboard] = useState<TradingDashboard | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // In a real application, the URL should come from an environment variable
        const response = await fetch('http://localhost:5000/api/trading-dashboard');
        const data: TradingDashboard = await response.json();
        setDashboard(data);
      } catch (error) {
        console.error('Failed to fetch trading dashboard:', error);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (!dashboard) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span>📈 Trading Dashboard</span>
        </div>
        <div className="panel-content">Loading...</div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span>📈 Trading Dashboard</span>
      </div>
      <div className="panel-content">
        <div className="capital-summary">
          <div className="capital-value">${dashboard.currentCapital.toLocaleString()}</div>
          <div className="capital-label">Current Capital</div>
        </div>

        <div className="progress-section">
          <div>Target: ${dashboard.target.toLocaleString()}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${dashboard.progress}%` }}></div>
          </div>
          <div>Progress: {dashboard.progress}%</div>
        </div>

        <div className="trading-controls">
          <h4>🤖 Autonomous Trading</h4>
          <div className="button-group">
            <button className="primary">▶️ Start Auto-Trading</button>
            <button className="danger">🛑 Emergency Stop</button>
          </div>
        </div>

        <div className="recent-performance">
          <h4>📊 Recent Performance</h4>
          <div className="trade-log">
            {dashboard.recentTrades.map(trade => (
              <div key={trade.id} className={`trade-item ${trade.success ? 'success' : 'failure'}`}>
                <span>{trade.type} {trade.pair} @ {trade.price}</span>
                <span>{trade.profit > 0 ? '+' : ''} ${trade.profit.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboardPanel;