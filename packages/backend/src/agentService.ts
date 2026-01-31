import prisma from './prismaService';
import { getDbStatus } from './dbStatus';

// --- Types and Interfaces ---

interface TradeExplanation {
  positive: string[];
  negative: string[];
  neutral: string[];
}

// --- Constants ---

const STRATEGIES = ['Momentum', 'Scalping', 'Mean Reversion', 'Arbitrage'];
const ASSETS = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA'];
const TRADE_EXPLANATIONS: { [key: string]: TradeExplanation } = {
  Momentum: {
    positive: [
      "Asset broke a key resistance level, signaling strong upward momentum.",
      "MACD crossover combined with high volume confirms a bullish trend.",
      "Price is trading above the 50-day and 200-day moving averages."
    ],
    negative: [
      "Failed to break resistance and is showing signs of a reversal.",
      "Volume is decreasing, suggesting the current trend is losing steam."
    ],
    neutral: [
      "Asset is consolidating within a range, waiting for a clear breakout."
    ]
  },
  Scalping: {
    positive: [
      "Identified a small, short-term price anomaly on the 1-minute chart.",
      "High-frequency indicators suggest a brief upward price movement."
    ],
    negative: [
      "The bid-ask spread widened, making this scalp unprofitable.",
      "Detected a 'spoofing' order on the books, indicating a false signal."
    ],
    neutral: [
      "Market volatility is too low for profitable scalping at the moment."
    ]
  },
  'Mean Reversion': {
    positive: [
      "Asset is trading significantly below its 20-day moving average, suggesting it's oversold.",
      "RSI dropped below 30, indicating a potential bounce is imminent."
    ],
    negative: [
      "The asset continues to trend downwards, ignoring oversold signals.",
      "A negative news event is overriding the statistical mean."
    ],
    neutral: [
      "Asset is trading close to its historical mean, no clear signal."
    ]
  },
  Arbitrage: {
    positive: [
      "Detected a price discrepancy for the asset between two exchanges.",
      "Successfully executed a triangular arbitrage opportunity with three related assets."
    ],
    negative: [
      "The price gap closed before the second leg of the trade could be executed.",
      "High network fees on one of the chains made the arbitrage unprofitable."
    ],
    neutral: [
      "Markets appear to be efficient, with no significant arbitrage opportunities."
    ]
  }
};

// --- Private Helper Functions ---

/**
 * Creates a default user and wallet if they don't already exist.
 * This is a temporary measure for development.
 */
export const getOrCreateDefaultUserAndWallet = async () => {
  let user = await prisma.user.findUnique({ where: { username: 'default-user' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'default-user',
        password: 'password', // In a real app, this would be hashed
      },
    });
  }

  let wallet = await prisma.wallet.findFirst({ where: { userId: user.id } });
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        name: 'Default Trading Wallet',
        address: `0x-default-wallet-${Date.now()}`,
        userId: user.id,
        balance: 10000, // Start with a mock balance
      },
    });
  }
  return { user, wallet };
};

const generateExplanation = (strategy: string, success: boolean): string => {
  const explanationSet = TRADE_EXPLANATIONS[strategy];
  if (!explanationSet) {
    return "No explanation available for this strategy.";
  }

  if (success) {
    return explanationSet.positive[Math.floor(Math.random() * explanationSet.positive.length)];
  } else {
    return explanationSet.negative[Math.floor(Math.random() * explanationSet.negative.length)];
  }
}

// --- Public Service Functions ---

/**
 * Creates a new AI agent for a given user.
 * @param name - The name of the agent.
 * @param userId - The ID of the user who owns the agent.
 * @returns The newly created agent.
 */
export const createAgent = async (name: string, userId: string) => {
  return prisma.agent.create({
    data: {
      name,
      userId,
      performance: Math.random() * 20 - 10 // Start with a random performance between -10% and +10%
    },
  });
};

/**
 * Retrieves all agents for a given user.
 * @param userId - The ID of the user.
 * @returns A list of agents.
 */
export const getAgents = async (userId: string) => {
  return prisma.agent.findMany({ where: { userId } });
};


/**
 * Simulates a trading cycle for all active agents.
 */
export const runAgentSimulation = async () => {
  if (getDbStatus().dbStatus !== 'connected') {
    console.log('Database not connected. Skipping agent simulation.');
    return;
  }

  console.log('Running agent simulation...');
  const { user, wallet } = await getOrCreateDefaultUserAndWallet();

  // Create default agents if none exist
  let agents = await prisma.agent.findMany({ where: { userId: user.id } });
  if (agents.length === 0) {
    console.log('No agents found, creating defaults...');
    await prisma.agent.createMany({
      data: [
        { name: 'Momentum Master', userId: user.id, status: 'active', performance: 12.5 },
        { name: 'Scalping Pro', userId: user.id, status: 'active', performance: 5.2 },
        { name: 'Mean Reversion Bot', userId: user.id, status: 'active', performance: -2.1 },
      ],
    });
    agents = await prisma.agent.findMany({ where: { userId: user.id } });
  }

  for (const agent of agents) {
    // Each agent has a 30% chance to make a trade in each cycle
    if (Math.random() > 0.7) {
      continue;
    }

    const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)];
    const success = Math.random() < 0.65; // 65% success rate
    const amount = Math.random() * 1000 + 100; // Trade size between 100 and 1100
    const profit = (Math.random() * 0.1) * amount * (success ? 1 : -1); // Up to 10% profit or loss

    await prisma.trade.create({
      data: {
        amount,
        profit,
        success,
        strategy,
        walletId: wallet.id,
        agentId: agent.id,
        explanation: generateExplanation(strategy, success),
      },
    });

    // Update agent performance
    await prisma.agent.update({
      where: { id: agent.id },
      data: { performance: { increment: profit / amount * 100 } },
    });

     // Update wallet balance
     await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: profit } },
      });

    console.log(`Agent '${agent.name}' executed a '${strategy}' trade. Profit: ${profit.toFixed(2)}`);
  }
};

/**
 * Retrieves the most recent trades.
 * @param limit - The number of trades to retrieve.
 * @returns A list of recent trades with their associated agent.
 */
export const getRecentTrades = async (limit: number = 20) => {
  return prisma.trade.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      agent: {
        select: {
          name: true,
        },
      },
    },
  });
};
