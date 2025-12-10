import React from 'react';
import { Panel } from './Panel';

interface TradingDashboardPanelProps {
  onClose: () => void;
}

export const TradingDashboardPanel: React.FC<TradingDashboardPanelProps> = ({ onClose }) => {
  const handleToggleAutonomousTrading = () => {};
  const handleEmergencyStop = () => {};
  const handleConfigureExchange = () => {};

  return (
    <Panel title="📈 Trading Dashboard" onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '15px', background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 136, 255, 0.2))', borderRadius: '8px', marginBottom: '15px' }}>
        <div style={{ fontSize: '18px' }}>💰 Current Capital: $<span id="current-capital">0.00</span></div>
        <div>🎯 Target: $<span id="target-amount">1000.00</span></div>
        <div style={{ color: '#00ff88' }}>📊 Progress: <span id="progress-percent">0.0%</span></div>
      </div>

      <div className="wallet-grid">
        <div className="wallet-card active" id="trading-wallet">
          <div>🦾 Trading Wallet</div>
          <div>$<span id="trading-balance">0.00</span></div>
        </div>
        <div className="wallet-card" id="holding-wallet">
          <div>💎 Holding Wallet</div>
          <div>$<span id="holding-balance">0.00</span></div>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 0, 100, 0.1)', border: '1px solid #ff0066', borderRadius: '8px', padding: '15px', margin: '15px 0' }}>
        <h4>🤖 Autonomous Trading</h4>
        <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
          <button id="auto-trade-btn" onClick={handleToggleAutonomousTrading} className="primary">⏳ Configuring...</button>
          <button onClick={handleEmergencyStop} className="danger">🛑 Emergency Stop</button>
        </div>
        <div style={{ margin: '10px 0' }}>
          Risk Level:
          <select id="risk-level">
            <option value="conservative">Conservative (5%)</option>
            <option value="moderate" selected>Moderate (15%)</option>
            <option value="aggressive">Aggressive (35%)</option>
          </select>
        </div>
      </div>

      <div style={{ background: 'rgba(0, 100, 255, 0.1)', border: '1px solid #0066cc', borderRadius: '8px', padding: '15px', margin: '15px 0' }}>
        <h4>🔌 Exchange Configuration</h4>
        <button onClick={handleConfigureExchange} style={{ width: '100%' }}>⚙️ Configure Exchange API</button>
        <div style={{ fontSize: '11px', marginTop: '8px' }}>Status: <span id="exchange-status" style={{ color: '#ff4444' }}>Not Connected</span></div>
      </div>
    </Panel>
  );
};
