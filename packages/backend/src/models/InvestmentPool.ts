export interface InvestmentPool {
  id: string;
  auctionId: string;
  members: { userId: string; amount: number }[];
  totalAmount: number;
}
