import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { IBlockchainService } from './IBlockchainService';
import erc20Abi from '../erc20.abi.json';

dotenv.config();

export class EthereumService implements IBlockchainService {
  private provider: ethers.JsonRpcProvider | undefined;
  private wallet: ethers.Wallet | undefined;
  private isConfigured = false;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    const rpcUrl = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (rpcUrl && privateKey && !rpcUrl.includes("YOUR_INFURA_PROJECT_ID") && !privateKey.includes("YOUR_PRIVATE_KEY")) {
      try {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.isConfigured = true;
        console.log("Ethers service configured successfully.");
      } catch (error: any) {
        console.error("Failed to configure Ethers service:", error.message);
        this.isConfigured = false;
      }
    } else {
      console.warn("Ethers service is not configured. Please provide RPC_URL and PRIVATE_KEY in .env file or use the configuration API.");
      this.isConfigured = false;
    }
  }

  getStatus() {
    return {
      isConfigured: this.isConfigured,
      address: this.isConfigured && this.wallet ? this.wallet.address : null
    };
  }

  async getBalance(): Promise<string> {
    if (!this.isConfigured || !this.provider || !this.wallet) {
      throw new Error('Service not configured');
    }
    try {
      const balanceWei = await this.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balanceWei);
    } catch (error: any) {
      console.error('Error getting balance:', error.message);
      throw new Error('Could not get wallet balance.');
    }
  }

  configure(newRpcUrl: string, newPrivateKey: string) {
      process.env.RPC_URL = newRpcUrl;
      process.env.PRIVATE_KEY = newPrivateKey;
      this.initializeService();
      return this.getStatus();
  }

  private getContract(contractAddress: string): ethers.Contract {
      if (!this.isConfigured || !this.wallet) throw new Error('Service not configured');
      return new ethers.Contract(contractAddress, erc20Abi, this.wallet);
  }

  async approve(contractAddress: string, spender: string, amount: string): Promise<string> {
      const contract = this.getContract(contractAddress);
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.approve(spender, amountWei);
      await tx.wait();
      return tx.hash;
  }

  async transfer(contractAddress: string, to: string, amount: string): Promise<string> {
      const contract = this.getContract(contractAddress);
      const amountWei = ethers.parseEther(amount);
      const tx = await contract.transfer(to, amountWei);
      await tx.wait();
      return tx.hash;
  }
}
