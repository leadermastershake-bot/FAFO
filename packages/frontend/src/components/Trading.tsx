import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Provider';
import erc20Abi from '../erc20.abi.json';
import { Chart } from './Chart';
import './Trading.css';

export function Trading() {
  const { signer, isConnected } = useWeb3();
  const [coinId, setCoinId] = useState('ethereum'); // Default to Ethereum
  const [contractAddress, setContractAddress] = useState('');
  const [spender, setSpender] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    if (!signer || !contractAddress) return;

    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const contract = new ethers.Contract(contractAddress, erc20Abi, signer);
      const amountWei = ethers.parseEther(approveAmount);
      const tx = await contract.approve(spender, amountWei);
      await tx.wait();
      setResult(`Approval successful! Tx Hash: ${tx.hash}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!signer || !contractAddress) return;

    setResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const contract = new ethers.Contract(contractAddress, erc20Abi, signer);
      const amountWei = ethers.parseEther(transferAmount);
      const tx = await contract.transfer(toAddress, amountWei);
      await tx.wait();
      setResult(`Transfer successful! Tx Hash: ${tx.hash}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="trading-container">
      <h2>Advanced Trading</h2>

      <div className="form-group">
        <label htmlFor="coinId">CoinGecko Coin ID</label>
        <input
          id="coinId"
          type="text"
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          placeholder="e.g., bitcoin"
        />
      </div>

      {coinId && <Chart coinId={coinId} />}

      <h3>ERC20 Token Actions</h3>
      {!isConnected ? (
        <p>Please connect your wallet to interact with contracts.</p>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="contractAddress">Token Contract Address</label>
            <input
              id="contractAddress"
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>

          <div className="trading-forms">
            <form onSubmit={handleApprove} className="trading-form">
              <h3>Approve</h3>
              <div className="form-group">
                <label htmlFor="spender">Spender Address</label>
                <input
                  id="spender"
                  type="text"
                  value={spender}
                  onChange={(e) => setSpender(e.target.value)}
                  placeholder="0x..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="approveAmount">Amount</label>
                <input
                  id="approveAmount"
                  type="text"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  placeholder="e.g., 100"
                  required
                />
              </div>
              <button type="submit" disabled={isLoading || !contractAddress}>Approve</button>
            </form>

            <form onSubmit={handleTransfer} className="trading-form">
              <h3>Transfer</h3>
              <div className="form-group">
                <label htmlFor="toAddress">Recipient Address</label>
                <input
                  id="toAddress"
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="0x..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="transferAmount">Amount</label>
                <input
                  id="transferAmount"
                  type="text"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="e.g., 100"
                  required
                />
              </div>
              <button type="submit" disabled={isLoading || !contractAddress}>Transfer</button>
            </form>
          </div>
        </>
      )}

      {isLoading && <p>Transaction in progress...</p>}
      {error && <p className="error-message">{error}</p>}
      {result && <p className="result-message">{result}</p>}
    </div>
  );
}
