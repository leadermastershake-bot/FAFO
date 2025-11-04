import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TradeService {
  /**
   * Creates a new trade record when a user acts on an AI suggestion.
   * @param actionId The ID of the AIAction that inspired the trade.
   * @param asset The asset being traded.
   * @param quantity The quantity of the asset.
   * @param entryPrice The price at which the trade was entered.
   * @returns The newly created trade.
   */
  async createTrade(actionId: string, asset: string, quantity: number, entryPrice: number) {
    const trade = await prisma.executedTrade.create({
      data: {
        actionId,
        asset,
        quantity,
        entryPrice,
        status: 'OPEN',
      },
    });
    return trade;
  }

  /**
   * Closes an open trade, calculating the profit and loss.
   * @param tradeId The ID of the trade to close.
   * @param exitPrice The price at which the trade was exited.
   * @returns The updated trade record.
   */
  async closeTrade(tradeId: string, exitPrice: number) {
    const trade = await prisma.executedTrade.findUnique({ where: { id: tradeId } });
    if (!trade) {
      throw new Error('Trade not found');
    }

    const profitAndLoss = (exitPrice - trade.entryPrice) * trade.quantity;

    const updatedTrade = await prisma.executedTrade.update({
      where: { id: tradeId },
      data: {
        exitPrice,
        profitAndLoss,
        status: 'CLOSED',
        exitTimestamp: new Date(),
      },
    });
    return updatedTrade;
  }

  /**
   * Retrieves all trades for a given user.
   * @param userId The ID of the user.
   * @returns A list of the user's trades.
   */
  async getTradesForUser(userId: string) {
    const trades = await prisma.executedTrade.findMany({
      where: {
        action: {
          userId,
        },
      },
      include: {
        action: true, // Include the original AI action for context
      },
      orderBy: {
        entryTimestamp: 'desc',
      },
    });
    return trades;
  }
}
