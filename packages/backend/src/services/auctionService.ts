import { PrismaClient, Auction, Bid } from '@prisma/client';
import { getBlockchainService } from './blockchainServiceFactory';
import { IBlockchainService } from './IBlockchainService';

const prisma = new PrismaClient();

export class AuctionService {
  private blockchainService: IBlockchainService;

  constructor(chain: string) {
    this.blockchainService = getBlockchainService(chain);
  }

  async createAuction(auctionData: Omit<Auction, 'id'>): Promise<Auction> {
    const newAuction = await prisma.auction.create({
      data: {
        ...auctionData,
        status: 'PENDING', // Set initial status
      },
    });
    return newAuction;
  }

  async getAuction(id: string): Promise<Auction | null> {
    return prisma.auction.findUnique({
      where: { id },
      include: { bids: true }, // Include related bids
    });
  }

  async placeBid(auctionId: string, bidData: Omit<Bid, 'id' | 'auctionId' | 'timestamp'>): Promise<Bid> {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction || auction.status !== 'ACTIVE') {
      throw new Error('Auction is not active or does not exist.');
    }

    // This is where the real magic happens. Your bid is your bond.
    // We're securing your commitment on the blockchain.
    await this.blockchainService.transfer(
      '0xYourCollateralVault', // This will be a dynamic, secure contract address
      '0xPlatformTreasury',   // The platform's secure wallet
      bidData.amount.toString()
    );

    const newBid = await prisma.bid.create({
      data: {
        ...bidData,
        auctionId,
        timestamp: new Date(),
      },
    });

    return newBid;
  }

  async getAllAuctions(): Promise<Auction[]> {
    return prisma.auction.findMany({
        where: { status: 'ACTIVE' }, // Only show active auctions for now
    });
  }
}
