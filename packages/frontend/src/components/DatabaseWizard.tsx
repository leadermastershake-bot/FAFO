import React, { useState, useEffect, useCallback } from 'react';
import './DatabaseWizard.css';

export function DatabaseWizard() {
  const [showWizard, setShowWizard] = useState(false);
  const [connectionString, setConnectionString] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const checkStatus = useCallback(async () => {
    console.log("DatabaseWizard: Checking status...");
    try {
      const response = await fetch('/api/database/status');
      const data = await response.json();
      console.log("DatabaseWizard: Status data:", data);
      if (!data.isConfigured) {
        setShowWizard(true);
      } else {
        setShowWizard(false);
      }
    } catch (err) {
      console.error("DatabaseWizard: Failed to fetch status:", err);
      setError("Cannot connect to the backend. Is the server running?");
      setShowWizard(true);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    console.log("DatabaseWizard: Attempting to configure...");

    try {
      const response = await fetch('/api/database/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Configuration failed');

      console.log("DatabaseWizard: Configuration successful.");
      setMessage('Success! The server is restarting with your new configuration. This window will close shortly.');
      setTimeout(() => setShowWizard(false), 5000); // Hide wizard after 5 seconds
    } catch (err: any) {
      console.error("DatabaseWizard: Configuration failed:", err);
      setError(err.message);
    }
  };

  if (!showWizard) {
    return null;
  }

  return (
    <div className="wizard-overlay">
      <div className="wizard-container">
        <h2>Unlock Your Trading Destiny</h2>
        <p className="upbeat-text">
          Welcome, pioneer! To build your empire, you need a secure vault for your data.
          Connect to your MongoDB instance and let's start making history.
        </p>

        <form onSubmit={handleConfigure}>
          <div className="form-group">
            <label htmlFor="connectionString">Your MongoDB Connection String</label>
            <input
              id="connectionString"
              type="password"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              placeholder="mongodb+srv://..."
              required
            />
          </div>
          <button type="submit">Forge Connection</button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="wizard-footer">
          <p>You're in control. Your data, your rules.</p>
        </div>
      </div>
    </div>
  );
}
