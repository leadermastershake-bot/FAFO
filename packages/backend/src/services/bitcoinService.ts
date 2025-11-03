import { IBlockchainService } from './IBlockchainService';

export class BitcoinService implements IBlockchainService {
  getStatus(): { isConfigured: boolean; address: string | null; } {
    throw new Error('Method not implemented.');
  }
  getBalance(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  configure(rpcUrl: string, privateKey: string): { isConfigured: boolean; address: string | null; } {
    throw new Error('Method not implemented.');
  }
  approve(contractAddress: string, spender: string, amount: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  transfer(contractAddress: string, to: string, amount: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
