import React, { useState } from 'react';
import { MenuBar } from './MenuBar';
import { DraggablePanel } from './DraggablePanel';
import { AgentsPanel } from './AgentsPanel';

// --- Placeholder Panel Content ---

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ color: '#ccc' }}>
    <p>This is the placeholder content for the {title} panel.</p>
    <p>Implementation is pending in a future phase.</p>
  </div>
);


export const DashboardLayout: React.FC = () => {
  const [panels, setPanels] = useState({
    system: { isOpen: false },
    trading: { isOpen: true }, // Open by default
    database: { isOpen: false },
    agents: { isOpen: false },
    news: { isOpen: false },
    wallets: { isOpen: false },
    admin: { isOpen: false },
  });

  const togglePanel = (panelId: string) => {
    setPanels(prevPanels => ({
      ...prevPanels,
      [panelId]: { ...prevPanels[panelId], isOpen: !prevPanels[panelId].isOpen },
    }));
  };

  return (
    <div className="dashboard-layout">
      <MenuBar onTogglePanel={togglePanel} />

      <main className="dashboard-main">
        {/* Render all the panels. The DraggablePanel component will handle visibility. */}

        <DraggablePanel
          title="Trading"
          isOpen={panels.trading.isOpen}
          onClose={() => togglePanel('trading')}
          initialPosition={{ x: 50, y: 50 }}
        >
          <PlaceholderContent title="Trading" />
        </DraggablePanel>

        <DraggablePanel
          title="System Status"
          isOpen={panels.system.isOpen}
          onClose={() => togglePanel('system')}
          initialPosition={{ x: 100, y: 100 }}
        >
          <PlaceholderContent title="System Status" />
        </DraggablePanel>

        <DraggablePanel
          title="Database Management"
          isOpen={panels.database.isOpen}
          onClose={() => togglePanel('database')}
          initialPosition={{ x: 150, y: 150 }}
        >
          <PlaceholderContent title="Database Management" />
        </DraggablePanel>

        <DraggablePanel
          title="Agents"
          isOpen={panels.agents.isOpen}
          onClose={() => togglePanel('agents')}
          initialPosition={{ x: 200, y: 200 }}
          initialSize={{ width: 700, height: 500 }}
        >
          <AgentsPanel />
        </DraggablePanel>

        {/* Add other panels here as they are developed */}

      </main>
    </div>
  );
};
