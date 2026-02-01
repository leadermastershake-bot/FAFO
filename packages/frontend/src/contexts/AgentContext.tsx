import React, { createContext, useContext, useEffect, useState } from 'react';
import { agentService, type Agent } from '../services/agentService';

const AgentContext = createContext<Agent[]>([]);

export const useAgents = () => useContext(AgentContext);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const handleAgents = (newAgents: Agent[]) => {
      setAgents([...newAgents]); // Create a new array to trigger re-render
    };

    agentService.subscribe(handleAgents);

    return () => {
      agentService.unsubscribe(handleAgents);
    };
  }, []);

  return (
    <AgentContext.Provider value={agents}>
      {children}
    </AgentContext.Provider>
  );
};