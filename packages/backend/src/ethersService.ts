import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import erc20Abi from './erc20.abi.json';

dotenv.config();

let provider: ethers.JsonRpcProvider | null = null;
let wallet: ethers.Wallet | null = null;
let isConfigured = false;

async function ensureInitialized() {
  if (isConfigured && provider && wallet) return;

  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (rpcUrl && privateKey && !rpcUrl.includes("YOUR_INFURA_PROJECT_ID") && !privateKey.includes("YOUR_PRIVATE_KEY")) {
    try {
      provider = new ethers.JsonRpcProvider(rpcUrl);
      wallet = new ethers.Wallet(privateKey, provider);
      // We don't wait for network detection here to avoid blocking
      isConfigured = true;
      console.log("Ethers service initialized.");
    } catch (error: any) {
      console.error("Failed to initialize Ethers service:", error.message);
      isConfigured = false;
    }
  } else {
    isConfigured = false;
  }
}

// Try to initialize on load
ensureInitialized().catch(() => {});

export function getStatus() {
  if (!isConfigured) {
    initializeService();
  }
  return {
    isConfigured: isConfigured,
    address: wallet?.address || null
  };
}

export async function getBalance(chain: string = 'ethereum'): Promise<string> {
  await ensureInitialized();
  if (!isConfigured) throw new Error('Service not configured');
  try {
    const balanceWei = await provider!.getBalance(wallet!.address);
    return ethers.formatEther(balanceWei);
  } catch (error: any) {
    console.error(`Error getting balance on ${chain}:`, error.message);
    return "0.0";
  }
}

export function configure(newRpcUrl: string, newPrivateKey: string) {
    process.env.RPC_URL = newRpcUrl;
    process.env.PRIVATE_KEY = newPrivateKey;
    isConfigured = false;
    ensureInitialized().catch(() => {});
    return getStatus();
}

// --- Smart Contract Functions ---

async function getContract(contractAddress: string): Promise<ethers.Contract> {
    await ensureInitialized();
    if (!isConfigured) throw new Error('Service not configured');
    return new ethers.Contract(contractAddress, erc20Abi, wallet!);
}

export async function approve(contractAddress: string, spender: string, amount: string, chain: string = 'ethereum'): Promise<string> {
    const contract = await getContract(contractAddress);
    const amountWei = ethers.parseUnits(amount, 18);
    const tx = await contract.approve(spender, amountWei);
    await tx.wait();
    return tx.hash;
}

export async function transfer(contractAddress: string, to: string, amount: string, chain: string = 'ethereum'): Promise<string> {
    const contract = await getContract(contractAddress);
    const amountWei = ethers.parseUnits(amount, 18);
    const tx = await contract.transfer(to, amountWei);
    await tx.wait();
    return tx.hash;
}

export function getWallet(): ethers.Wallet {
    if (!wallet) throw new Error('Wallet not initialized');
    return wallet;
}

export function getProvider(): ethers.JsonRpcProvider {
    if (!provider) throw new Error('Provider not initialized');
    return provider;
}
