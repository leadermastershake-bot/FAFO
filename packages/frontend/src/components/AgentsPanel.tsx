import React, { useState, useEffect } from 'react';
import './Panel.css';
import './AgentsPanel.css';

interface Agent {
  id: string;
  name: string;
  status: string;
  task: string;
  performance: number;
}

const AgentCard: React.FC<Agent> = ({ name, status, task, performance }) => {
  const isPositive = performance >= 0;
  return (
    <div className="agent-card">
      <div className="agent-header">
        <div className={`status-dot ${status}`}></div>
        <span className="agent-name">{name}</span>
        <span className={`performance-badge ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '▲' : '▼'} {(Math.abs(performance) * 100).toFixed(1)}%
        </span>
      </div>
      <div className="agent-task">
        <strong>Current Task:</strong> {task}
      </div>
      <div className="agent-status-text">
        Status: <span className={`status-label ${status}`}>{status.toUpperCase()}</span>
      </div>
    </div>
  );
};

export const AgentsPanel: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };

    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span>🤖 Multi-Agent System</span>
      </div>
      <div className="panel-content agents-panel-container">
        <div className="agents-grid">
          {agents.length === 0 ? (
            <div className="loading-state">Initializing agents...</div>
          ) : (
            agents.map(agent => <AgentCard key={agent.id} {...agent} />)
          )}
        </div>
        <div className="agent-actions">
          <button className="secondary-btn">➕ Deploy New Agent</button>
          <button className="secondary-btn">🔄 Synchronize Tribunal</button>
        </div>
      </div>
    </div>
  );
};

export default AgentsPanel;
