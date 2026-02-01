import React, { useState, useEffect } from 'react';
import './App.css'
import { SetupWizard } from './components/SetupWizard'
import LoginScreen from './components/LoginScreen'
import SystemStatusPanel from './components/SystemStatusPanel'
import TradingDashboardPanel from './components/TradingDashboardPanel'
import DatabasePanel from './components/DatabasePanel'
import AgentsPanel from './components/AgentsPanel'
import ChatPanel from './components/ChatPanel'
import WalletModal from './components/WalletModal'
import ErrorBoundary from './components/ErrorBoundary'

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
    return <div className="loading">Loading system...</div>;
  }

  if (!isBackendConfigured) {
    return <SetupWizard />;
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <div className="menu-bar">
        <span style={{ fontWeight: 'bold' }}>METABOTPRIME vNext</span>
        <div className="menu-separator"></div>
        <div className="menu-item">📊 System</div>
        <div className="menu-item">📈 Trading</div>
        <div className="menu-item">🗃️ Database</div>
        <div className="menu-item">🤖 Agents</div>
        <div className="menu-item">💬 Chat</div>
        <div className="menu-separator"></div>
        <div className="menu-item" onClick={() => setIsWalletModalOpen(true)}>💛 Wallets</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>{user.username} ({user.accessLevel})</span>
          <div className="menu-item" onClick={handleLogout}>🚪 Logout</div>
        </div>
      </div>
      <div className="panels-grid">
        <ErrorBoundary>
          <SystemStatusPanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <TradingDashboardPanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <DatabasePanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <AgentsPanel />
        </ErrorBoundary>
        <ErrorBoundary>
          <ChatPanel />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
