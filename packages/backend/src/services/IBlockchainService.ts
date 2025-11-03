export interface IBlockchainService {
  getStatus(): { isConfigured: boolean; address: string | null };
  getBalance(): Promise<string>;
  configure(rpcUrl: string, privateKey: string): { isConfigured: boolean; address: string | null };
  approve(contractAddress: string, spender: string, amount: string): Promise<string>;
  transfer(contractAddress: string, to: string, amount: string): Promise<string>;
}
