import React, { useState } from 'react';
import { MenuBar } from './MenuBar';
import { DraggablePanel } from './DraggablePanel';
import { Trading } from '../Trading';
import { Wallet } from '../Wallet';
import { MarketPanel } from './MarketPanel';
import './DashboardLayout.css';

export const DashboardLayout: React.FC = () => {
  const [activePanels, setActivePanels] = useState<string[]>(['system', 'trading']);

  const togglePanel = (id: string) => {
    setActivePanels(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="dashboard-layout">
      <MenuBar onTogglePanel={togglePanel} activePanels={activePanels} />

      <div className="panel-container">
        {activePanels.includes('system') && (
          <DraggablePanel
            id="system"
            title="System Status"
            onClose={() => togglePanel('system')}
            initialPosition={{ x: 20, y: 60 }}
          >
            <div className="system-status-content">
              <p>CPU: 12%</p>
              <p>Memory: 450MB</p>
              <p>Uptime: 02:45:12</p>
              <p>Network: Optimal</p>
            </div>
          </DraggablePanel>
        )}

        {activePanels.includes('market') && (
          <DraggablePanel
            id="market"
            title="Live Market"
            onClose={() => togglePanel('market')}
            initialPosition={{ x: 20, y: 250 }}
          >
            <MarketPanel />
          </DraggablePanel>
        )}

        {activePanels.includes('trading') && (
          <DraggablePanel
            id="trading"
            title="Trading Terminal"
            onClose={() => togglePanel('trading')}
            initialPosition={{ x: 400, y: 60 }}
          >
            <Trading />
          </DraggablePanel>
        )}

        {activePanels.includes('wallet') && (
          <DraggablePanel
            id="wallet"
            title="Server Wallet"
            onClose={() => togglePanel('wallet')}
            initialPosition={{ x: 20, y: 400 }}
          >
            <Wallet />
          </DraggablePanel>
        )}

        {activePanels.includes('agents') && (
          <DraggablePanel
            id="agents"
            title="Agent Tribunal"
            onClose={() => togglePanel('agents')}
            initialPosition={{ x: 850, y: 60 }}
          >
            <AgentsList />
          </DraggablePanel>
        )}

        {activePanels.includes('trades') && (
          <DraggablePanel
            id="trades"
            title="Recent Trades"
            onClose={() => togglePanel('trades')}
            initialPosition={{ x: 400, y: 500 }}
          >
            <TradesList />
          </DraggablePanel>
        )}

        {activePanels.includes('settings') && (
          <DraggablePanel
            id="settings"
            title="Admin Preferences"
            onClose={() => togglePanel('settings')}
            initialPosition={{ x: 850, y: 400 }}
          >
            <SettingsPanel />
          </DraggablePanel>
        )}
      </div>
    </div>
  );
};

const SettingsPanel: React.FC = () => {
  const themes = [
    { name: 'Neon Green', color: '#00ff88' },
    { name: 'Cyber Blue', color: '#0088ff' },
    { name: 'Blood Red', color: '#ff4444' },
    { name: 'Purple Haze', color: '#ff00ff' }
  ];

  const setTheme = (color: string) => {
    document.documentElement.style.setProperty('--primary-color', color);
  };

  return (
    <div className="settings-panel">
      <h4>UI Theme</h4>
      <div className="theme-grid">
        {themes.map(t => (
          <button
            key={t.name}
            onClick={() => setTheme(t.color)}
            style={{ borderColor: t.color, color: t.color }}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const AgentsList: React.FC = () => {
  const [agents, setAgents] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/agents').then(res => res.json()).then(setAgents);
  }, []);

  return (
    <div className="agents-list">
      {agents.map(agent => (
        <div key={agent.id} className="agent-item">
          <span>{agent.name}</span>
          <span className={`status-${agent.status}`}>{agent.status}</span>
        </div>
      ))}
    </div>
  );
};

const TradesList: React.FC = () => {
  const [trades, setTrades] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchTrades = () => {
      fetch('/api/trades').then(res => res.json()).then(setTrades);
    };
    fetchTrades();
    const interval = setInterval(fetchTrades, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trades-list">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Side</th>
            <th>Amount</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <tr key={trade.id}>
              <td>{trade.symbol}</td>
              <td className={trade.side}>{trade.side}</td>
              <td>{trade.amount.toFixed(4)}</td>
              <td>{trade.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
