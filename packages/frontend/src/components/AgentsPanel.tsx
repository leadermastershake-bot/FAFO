import React, { useState, useEffect } from 'react';
import './AgentsPanel.css';

// --- Interfaces ---

interface Agent {
  id: string;
  name: string;
  status: string;
  performance: number;
}

interface Trade {
  id: string;
  amount: number;
  profit: number;
  success: boolean;
  strategy: string;
  explanation: string | null;
  createdAt: string;
  agent: {
    name: string;
  };
}

// --- Component ---

export const AgentsPanel: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setError(null);
      const agentsResponse = await fetch('/api/agents');
      if (!agentsResponse.ok) {
        throw new Error(`Failed to fetch agents: ${agentsResponse.statusText}`);
      }
      const agentsData = await agentsResponse.json();
      setAgents(agentsData);

      const tradesResponse = await fetch('/api/trades');
      if (!tradesResponse.ok) {
        throw new Error(`Failed to fetch trades: ${tradesResponse.statusText}`);
      }
      const tradesData = await tradesResponse.json();
      setTrades(tradesData);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch immediately on mount
    const interval = setInterval(fetchData, 10000); // And then every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (isLoading) {
    return <div>Loading agent data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="agents-panel">

      {/* Agents List */}
      <div className="section-container">
        <h4>Active Agents</h4>
        <div className="agents-list">
          {agents.map(agent => (
            <div key={agent.id} className="agent-card">
              <div className="agent-status">
                <div className={`status-dot ${agent.status === 'active' ? 'active' : ''}`}></div>
                <strong>{agent.name}</strong>
              </div>
              <div className="agent-performance">
                Performance:
                <span className={agent.performance >= 0 ? 'positive' : 'negative'}>
                  {agent.performance.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trades (XAI Display) */}
      <div className="section-container">
        <h4>Recent Trades & Analysis (XAI)</h4>
        <div className="trades-list">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Strategy</th>
                <th>Profit</th>
                <th>Explanation / Reason</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.id}>
                  <td>{trade.agent.name}</td>
                  <td>{trade.strategy}</td>
                  <td className={trade.profit >= 0 ? 'positive' : 'negative'}>
                    ${trade.profit.toFixed(2)}
                  </td>
                  <td className="explanation">{trade.explanation || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
