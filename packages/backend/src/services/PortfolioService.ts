import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PortfolioService {
  /**
   * Retrieves a user's portfolio or creates one if it doesn't exist.
   * @param userId The ID of the user.
   * @returns The user's portfolio.
   */
  async getOrCreatePortfolio(userId: string) {
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: { holdings: true },
    });

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId,
        },
        include: { holdings: true },
      });
    }

    return portfolio;
  }

  /**
   * Adds or updates a holding in a user's portfolio.
   * @param userId The ID of the user.
   * @param asset The asset identifier (e.g., 'BTC', 'ETH').
   * @param quantity The quantity of the asset held.
   * @param averageCost The average cost of acquiring the asset.
   * @returns The updated portfolio.
   */
  async upsertHolding(userId: string, asset: string, quantity: number, averageCost: number) {
    const portfolio = await this.getOrCreatePortfolio(userId);

    const existingHolding = await prisma.holding.findFirst({
      where: {
        portfolioId: portfolio.id,
        asset,
      },
    });

    if (existingHolding) {
      await prisma.holding.update({
        where: { id: existingHolding.id },
        data: { quantity, averageCost },
      });
    } else {
      await prisma.holding.create({
        data: {
          portfolioId: portfolio.id,
          asset,
          quantity,
          averageCost,
        },
      });
    }

    return this.getOrCreatePortfolio(userId);
  }

  /**
   * Removes a holding from a user's portfolio.
   * @param userId The ID of the user.
   * @param asset The asset identifier to remove.
   * @returns The updated portfolio.
   */
  async removeHolding(userId: string, asset: string) {
    const portfolio = await this.getOrCreatePortfolio(userId);

    await prisma.holding.deleteMany({
        where: {
            portfolioId: portfolio.id,
            asset,
        },
    });

    return this.getOrCreatePortfolio(userId);
  }
}
