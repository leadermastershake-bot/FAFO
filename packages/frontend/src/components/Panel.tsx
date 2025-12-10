import React, { useState } from 'react';
import './Panel.css';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const Panel: React.FC<PanelProps> = ({ title, children, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    // Maximize functionality to be implemented
  };

  return (
    <div className={`draggable-panel ${isMinimized ? 'minimized' : ''}`}>
      <div className="panel-header">
        <span>{title}</span>
        <div className="panel-controls">
          <div className="panel-btn minimize-btn" onClick={handleMinimize}>−</div>
          <div className="panel-btn maximize-btn" onClick={handleMaximize}>□</div>
          <div className="panel-btn close-btn" onClick={onClose}>×</div>
        </div>
      </div>
      <div className="panel-content">
        {!isMinimized && children}
      </div>
    </div>
  );
};
