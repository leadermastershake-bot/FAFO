import { ethers } from 'ethers';
import erc20Abi from './erc20.abi.json';

let provider: ethers.JsonRpcProvider | undefined;
let wallet: ethers.Wallet | undefined;
let isConfigured = false;

function _initializeService() {
  if (isConfigured) return;

  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (rpcUrl && privateKey && !rpcUrl.includes("YOUR_INFURA_PROJECT_ID") && !privateKey.includes("YOUR_PRIVATE_KEY")) {
    try {
      provider = new ethers.JsonRpcProvider(rpcUrl);
      wallet = new ethers.Wallet(privateKey, provider);
      isConfigured = true;
      console.log("Ethers service configured successfully.");
    } catch (error: any) {
      console.error("Failed to configure Ethers service:", error.message);
      isConfigured = false;
      provider = undefined;
      wallet = undefined;
    }
  } else {
    isConfigured = false;
    provider = undefined;
    wallet = undefined;
  }
}

function ensureInitialized() {
  if (!isConfigured) {
    _initializeService();
  }
}

export function getStatus() {
  ensureInitialized();
  return {
    isConfigured: isConfigured,
    address: wallet ? wallet.address : null
  };
}

export async function getBalance(): Promise<string> {
  ensureInitialized();
  if (!provider || !wallet) throw new Error('Service not configured');
  try {
    const balanceWei = await provider.getBalance(wallet.address);
    return ethers.formatEther(balanceWei);
  } catch (error: any) {
    console.error('Error getting balance:', error.message);
    throw new Error('Could not get wallet balance.');
  }
}

export function configure(newRpcUrl: string, newPrivateKey: string) {
    process.env.RPC_URL = newRpcUrl;
    process.env.PRIVATE_KEY = newPrivateKey;
    isConfigured = false;
    provider = undefined;
    wallet = undefined;
    ensureInitialized();
    return getStatus();
}

function getContract(contractAddress: string): ethers.Contract {
    ensureInitialized();
    if (!wallet) throw new Error('Service not configured');
    return new ethers.Contract(contractAddress, erc20Abi, wallet);
}

export async function approve(contractAddress: string, spender: string, amount: string): Promise<string> {
    const contract = getContract(contractAddress);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.approve(spender, amountWei);
    await tx.wait();
    return tx.hash;
}

export async function transfer(contractAddress: string, to: string, amount: string): Promise<string> {
    const contract = getContract(contractAddress);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.transfer(to, amountWei);
    await tx.wait();
    return tx.hash;
}

export function getWallet(): ethers.Wallet {
    ensureInitialized();
    if (!wallet) throw new Error('Service not configured');
    return wallet;
}

export function getProvider(): ethers.JsonRpcProvider {
    ensureInitialized();
    if (!provider) throw new Error('Service not configured');
    return provider;
}
