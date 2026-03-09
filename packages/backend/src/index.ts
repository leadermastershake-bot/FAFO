import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';
import * as ethersService from './ethersService';
import * as agentService from './agentService';
import prisma from './prismaService';
import { getDbStatus } from './dbStatus';
import { TribunalService } from './services/TribunalService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Middleware ---

const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.issues.map((e: any) => ({ path: e.path, message: e.message }))
    });
  }

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
};

// --- Status and Configuration ---

app.get('/', (req, res) => {
  res.send('METABOTPRIME Backend is running!');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/status', (req, res) => {
  const ethersStatus = ethersService.getStatus();
  const dbStatus = getDbStatus();
  res.json({ ...ethersStatus, ...dbStatus });
});

app.get('/api/db-health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'ok' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

app.post('/api/configure', async (req: any, res: any, next: any) => {
  const schema = z.object({
    rpcUrl: z.string().url(),
    privateKey: z.string().min(64)
  });

  try {
    const { rpcUrl, privateKey } = schema.parse(req.body);
    const envPath = path.resolve(__dirname, '../.env');
    const newEnvContent = `PORT=${port}\nRPC_URL="${rpcUrl}"\nPRIVATE_KEY="${privateKey}"\n`;
    await fs.writeFile(envPath, newEnvContent);
    const status = ethersService.configure(rpcUrl, privateKey);
    res.json({ message: 'Configuration updated successfully', status });
  } catch (error: any) {
    next(error);
  }
});

// --- Auth Endpoints ---

app.post('/api/login', (req, res) => {
  const { username, password, accessLevel } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  res.json({
    username: username,
    accessLevel: accessLevel,
    message: 'Login successful!'
  });
});

// --- Panel Data Endpoints ---

app.get('/api/system-status', (req, res) => {
  res.json({
    status: 'Online',
    learningMode: 'Active',
    activeAgents: 7,
    databaseStatus: 'Connected',
    successRate: '68%',
    totalTrades: 142,
    uptime: '01:23:45',
  });
});

app.get('/api/trading-dashboard', (req, res) => {
  res.json({
    currentCapital: 1234.56,
    target: 10000.00,
    progress: 12.35,
    recentTrades: [
      { id: 1, type: 'BUY', pair: 'BTC/USD', price: 68123.45, profit: 56.78, success: true },
      { id: 2, type: 'SELL', pair: 'ETH/USD', price: 3456.78, profit: -12.34, success: false },
      { id: 3, type: 'BUY', pair: 'SOL/USD', price: 172.50, profit: 23.45, success: true },
    ]
  });
});

app.get('/api/database-status', (req, res) => {
  res.json({
    records: 1200000,
    size: '256MB',
    backups: 12,
    nextBackup: 'In 3 hours',
    lastBackup: '3 hours ago',
  });
});

app.get('/api/agents', (req, res) => {
  res.json([
    { id: 'alpha', name: 'ALPHA - Strategist', status: 'active', task: 'Analyzing patterns', performance: 0.75 },
    { id: 'beta', name: 'BETA - Risk Manager', status: 'active', task: 'Portfolio monitoring', performance: 0.92 },
    { id: 'gamma', name: 'GAMMA - Sentiment Analyst', status: 'active', task: 'Scanning social feeds', performance: -0.15 },
    { id: 'delta', name: 'DELTA - Trade Execution', status: 'active', task: 'Executing orders', performance: 0.45 },
    { id: 'epsilon', name: 'EPSILON - Safety Auditor', status: 'active', task: 'Contract audit', performance: 0.99 },
    { id: 'zeta', name: 'ZETA - Macro Researcher', status: 'active', task: 'CPI correlation', performance: 0.22 },
    { id: 'omega', name: 'OMEGA - Lead Adjudicator', status: 'active', task: 'Conflict resolution', performance: 0.88 },
  ]);
});

app.get('/api/market', (req, res) => {
  res.json({
    bitcoin: { usd: 65000 + Math.random() * 1000, usd_24h_change: 2.5 },
    ethereum: { usd: 3500 + Math.random() * 100, usd_24h_change: -1.2 },
    solana: { usd: 145 + Math.random() * 10, usd_24h_change: 5.4 }
  });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    sender: 'llm',
    text: `Acknowledged: "${message}". Processing...`
  });
});

// --- Wallet and Contract ---

app.get('/api/wallet/balance', async (req, res) => {
  try {
    const chain = (req.query.chain as string) || 'ethereum';
    const balance = await ethersService.getBalance(chain);
    res.json({
      address: ethersService.getWallet().address,
      balance: balance,
      chain
    });
  } catch (error: any) {
    if (error.message === 'Service not configured') {
      return res.status(409).json({ error: error.message, isConfigured: false });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contract/approve', async (req, res) => {
    const { contractAddress, spender, amount, chain } = req.body;
    if (!contractAddress || !spender || !amount) {
        return res.status(400).json({ error: 'contractAddress, spender, and amount are required' });
    }
    try {
        const txHash = await ethersService.approve(contractAddress, spender, amount, chain || 'ethereum');
        res.json({ message: 'Approval successful', txHash });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contract/transfer', async (req: any, res: any, next: any) => {
  const schema = z.object({
    contractAddress: z.string(),
    to: z.string(),
    amount: z.string(),
    chain: z.string().optional()
  });

  try {
    const { contractAddress, to, amount, chain } = schema.parse(req.body);
    const txHash = await ethersService.transfer(contractAddress, to, amount, chain || 'ethereum');
    res.json({ message: 'Transfer successful', txHash });
  } catch (error: any) {
    next(error);
  }
});

app.post('/api/trade/swap', async (req: any, res: any, next: any) => {
  const schema = z.object({
    fromToken: z.string(),
    toToken: z.string(),
    amount: z.string(),
    chain: z.string().optional()
  });

  try {
    const { fromToken, toToken, amount, chain } = schema.parse(req.body);
    const txHash = await ethersService.swapTokens(fromToken, toToken, amount, chain || 'ethereum');
    res.json({ message: 'Swap initiated successfully', txHash });
  } catch (error: any) {
    next(error);
  }
});

// --- Tribunal Service ---

const tribunalService = new TribunalService();

app.post('/api/v1/tribunal/predict', async (req: any, res: any, next: any) => {
  try {
    const result = await tribunalService.getTribunalDecision();
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

// --- Final Middleware ---

app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);

  try {
    await agentService.initializeAgents();
    setInterval(async () => {
      try {
        await agentService.simulateTrading();
      } catch (err) {
        console.error('Simulation error:', err);
      }
    }, 60000);
  } catch (err) {
    console.error('Failed to initialize agents:', err);
  }
});
