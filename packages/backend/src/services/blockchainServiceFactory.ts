import { IBlockchainService } from './IBlockchainService';
import { EthereumService } from './ethereumService';
import { SolanaService } from './solanaService';
import { BitcoinService } from './bitcoinService';

const services: { [key: string]: IBlockchainService } = {
  ethereum: new EthereumService(),
  solana: new SolanaService(),
  bitcoin: new BitcoinService(),
};

export function getBlockchainService(chain: string): IBlockchainService {
  const service = services[chain];
  if (!service) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  return service;
}
