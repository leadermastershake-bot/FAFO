export enum AuctionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  startPrice: number;
  status: AuctionStatus;
  bids: string[]; // Array of bid IDs
}
