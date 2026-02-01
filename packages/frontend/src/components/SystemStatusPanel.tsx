import React, { useState, useEffect } from 'react';
import './Panel.css'; // Using a generic panel stylesheet

interface SystemStatus {
  status: string;
  learningMode: string;
  activeAgents: number;
  databaseStatus: string;
  successRate: string;
  totalTrades: number;
  uptime: string;
}

const SystemStatusPanel: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/system-status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span>🤖 METABOTPRIME System</span>
        </div>
        <div className="panel-content">Loading...</div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span>🤖 METABOTPRIME System</span>
      </div>
      <div className="panel-content">
        <div className="status-item">
          <div><span className="status-dot active"></span>System Status</div>
          <span>{status.status}</span>
        </div>
        <div className="status-item">
          <div>🧠 Learning Mode</div>
          <span>{status.learningMode}</span>
        </div>
        <div className="status-item">
          <div>⚡ Active Agents</div>
          <span>{status.activeAgents}</span>
        </div>
        <div className="status-item">
          <div>📊 Database</div>
          <span>{status.databaseStatus}</span>
        </div>
        <div className="status-item">
          <div>🎯 Success Rate</div>
          <span>{status.successRate}</span>
        </div>
        <div className="status-item">
          <div>💹 Total Trades</div>
          <span>{status.totalTrades}</span>
        </div>
        <div className="status-item">
          <div>⏱️ Uptime</div>
          <span>{status.uptime}</span>
        </div>

        <div className="quick-actions">
          <h4>🔧 Quick Actions</h4>
          <button>🏥 Health Check</button>
          <button>⚡ Optimize System</button>
          <button>📋 Generate Report</button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPanel;
