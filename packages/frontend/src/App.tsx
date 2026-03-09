import { useState, useEffect } from 'react';
import './App.css';
import { SetupWizard } from './components/SetupWizard';
import LoginScreen from './components/LoginScreen';
import SystemStatusPanel from './components/SystemStatusPanel';
import TradingDashboardPanel from './components/TradingDashboardPanel';
import DatabasePanel from './components/DatabasePanel';
import AgentsPanel from './components/AgentsPanel';
import ChatPanel from './components/ChatPanel';
import WalletModal from './components/WalletModal';
import ErrorBoundary from './components/ErrorBoundary';

interface User {
  username: string;
  accessLevel: string;
}

interface Status {
  isConfigured: boolean;
  address: string | null;
}

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isBackendConfigured, setIsBackendConfigured] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/status');
        const data: Status = await response.json();
        setIsBackendConfigured(data.isConfigured);
        setIsSetupComplete(true);
      } catch (err) {
        console.error('Failed to connect to the backend.');
        setIsBackendConfigured(false);
        setIsSetupComplete(true);
      }
    }
    checkStatus();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!isSetupComplete) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#2563eb', fontWeight: 600 }}>
        Loading system...
      </div>
    );
  }

  if (!isBackendConfigured) {
    return <SetupWizard onConfigurationSuccess={() => setIsBackendConfigured(true)} />;
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const [activePanels, setActivePanels] = useState({
    system: true,
    trading: true,
    database: true,
    agents: true,
    chat: true
  });

  const togglePanel = (panel: keyof typeof activePanels) => {
    setActivePanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  return (
    <div className="app">
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <div className="menu-bar">
        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '18px' }}>METABOTPRIME vNext</span>
        <div className="menu-separator"></div>
        <div className={`menu-item ${activePanels.system ? 'active' : ''}`} onClick={() => togglePanel('system')}>📊 System</div>
        <div className={`menu-item ${activePanels.trading ? 'active' : ''}`} onClick={() => togglePanel('trading')}>📈 Trading</div>
        <div className={`menu-item ${activePanels.database ? 'active' : ''}`} onClick={() => togglePanel('database')}>🗃️ Database</div>
        <div className={`menu-item ${activePanels.agents ? 'active' : ''}`} onClick={() => togglePanel('agents')}>🤖 Agents</div>
        <div className={`menu-item ${activePanels.chat ? 'active' : ''}`} onClick={() => togglePanel('chat')}>💬 Chat</div>
        <div className="menu-separator"></div>
        <div className="menu-item" onClick={() => setIsWalletModalOpen(true)}>💛 Wallets</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#64748b' }}>{user.username} ({user.accessLevel})</span>
          <div className="menu-item" onClick={handleLogout}>🚪 Logout</div>
        </div>
      </div>
      <div className="panels-grid">
        {activePanels.system && (
          <ErrorBoundary>
            <SystemStatusPanel />
          </ErrorBoundary>
        )}
        {activePanels.trading && (
          <ErrorBoundary>
            <TradingDashboardPanel />
          </ErrorBoundary>
        )}
        {activePanels.database && (
          <ErrorBoundary>
            <DatabasePanel />
          </ErrorBoundary>
        )}
        {activePanels.agents && (
          <ErrorBoundary>
            <AgentsPanel />
          </ErrorBoundary>
        )}
        {activePanels.chat && (
          <ErrorBoundary>
            <ChatPanel />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

export default App;
