import React from 'react';
import './MenuBar.css';

interface MenuBarProps {
  username: string;
  accessLevel: string;
  onTogglePanel: (panelId: string) => void;
  onLogout: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ username, accessLevel, onTogglePanel, onLogout }) => {
  return (
    <div className="menu-bar">
      <span style={{ color: '#00ff88', fontWeight: 'bold' }}>METABOTPRIME v6.2</span>
      <div className="menu-separator"></div>
      <div className="menu-item" onClick={() => onTogglePanel('system')}>📊 System</div>
      <div className="menu-item" onClick={() => onTogglePanel('trading')}>📈 Trading</div>
      <div className="menu-item" onClick={() => onTogglePanel('chart')}>📊 Charting</div>
      <div className="menu-item" onClick={() => onTogglePanel('agents')}>🤖 Agents</div>
      <div className="menu-item" onClick={() => onTogglePanel('chat')}>💬 Chat</div>
      <div style={{ marginLeft: 'auto' }}>
        <span id="user-display" style={{ color: '#00ff88' }}>{`${username} (${accessLevel})`}</span>
        <div className="menu-item" onClick={onLogout}>🚪 Logout</div>
      </div>
    </div>
  );
};