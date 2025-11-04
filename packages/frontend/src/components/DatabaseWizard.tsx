import React, { useState, useEffect } from 'react';
import './DatabaseWizard.css';

export function DatabaseWizard() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionString, setConnectionString] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    console.log("DatabaseWizard: Mounting component and checking status...");
    // Check the database status when the component mounts
    fetch('/api/database/status')
      .then(res => {
        console.log("DatabaseWizard: Received response from /api/database/status", res);
        if (!res.ok) {
            throw new Error(`API returned status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("DatabaseWizard: Parsed status data:", data);
        if (data.isConfigured) {
          console.log("DatabaseWizard: Database is configured. Hiding wizard.");
          setIsConfigured(true);
          setShowWizard(false);
        } else {
          console.log("DatabaseWizard: Database is NOT configured. Showing wizard.");
          setShowWizard(true);
        }
      })
      .catch(err => {
          console.error("DatabaseWizard: Failed to fetch database status:", err);
          setError("Could not connect to the backend. Is the server running?");
          setShowWizard(true); // Show the wizard with an error if the backend is down
      });
  }, []);

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    console.log("DatabaseWizard: Attempting to configure database...");

    try {
      const response = await fetch('/api/database/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString }),
      });

      console.log("DatabaseWizard: Received response from /api/database/configure", response);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Configuration failed');

      console.log("DatabaseWizard: Configuration successful.");
      setMessage('Configuration successful! Please restart the server to apply the changes.');
      setShowWizard(false);
    } catch (err: any) {
      console.error("DatabaseWizard: Configuration failed:", err);
      setError(err.message);
    }
  };

  if (!showWizard) {
    console.log("DatabaseWizard: Not rendering wizard because showWizard is false.");
    return null; // Don't render anything if configured or not yet checked
  }

  console.log("DatabaseWizard: Rendering wizard...");
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
              type="password" // Use password type to obscure the string
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
