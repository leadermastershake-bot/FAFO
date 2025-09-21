import { useState, useEffect } from 'react';
import './Wallet.css';

interface WalletStatus {
  address: string;
  balance: string;
}

interface WalletError {
  error: string;
  isConfigured: boolean;
}

export function Wallet() {
  const [status, setStatus] = useState<WalletStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWalletStatus() {
      try {
        const response = await fetch('/api/wallet/balance');
        if (!response.ok) {
          const errorData: WalletError = await response.json();
          if (errorData.isConfigured === false) {
            setError('Backend is not configured.');
          } else {
            throw new Error(errorData.error || 'Failed to fetch wallet status.');
          }
          return;
        }
        const data: WalletStatus = await response.json();
        setStatus(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWalletStatus();
  }, []);

  if (isLoading) {
    return <div className="wallet-container">Loading wallet...</div>;
  }

  if (error) {
    return <div className="wallet-container error">{error}</div>;
  }

  return (
    <div className="wallet-container">
      <h3>Server Wallet</h3>
      {status ? (
        <>
          <p><strong>Address:</strong> {status.address}</p>
          <p><strong>Balance:</strong> {parseFloat(status.balance).toFixed(4)} ETH</p>
        </>
      ) : (
        <p>No wallet information available.</p>
      )}
    </div>
  );
}
