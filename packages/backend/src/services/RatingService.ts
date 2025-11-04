import { PrismaClient, ExecutedTrade } from '@prisma/client';

const prisma = new PrismaClient();

// A mock service to get historical market data
class MarketHistoryService {
  async getAveragePrice(asset: string, start: Date, end: Date): Promise<number> {
    // In a real scenario, this would query a historical data API
    console.log(`Fetching average price for ${asset} between ${start} and ${end}`);
    // For now, let's simulate a slightly volatile market
    const basePrice = (await new MarketDataService().getRealTimePrices())[asset] || 0;
    return basePrice * (1 + (Math.random() - 0.5) * 0.1); // +/- 5% volatility
  }
}

// Mock of the MarketDataService from AICoreService for access here
class MarketDataService {
    async getRealTimePrices(): Promise<{ [key: string]: number }> {
      return { BTC: 65000, ETH: 3500, SOL: 150 };
    }
}

export class RatingService {
  private marketHistoryService = new MarketHistoryService();

  /**
   * Calculates a sophisticated performance score for a closed trade.
   * @param trade The executed trade to rate.
   * @returns The calculated score and analysis.
   */
  async rateTrade(trade: ExecutedTrade) {
    if (trade.status !== 'CLOSED' || !trade.exitPrice || !trade.exitTimestamp || !trade.profitAndLoss) {
      throw new Error('Cannot rate an open or incomplete trade.');
    }

    // 1. P&L Score (normalized)
    const pnlScore = Math.tanh(trade.profitAndLoss / 1000) * 50 + 50; // Scale to 0-100

    // 2. Duration Score (shorter is better)
    const durationHours = (trade.exitTimestamp.getTime() - trade.entryTimestamp.getTime()) / (1000 * 60 * 60);
    const durationScore = Math.max(0, 100 - durationHours); // Simple linear decay

    // 3. Market Performance Score
    const avgMarketPrice = await this.marketHistoryService.getAveragePrice(trade.asset, trade.entryTimestamp, trade.exitTimestamp);
    const marketPerformance = (trade.exitPrice - avgMarketPrice) / avgMarketPrice;
    const tradePerformance = (trade.exitPrice - trade.entryPrice) / trade.entryPrice;
    const marketBeatScore = (tradePerformance > marketPerformance) ? 100 : 50;

    // 4. Risk Score (mocked for now)
    const initialRiskScore = 75; // Assume moderate risk for now, scale 0-100

    // Final Weighted Score
    const finalScore = (pnlScore * 0.4) + (durationScore * 0.2) + (marketBeatScore * 0.3) + (initialRiskScore * 0.1);

    // 5. Best/Worst Case Scenarios (mocked)
    const bestCase = trade.profitAndLoss * 1.5;
    const worstCase = trade.profitAndLoss * 0.5;

    const rating = {
        finalScore: Math.round(finalScore),
        pnl: trade.profitAndLoss,
        durationHours: Math.round(durationHours),
        marketBeat: tradePerformance > marketPerformance,
        bestCaseScenario: bestCase.toFixed(2),
        worstCaseScenario: worstCase.toFixed(2),
        breakdown: {
            pnlScore: Math.round(pnlScore),
            durationScore: Math.round(durationScore),
            marketBeatScore,
            initialRiskScore,
        }
    };

    // Update the trade with its score
    await prisma.executedTrade.update({
        where: { id: trade.id },
        data: { performanceScore: rating.finalScore }
    });

    return rating;
  }
}
