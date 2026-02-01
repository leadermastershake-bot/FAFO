import React, { useState, useEffect, useRef } from 'react';
import './Panel.css';
import './ChatPanel.css';

interface Message {
  sender: string;
  text: string;
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'system', text: 'METABOTPRIME v7.0 initialized.' },
    { sender: 'llm', text: 'LLM integration active. Ready for commands.' },
  ]);
  const [input, setInput] = useState('');
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat log when new messages are added
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages([...newMessages, data]);
    } catch (error) {
      console.error('Failed to send chat message:', error);
      const errorMessage = { sender: 'system', text: 'Error: Could not connect to LLM.' };
      setMessages([...newMessages, errorMessage]);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span>💬 LLM Communication Hub</span>
      </div>
      <div className="panel-content chat-panel-content">
        <div className="chat-log" ref={chatLogRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message message-${msg.sender}`}>
              <strong>[{msg.sender.toUpperCase()}]:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask METABOTPRIME..."
          />
          <button onClick={handleSend}>SEND</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
