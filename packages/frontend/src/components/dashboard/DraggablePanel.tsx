import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { X, Minus, Maximize2 } from 'lucide-react';
import './DraggablePanel.css';

interface DraggablePanelProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

export const DraggablePanel: React.FC<DraggablePanelProps> = ({
  title,
  children,
  onClose,
  initialPosition = { x: 50, y: 50 }
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const nodeRef = React.useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".panel-header"
      defaultPosition={initialPosition}
      bounds="parent"
      disabled={isMaximized}
    >
      <div
        ref={nodeRef}
        className={`draggable-panel ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''}`}
      >
        <div className="panel-header">
          <span className="panel-title">{title}</span>
          <div className="panel-controls">
            <button onClick={() => setIsMinimized(!isMinimized)} title="Minimize">
              <Minus size={14} />
            </button>
            <button onClick={() => setIsMaximized(!isMaximized)} title="Maximize">
              <Maximize2 size={14} />
            </button>
            <button onClick={onClose} title="Close" className="close-btn">
              <X size={14} />
            </button>
          </div>
        </div>
        {!isMinimized && <div className="panel-content">{children}</div>}
      </div>
    </Draggable>
  );
};
