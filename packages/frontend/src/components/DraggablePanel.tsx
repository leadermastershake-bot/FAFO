import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './DraggablePanel.css';

interface DraggablePanelProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string | number; height: string | number };
}

export const DraggablePanel: React.FC<DraggablePanelProps> = ({
  title,
  children,
  isOpen,
  onClose,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 500, height: 400 },
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState(initialSize);

  const handleMaximize = () => {
    // A simple implementation of maximize
    setSize({ width: '90vw', height: '80vh' });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Draggable
      handle=".panel-header"
      defaultPosition={initialPosition}
      bounds="parent"
    >
      <div className="draggable-panel" style={{ ...size }}>
        <div className="panel-header">
          <span>{title}</span>
          <div className="panel-controls">
            <div className="panel-btn minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>−</div>
            <div className="panel-btn maximize-btn" onClick={handleMaximize}>□</div>
            <div className="panel-btn close-btn" onClick={onClose}>×</div>
          </div>
        </div>
        {!isMinimized && (
          <div className="panel-content">
            {children}
          </div>
        )}
      </div>
    </Draggable>
  );
};
