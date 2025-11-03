import React, { useState, useEffect } from 'react';
import './DatabaseWizard.css';

export function DatabaseWizard() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionString, setConnectionString] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    // Check the database status when the component mounts
    fetch('/api/database/status')
      .then(res => res.json())
      .then(data => {
        if (data.isConfigured) {
          setIsConfigured(true);
        } else {
          setShowWizard(true);
        }
      });
  }, []);

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/database/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Configuration failed');

      setMessage('Configuration successful! Please restart the server to apply the changes.');
      setShowWizard(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!showWizard) {
    return null; // Don't render anything if configured or not yet checked
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
