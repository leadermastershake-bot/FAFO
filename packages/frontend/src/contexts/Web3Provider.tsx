import { BrowserProvider, Eip1193Provider, ethers } from 'ethers';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface IWeb3Context {
  provider: BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<IWeb3Context | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    const windowAsAny = window as any;
    if (windowAsAny.ethereum) {
      try {
        const ethProvider = new BrowserProvider(windowAsAny.ethereum as Eip1193Provider);
        const accounts = await ethProvider.send('eth_requestAccounts', []);
        const signerInstance = await ethProvider.getSigner();

        setProvider(ethProvider);
        setSigner(signerInstance);
        setAddress(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
  }, []);

  const value: IWeb3Context = {
    provider,
    signer,
    address,
    isConnected: !!signer,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}
