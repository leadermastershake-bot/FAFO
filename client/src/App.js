import React, { useState } from 'react';
import './App.css';
import SetupWizard from './SetupWizard';
import LoginScreen from './LoginScreen';
import SystemStatusPanel from './SystemStatusPanel';
import TradingDashboardPanel from './TradingDashboardPanel';
import DatabasePanel from './DatabasePanel';
import AgentsPanel from './AgentsPanel';
import ChatPanel from './ChatPanel';
import WalletModal from './WalletModal';
import ErrorBoundary from './ErrorBoundary';
import AdminPanel from './AdminPanel';
import UploadModal from './UploadModal';

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('system');

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'system':
        return <SystemStatusPanel />;
      case 'trading':
        return <TradingDashboardPanel />;
      case 'database':
        return <DatabasePanel />;
      case 'agents':
        return <AgentsPanel />;
      case 'chat':
        return <ChatPanel />;
      case 'admin':
        return user?.accessLevel === 'Admin' ? <AdminPanel user={user} /> : <p>Access Denied</p>;
      default:
        return <SystemStatusPanel />;
    }
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
        <div className={`menu-item ${activePanel === 'system' ? 'active' : ''}`} onClick={() => setActivePanel('system')}>📊 System</div>
        <div className={`menu-item ${activePanel === 'trading' ? 'active' : ''}`} onClick={() => setActivePanel('trading')}>📈 Trading</div>
        <div className={`menu-item ${activePanel === 'database' ? 'active' : ''}`} onClick={() => setActivePanel('database')}>🗃️ Database</div>
        <div className={`menu-item ${activePanel === 'agents' ? 'active' : ''}`} onClick={() => setActivePanel('agents')}>🤖 Agents</div>
        <div className={`menu-item ${activePanel === 'chat' ? 'active' : ''}`} onClick={() => setActivePanel('chat')}>💬 Chat</div>
        {user.accessLevel === 'Admin' && (
          <div className={`menu-item ${activePanel === 'admin' ? 'active' : ''}`} onClick={() => setActivePanel('admin')}>⚙️ Admin</div>
        )}
        <div className="menu-separator"></div>
        <div className="menu-item" onClick={() => setIsWalletModalOpen(true)}>💛 Wallets</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>{user.username} ({user.accessLevel})</span>
          <div className="menu-item" onClick={handleLogout}>🚪 Logout</div>
        </div>
      </div>
      <div className="panels-container">
        <ErrorBoundary>
          {renderPanel()}
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
