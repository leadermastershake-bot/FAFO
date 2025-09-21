import React, { useState, useEffect } from 'react';
import './Panel.css';
import './DatabasePanel.css';

const DatabasePanel = () => {
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/database-status');
        const data = await response.json();
        setDbStatus(data);
      } catch (error) {
        console.error('Failed to fetch database status:', error);
      }
    };

    fetchDbStatus();
    const interval = setInterval(fetchDbStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (!dbStatus) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span>🗃️ Database Management</span>
        </div>
        <div className="panel-content">Loading...</div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span>🗃️ Database Management</span>
      </div>
      <div className="panel-content">
        <div className="database-stats">
          <div className="stat-card">
            <div className="stat-value">{(dbStatus.records / 1000000).toFixed(1)}M</div>
            <div className="stat-label">Records</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dbStatus.size}</div>
            <div className="stat-label">Size</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{dbStatus.backups}</div>
            <div className="stat-label">Backups</div>
          </div>
        </div>

        <div className="backup-schedule">
          <h4>⏰ Backup Schedule</h4>
          <div className="backup-info">
            <span>Next Backup:</span>
            <span>{dbStatus.nextBackup}</span>
          </div>
          <div className="backup-info">
            <span>Last Backup:</span>
            <span>{dbStatus.lastBackup}</span>
          </div>
        </div>

        <div className="db-actions">
          <button>💾 Create Manual Backup</button>
          <button>📊 Analyze Data</button>
          <button>⚡ Optimize</button>
        </div>
      </div>
    </div>
  );
};

export default DatabasePanel;
