import React, { useState, useEffect } from 'react';
import './Panel.css';
import './AgentsPanel.css';

const AgentCard = ({ name, status, task, performance }) => {
  return (
    <div className="agent-card">
      <div className="agent-status">
        <div className={`status-dot ${status}`}></div>
        <strong>{name}</strong>
      </div>
      <div className="agent-details">
        <div>Task: {task}</div>
        <div>Performance: {performance > 0 ? '+' : ''}{(performance * 100).toFixed(1)}%</div>
      </div>
    </div>
  );
};

const AgentsPanel = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/agents');
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };

    fetchAgents();
    const interval = setInterval(fetchAgents, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span>🤖 Multi-Agent System</span>
      </div>
      <div className="panel-content">
        {agents.length === 0 ? (
          <div>Loading agents...</div>
        ) : (
          agents.map(agent => <AgentCard key={agent.id} {...agent} />)
        )}
        <div className="agent-actions">
          <button>➕ Create New Agent</button>
        </div>
      </div>
    </div>
  );
};

export default AgentsPanel;
