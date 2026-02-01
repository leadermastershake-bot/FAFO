import React from 'react';
import './MenuBar.css';

interface MenuBarProps {
  onTogglePanel: (id: string) => void;
  activePanels: string[];
}

export const MenuBar: React.FC<MenuBarProps> = ({ onTogglePanel, activePanels }) => {
  const [isAdvanced, setIsAdvanced] = React.useState(true);

  const menuItems = [
    { id: 'system', label: '📊 System' },
    { id: 'market', label: '💹 Market' },
    { id: 'trading', label: '📈 Trading' },
    { id: 'agents', label: '🤖 Agents' },
    { id: 'trades', label: '📜 Trades' },
    { id: 'wallet', label: '💛 Wallet' },
    { id: 'settings', label: '⚙️ Settings' }
  ];

  return (
    <div className="menu-bar">
      <div className="menu-brand">METABOTPRIME vNext</div>
      <div className="menu-items">
        {menuItems.filter(item => isAdvanced || !['agents', 'trades'].includes(item.id)).map(item => (
          <button
            key={item.id}
            className={`menu-item ${activePanels.includes(item.id) ? 'active' : ''}`}
            onClick={() => onTogglePanel(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button
          className="menu-item toggle-mode"
          onClick={() => setIsAdvanced(!isAdvanced)}
        >
          {isAdvanced ? '🛡️ Advanced' : '🌱 Simple'}
        </button>
      </div>
      <div className="menu-status">Connected</div>
    </div>
  );
};
