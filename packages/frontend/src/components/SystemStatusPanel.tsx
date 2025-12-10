import React from 'react';
import { Panel } from './Panel';
import { useMarketData } from '../contexts/MarketDataContext';

interface SystemStatusPanelProps {
  onClose: () => void;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ onClose }) => {
  const { isStale } = useMarketData();
  const handleHealthCheck = () => {};
  const handleOptimizeSystem = () => {};
  const handleGenerateReport = () => {};
  const handleLlmDiagnose = () => {};

  return (
    <Panel title="🤖 METABOTPRIME System" onClose={onClose}>
      <div><span className="status-dot active"></span>System: <span id="system-status">Online</span></div>
      <div>🧠 Learning Mode: <span id="learning-mode">Active</span></div>
      <div>⚡ Active Agents: <span id="active-agents">0</span></div>
      <div>📊 Database: <span id="db-status">Configuring...</span></div>
      <div>🎯 Success Rate: <span id="success-rate">0%</span></div>
      <div>💹 Total Trades: <span id="total-trades">0</span></div>
      <div>⏱️ Uptime: <span id="uptime">00:00:00</span></div>

      <div style={{ marginTop: '15px' }}>
        <div>🔐 Security Level: <span id="security-level">HIGH</span></div>
        <div>🌐 Network Health: <span id="network-health" style={{ color: isStale ? '#ff4444' : '#00ff88' }}>{isStale ? 'STALE DATA' : 'OPTIMAL'}</span></div>
        <div>⚖️ System Load: <span id="system-load">12%</span></div>
        <div>🧠 LLM Status: <span id="llm-status">Ready</span></div>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h4>🔧 Quick Actions</h4>
        <button onClick={handleHealthCheck} style={{ width: '100%', margin: '5px 0' }}>🏥 Health Check</button>
        <button onClick={handleOptimizeSystem} style={{ width: '100%', margin: '5px 0' }}>⚡ Optimize System</button>
        <button onClick={handleGenerateReport} style={{ width: '100%', margin: '5px 0' }}>📋 Generate Report</button>
        <button onClick={handleLlmDiagnose} style={{ width: '100%', margin: '5px 0' }} className="admin">🧠 LLM Diagnose</button>
      </div>
    </Panel>
  );
};
