import React from 'react';
import { Panel } from './Panel';

interface ChatPanelProps {
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onClose }) => {
  return (
    <Panel title="💬 LLM Communication Hub" onClose={onClose}>
      <div id="chat-log" style={{ height: '80px', overflowY: 'auto', marginBottom: '10px', padding: '10px', background: 'rgba(0, 0, 0, 0.6)', border: '1px solid #004400', borderRadius: '4px', fontSize: '11px' }}></div>
      <input
        type="text"
        id="user-input"
        placeholder="Ask METABOTPRIME LLM..."
        style={{ width: '100%', background: 'rgba(0, 0, 0, 0.7)', border: '1px solid #00ff88', color: '#00ff88', padding: '8px', fontFamily: 'inherit', borderRadius: '4px', fontSize: '12px' }}
      />
    </Panel>
  );
};