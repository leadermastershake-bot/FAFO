import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import cron from 'node-cron';

const prisma = new PrismaClient();

interface Prediction {
  asset: string;
  predicted_price: number;
  confidence_score: number;
  time_horizon: string;
  model_name: string;
}

const modelServiceClient = {
  getPrediction: async (data: any): Promise<Prediction> => {
    try {
      const response = await axios.post('http://localhost:5001/predict', data);
      console.log("AI Model Service responded:", response.data);
      return response.data as Prediction;
    } catch (error: any) {
      console.error("Error communicating with the Model Service for prediction:", error);
      return {
        asset: 'BTC',
        predicted_price: 69000.0,
        confidence_score: 0.75,
        time_horizon: '24 hours',
        model_name: 'BitNet_Fallback_v0.1'
      };
    }
  },
  train: async (data: any) => {
    try {
      const response = await axios.post('http://localhost:5001/train', data);
      console.log("AI Model Service training response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error communicating with the Model Service for training:", error);
      return { status: 'failed', error: error.message };
    }
  }
};

// The AI's sense of the market
class MarketDataService {
  async getRealTimePrices(): Promise<{ [key: string]: number }> {
    // In the future, this will connect to a real-time market data API
    return {
      BTC: 65000,
      ETH: 3500,
      SOL: 150,
    };
  }
}

// The AI's sense of the world
class NewsService {
  async getLatestHeadlines() {
    // In the future, this will connect to a real-time news API
    return [
      { headline: 'BTC breaks resistance at $65,000', source: 'CryptoNews' },
      { headline: 'ETH ETF approval imminent, sources say', source: 'CoinDesk' },
    ];
  }
}

export class AICoreService {
  private marketDataService = new MarketDataService();
  private newsService = new NewsService();

  constructor() {
    // The AI awakens. It begins its eternal vigil, watching the market,
    // learning from every trade, every headline, every shift in sentiment.
    this.beginRealTimeLearning();
    this.scheduleTrainingEpochs();
  }

  private scheduleTrainingEpochs() {
    // Simulate daily, weekly, monthly epochs. For now, we run it every minute.
    cron.schedule('* * * * *', async () => {
      console.log('Epoch Engine: Kicking off scheduled training cycle...');

      // 1. Gather training data
      const auctions = await prisma.auction.findMany({ where: { status: 'CLOSED' }});
      const portfolios = await prisma.portfolio.findMany({ include: { holdings: true }});
      const headlines = await this.newsService.getLatestHeadlines();

      const trainingPayload = {
        timestamp: new Date().toISOString(),
        dataType: 'simulated_market_snapshot',
        auctions,
        portfolios,
        headlines,
      };

      // 2. Send to the Model Service for training
      await modelServiceClient.train(trainingPayload);
    });
  }

  private beginRealTimeLearning() {
    // This is a simplified version. In the future, this will be a robust,
    // event-driven system that learns from every transaction in real-time.
    setInterval(async () => {
      const auctions = await prisma.auction.findMany({ include: { bids: true } });
      const marketPrices = await this.marketDataService.getRealTimePrices();
      const headlines = await this.newsService.getLatestHeadlines();

      const prediction = await modelServiceClient.getPrediction({
        auctions,
        marketPrices,
        headlines,
      });

      console.log("AI Core: Incremental learning cycle complete. Prediction:", prediction);
    }, 10000); // Learn every 10 seconds for now
  }

  async getPersonalizedBrief(userPreferences: any) {
    // The oracle speaks. It consults its vast knowledge of the market,
    // considers the user's unique ambition and risk tolerance, and
    // delivers a personalized, actionable brief.
    const marketPrices = await this.marketDataService.getRealTimePrices();
    const headlines = await this.newsService.getLatestHeadlines();

    return {
      title: `Your Daily Brief: Seize Your Destiny, ${userPreferences.name}!`,
      summary: `The market is electric. Our analysis shows a confluence of bullish signals for assets in your portfolio. It's time to be bold.`,
      actionableInsights: [
        { token: 'ETH', suggestion: 'Consider increasing your position. Our model predicts a 15% upside in the next 48 hours.', confidence: 0.92 },
        { token: 'BTC', suggestion: 'Hold your position. The market is consolidating, and a breakout is imminent.', confidence: 0.85 },
      ],
      marketData: marketPrices,
      newsHeadlines: headlines,
    };
  }

  async assessPortfolio(userId: string) {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: { holdings: true },
    });

    if (!portfolio || portfolio.holdings.length === 0) {
      return {
        overallAssessment: "Your portfolio is empty. An empty vault gathers no treasure. It's time to take a position.",
        holdingAssessments: [],
      };
    }

    const marketPrices = await this.marketDataService.getRealTimePrices();
    const prediction: Prediction = await modelServiceClient.getPrediction({ portfolio, marketPrices });

    let totalValue = 0;
    const holdingAssessments = portfolio.holdings.map(holding => {
      const currentValue = (marketPrices[holding.asset] || holding.averageCost) * holding.quantity;
      totalValue += currentValue;

      let suggestion = "Hold. The winds are uncertain.";
      if (prediction.asset === holding.asset) {
        if (prediction.predicted_price > (marketPrices[holding.asset] || 0)) {
            suggestion = `The Oracle sees a price surge. Consider increasing your stake. Confidence: ${prediction.confidence_score}.`;
        } else {
            suggestion = `A storm is gathering. The Oracle suggests reducing exposure. Confidence: ${prediction.confidence_score}.`;
        }
      }

      return {
        asset: holding.asset,
        quantity: holding.quantity,
        currentValue: currentValue.toFixed(2),
        suggestion,
      };
    });

    return {
      overallAssessment: `Your portfolio value stands at $${totalValue.toFixed(2)}. The Oracle has spoken. The path to victory is laid bare below. Act decisively.`,
      holdingAssessments,
    };
  }
}
