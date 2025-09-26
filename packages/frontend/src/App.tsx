import React, { useState } from 'react';
import './App.css';
import SetupWizard from './components/SetupWizard/SetupWizard';
import LoginScreen from './components/LoginScreen/LoginScreen';
import SystemStatusPanel from './components/SystemStatusPanel/SystemStatusPanel';
import TradingDashboardPanel from './components/TradingDashboardPanel/TradingDashboardPanel';
import DatabasePanel from './components/DatabasePanel/DatabasePanel';
import AgentsPanel from './components/AgentsPanel/AgentsPanel';
import ChatPanel from './components/ChatPanel/ChatPanel';
import WalletModal from './components/WalletModal/WalletModal';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Define the User type
interface User {
  username: string;
  accessLevel: string;
}

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!isSetupComplete) {
    return <SetupWizard onSetupComplete={() => setIsSetupComplete(true)} />;
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
        <span style={{ fontWeight: 'bold' }}>METABOTPRIME v7.0 (React)</span>
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