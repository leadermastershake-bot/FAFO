import prisma, { checkDatabaseConnection } from './prismaService';

export interface AgentData {
  id: string;
  name: string;
  status: string;
  performance: number;
  capabilities: string[];
}

export interface TradeData {
  id: string;
  symbol: string;
  side: string;
  amount: number;
  price: number;
  timestamp: Date;
  agentId?: string;
  xaiReason?: string;
}

const AGENT_NAMES = [
  'Strategist',
  'Risk Manager',
  'Market Scanner',
  'Sentiment Analyst',
  'Execution Agent',
  'Compliance Officer',
  'Auditor'
];

let memoryAgents: AgentData[] = [];
let memoryTrades: TradeData[] = [];

export async function initializeAgents() {
  const isDbConnected = await checkDatabaseConnection();
  if (isDbConnected) {
    const count = await prisma.agent.count();
    if (count === 0) {
      console.log('Initializing 7-agent tribunal in DB...');
      for (const name of AGENT_NAMES) {
        await prisma.agent.create({
          data: {
            name,
            status: 'active',
            performance: 0.8 + Math.random() * 0.2,
            capabilities: getCapabilitiesForAgent(name)
          }
        });
      }
    }
  } else {
    console.warn('DB not connected, initializing agents in memory.');
    memoryAgents = AGENT_NAMES.map((name, i) => ({
      id: `mem_agent_${i}`,
      name,
      status: 'active',
      performance: 0.8 + Math.random() * 0.2,
      capabilities: getCapabilitiesForAgent(name)
    }));
  }
}

function getCapabilitiesForAgent(name: string): string[] {
  switch (name) {
    case 'Strategist': return ['strategy_generation', 'pattern_recognition'];
    case 'Risk Manager': return ['risk_assessment', 'portfolio_balancing'];
    case 'Market Scanner': return ['data_collection', 'opportunity_detection'];
    case 'Sentiment Analyst': return ['social_listening', 'nlp'];
    case 'Execution Agent': return ['trade_execution', 'order_management'];
    case 'Compliance Officer': return ['policy_enforcement', 'regulatory_check'];
    case 'Auditor': return ['performance_tracking', 'integrity_validation'];
    default: return ['general_assistance'];
  }
}

export async function getAgents() {
  if (await checkDatabaseConnection()) {
    return await prisma.agent.findMany();
  }
  return memoryAgents;
}

export async function createAgent(data: any) {
  if (await checkDatabaseConnection()) {
    return await prisma.agent.create({ data });
  }
  const newAgent = { ...data, id: `mem_agent_${Date.now()}` };
  memoryAgents.push(newAgent);
  return newAgent;
}

export async function getTrades() {
  if (await checkDatabaseConnection()) {
    return await prisma.trade.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }
  return [...memoryTrades].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);
}

export async function simulateTrading() {
  if (Math.random() > 0.7) {
    const agents = await getAgents();
    const executionAgent = agents.find(a => a.name === 'Execution Agent');
    const strategist = agents.find(a => a.name === 'Strategist');

    const symbols = ['BTC/USD', 'ETH/USD', 'SOL/USD'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const amount = Math.random() * 0.1;
    const price = symbol === 'BTC/USD' ? 60000 + Math.random() * 1000 : 2500 + Math.random() * 100;

    const xaiReasons = [
      `RSI is showing oversold conditions on ${symbol}.`,
      `MACD crossover detected on the 4h chart.`,
      `Sentiment analysis indicates high bullish momentum for ${symbol}.`,
      `Whale wallet movements suggest a potential breakout.`,
      `Risk Manager approved increased exposure to ${symbol}.`
    ];
    const xaiReason = xaiReasons[Math.floor(Math.random() * xaiReasons.length)];

    const tradeData = {
      symbol,
      side,
      amount,
      price,
      agentId: executionAgent?.id,
      xaiReason: `Decision by ${strategist?.name}: ${xaiReason}`,
      timestamp: new Date()
    };

    if (await checkDatabaseConnection()) {
      await prisma.trade.create({ data: tradeData });
    } else {
      memoryTrades.push({ ...tradeData, id: `mem_trade_${Date.now()}` });
    }

    console.log(`Trade simulated: ${side} ${amount} ${symbol} at ${price}`);
  }
}
