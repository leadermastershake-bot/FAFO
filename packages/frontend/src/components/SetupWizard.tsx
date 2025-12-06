import { useState, useEffect } from 'react';
import './SetupWizard.css';

interface Status {
  isConfigured: boolean;
  address: string | null;
}

export function SetupWizard({ onConfigurationSuccess }) {
  const [isConfigured, setIsConfigured] = useState(true);
  const [rpcUrl, setRpcUrl] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/status');
        const data: Status = await response.json();
        setIsConfigured(data.isConfigured);
      } catch (err) {
        setError('Failed to connect to the backend. Please ensure it is running.');
      }
    }
    checkStatus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rpcUrl, privateKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to configure the backend.');
      }

      const result = await response.json();
      if (result.status.isConfigured) {
        setIsConfigured(true);
        onConfigurationSuccess();
      } else {
        throw new Error('Configuration was not successful. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isConfigured) {
    return null; // Don't render anything if the backend is configured
  }

  return (
    <div className="wizard-overlay">
      <div className="wizard-container">
        <h2>METABOTPRIME Setup</h2>
        <p>The backend service is not configured. Please provide your Ethereum RPC URL and a private key for the server wallet.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rpcUrl">RPC URL</label>
            <input
              id="rpcUrl"
              type="text"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              placeholder="e.g., https://mainnet.infura.io/v3/..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="privateKey">Private Key</label>
            <input
              id="privateKey"
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="e.g., 0x..."
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Configuring...' : 'Save Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
}
