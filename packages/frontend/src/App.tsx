import { useState } from 'react';
import './App.css';
import { LoginScreen } from './components/LoginScreen';
import { MenuBar } from './components/MenuBar';
import { SystemStatusPanel } from './components/SystemStatusPanel';
import { TradingDashboardPanel } from './components/TradingDashboardPanel';
import { ChatPanel } from './components/ChatPanel';
import { ChartingPanel } from './components/ChartingPanel';
import { MultiAgentSystemPanel } from './components/MultiAgentSystemPanel';

function App() {
  const [user, setUser] = useState<{ username: string; accessLevel: string } | null>(null);
  const [visiblePanels, setVisiblePanels] = useState<{ [key: string]: boolean }>({
    system: true,
    trading: true,
    chat: true,
    chart: true,
    agents: true,
  });

  const handleLogin = (username: string, accessLevel: string) => {
    setUser({ username, accessLevel });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleTogglePanel = (panelId: string) => {
    setVisiblePanels(prev => ({ ...prev, [panelId]: !prev[panelId] }));
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <MenuBar
        username={user.username}
        accessLevel={user.accessLevel}
        onTogglePanel={handleTogglePanel}
        onLogout={handleLogout}
      />
      <main className="app-main">
        {visiblePanels.system && <SystemStatusPanel onClose={() => handleTogglePanel('system')} />}
        {visiblePanels.trading && <TradingDashboardPanel onClose={() => handleTogglePanel('trading')} />}
        {visiblePanels.chat && <ChatPanel onClose={() => handleTogglePanel('chat')} />}
        {visiblePanels.chart && <ChartingPanel onClose={() => handleTogglePanel('chart')} />}
        {visiblePanels.agents && <MultiAgentSystemPanel onClose={() => handleTogglePanel('agents')} />}
      </main>
    </div>
  );
}

export default App;
