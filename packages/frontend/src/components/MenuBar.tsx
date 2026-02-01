import React from 'react';
import './MenuBar.css';

interface MenuBarProps {
  onTogglePanel: (panelId: string) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onTogglePanel }) => {
  return (
    <div className="menu-bar">
      <span className="menu-brand">METABOTPRIME vNext</span>
      <div className="menu-separator"></div>
      <div className="menu-item" onClick={() => onTogglePanel('system')}>📊 System</div>
      <div className="menu-item" onClick={() => onTogglePanel('trading')}>📈 Trading</div>
      <div className="menu-item" onClick={() => onTogglePanel('database')}>🗃️ Database</div>
      <div className="menu-item" onClick={() => onTogglePanel('agents')}>🤖 Agents</div>
      <div className="menu-item" onClick={() => onTogglePanel('news')}>📰 News</div>
      <div className="menu-separator"></div>
      <div className="menu-item" onClick={() => onTogglePanel('wallets')}>💛 Wallets</div>
      <div className="menu-item admin" onClick={() => onTogglePanel('admin')}>⚙️ Admin</div>
      <div style={{ marginLeft: 'auto' }}>
        <div className="menu-item" onClick={() => alert('Logout clicked!')}>🚪 Logout</div>
      </div>
    </div>
  );
};
