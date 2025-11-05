import { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Provider';
import { ethers } from 'ethers';
import './Wallet.css';

export function Wallet() {
  const { isConnected, address, provider, connectWallet, disconnectWallet } = useWeb3();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      if (isConnected && provider && address) {
        try {
          const balanceWei = await provider.getBalance(address);
          setBalance(ethers.formatEther(balanceWei));
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    }
    fetchBalance();
  }, [isConnected, provider, address]);

  return (
    <div className="wallet-container">
      <h3>Your Wallet</h3>
      {isConnected && address ? (
        <div>
          <p><strong>Status:</strong> Connected</p>
          <p><strong>Address:</strong> {address}</p>
          {balance !== null && (
            <p><strong>Balance:</strong> {parseFloat(balance).toFixed(4)} ETH</p>
          )}
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <div>
          <p><strong>Status:</strong> Disconnected</p>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
}
