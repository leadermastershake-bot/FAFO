import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import erc20Abi from './erc20.abi.json';

dotenv.config();

let provider: ethers.JsonRpcProvider;
let wallet: ethers.Wallet;
let isConfigured = false;

function initializeService() {
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
    }
  } else {
    console.warn("Ethers service is not configured. Please provide RPC_URL and PRIVATE_KEY in .env file or use the configuration API.");
    isConfigured = false;
  }
}

// Initial setup
initializeService();

export function getStatus() {
  return {
    isConfigured: isConfigured,
    address: isConfigured ? wallet.address : null
  };
}

export async function getBalance(): Promise<string> {
  if (!isConfigured) throw new Error('Service not configured');
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
    initializeService();
    return getStatus();
}

// --- Smart Contract Functions ---

function getContract(contractAddress: string): ethers.Contract {
    if (!isConfigured) throw new Error('Service not configured');
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

// Conditionally export wallet and provider
export function getWallet(): ethers.Wallet {
    if (!isConfigured) throw new Error('Service not configured');
    return wallet;
}

export function getProvider(): ethers.JsonRpcProvider {
    if (!isConfigured) throw new Error('Service not configured');
    return provider;
}
