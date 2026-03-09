import React, { useState } from 'react';
import { MenuBar } from './MenuBar';
import { DraggablePanel } from './DraggablePanel';
import AgentsPanel from './AgentsPanel';
import { DatabaseWizard } from './DatabaseWizard';

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ color: '#ccc' }}>
    <p>This is the placeholder content for the {title} panel.</p>
    <p>Implementation is pending in a future phase.</p>
  </div>
);


export const DashboardLayout: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');
  const [isConfiguring, setIsConfiguring] = useState(false);

  const [panels, setPanels] = useState({
    system: { isOpen: false },
    trading: { isOpen: true },
    database: { isOpen: false },
    agents: { isOpen: false },
    news: { isOpen: false },
    wallets: { isOpen: false },
    admin: { isOpen: false },
  });

  const togglePanel = (panelId: string) => {
    const id = panelId as keyof typeof panels;
    setPanels(prevPanels => ({
      ...prevPanels,
      [id]: { ...prevPanels[id], isOpen: !prevPanels[id].isOpen },
    }));
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setDbStatus(data.dbStatus || 'disconnected');
      return data.dbStatus === 'connected';
    } catch (error) {
      console.error('Failed to fetch status:', error);
      setDbStatus('disconnected');
      return false;
    }
  };

  const handleConfigureDatabase = async (databaseUrl: string) => {
    setIsConfiguring(true);
    try {
      await fetch('/api/configure/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseUrl }),
      });

      let isConnected = false;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        isConnected = await checkStatus();
        if (isConnected) break;
      }

    } finally {
      setIsConfiguring(false);
    }
  };

  React.useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="dashboard-layout">
      <MenuBar onTogglePanel={togglePanel} />

      {dbStatus === 'disconnected' && (
        <DatabaseWizard onConfigure={handleConfigureDatabase} isLoading={isConfiguring} />
      )}

      <main className="dashboard-main">
        <DraggablePanel
          id="trading"
          title="Trading"
          isOpen={panels.trading.isOpen}
          onClose={() => togglePanel('trading')}
          initialPosition={{ x: 50, y: 50 }}
        >
          <PlaceholderContent title="Trading" />
        </DraggablePanel>

        <DraggablePanel
          id="system"
          title="System Status"
          isOpen={panels.system.isOpen}
          onClose={() => togglePanel('system')}
          initialPosition={{ x: 100, y: 100 }}
        >
          <PlaceholderContent title="System Status" />
        </DraggablePanel>

        <DraggablePanel
          id="database"
          title="Database Management"
          isOpen={panels.database.isOpen}
          onClose={() => togglePanel('database')}
          initialPosition={{ x: 150, y: 150 }}
        >
          <PlaceholderContent title="Database Management" />
        </DraggablePanel>

        <DraggablePanel
          id="agents"
          title="Agents"
          isOpen={panels.agents.isOpen}
          onClose={() => togglePanel('agents')}
          initialPosition={{ x: 200, y: 200 }}
        >
          <AgentsPanel />
        </DraggablePanel>
      </main>
    </div>
  );
};
