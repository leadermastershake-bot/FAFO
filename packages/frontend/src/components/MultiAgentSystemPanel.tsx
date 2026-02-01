import React from 'react';
import { Panel } from './Panel';
import { useAgents } from '../contexts/AgentContext';
import type { Agent } from '../services/agentService';
import './MultiAgentSystemPanel.css';

interface MultiAgentSystemPanelProps {
  onClose: () => void;
}

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  return (
    <div className="agent-card">
      <div className="agent-status">
        <div className={`status-dot ${agent.status}`}></div>
        <strong>{agent.name} - {agent.role}</strong>
      </div>
      <div style={{ fontSize: '11px' }}>
        Output: {agent.output}
      </div>
    </div>
  );
};

export const MultiAgentSystemPanel: React.FC<MultiAgentSystemPanelProps> = ({ onClose }) => {
  const agents = useAgents();

  return (
    <Panel title="🤖 Multi-Agent System" onClose={onClose}>
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </Panel>
  );
};
