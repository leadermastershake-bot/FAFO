import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Modal.css';
import './WalletModal.css';

const WalletModal = ({ isOpen, onClose }) => {
  const [wallets, setWallets] = useState([]);
  const [walletType, setWalletType] = useState('metamask');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState('');

  const connectMetaMask = async () => {
    setError('');
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install it to connect.');
      return;
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      const newWallet = {
        id: address,
        name: `MetaMask (${address.substring(0, 6)}...${address.substring(38)})`,
        address: address,
        balance: `${ethers.utils.formatEther(balance).substring(0, 6)} ETH`,
        type: 'metamask',
      };

      // Avoid adding duplicate wallets
      if (!wallets.find(w => w.address === address)) {
        setWallets([...wallets, newWallet]);
      }

    } catch (err) {
      setError('Failed to connect MetaMask. Please try again.');
      console.error('MetaMask connection error:', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💛 Multi-Wallet Management</h3>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>
        <div className="modal-content">
          <div className="wallet-list">
            <h4>🔗 Connected Wallets</h4>
            {wallets.length === 0 ? (
              <p className="no-wallets-msg">No wallets connected. Connect one below.</p>
            ) : (
              wallets.map(wallet => (
                <div key={wallet.id} className="wallet-item">
                  <div>
                    <strong>{wallet.name}</strong>
                    <small>{wallet.address}</small>
                  </div>
                  <span>{wallet.balance}</span>
                </div>
              ))
            )}
          </div>
          <div className="add-wallet-form">
            <h4>➕ Add New Wallet</h4>
            {error && <div className="modal-error">{error}</div>}
            <button onClick={connectMetaMask} className="primary">🦊 Connect MetaMask</button>
            {/* Add buttons for other wallet types here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
