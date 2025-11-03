export enum BidStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface Bid {
  id: string;
  auctionId: string;
  bidder: string; // User ID
  amount: number;
  timestamp: Date;
  status: BidStatus;
  isEncrypted: boolean;
}
