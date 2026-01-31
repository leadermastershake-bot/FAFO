import * as dotenv from 'dotenv';
import express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as ethersService from './ethersService';
import prisma, { checkDatabaseConnection } from './prismaService';
import * as agentService from './agentService';
import * as marketService from './marketService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// --- Status and Configuration ---

app.get('/', (req, res) => {
  res.send('METABOTPRIME Backend is running!');
});

app.get('/api/status', (req, res) => {
  res.json(ethersService.getStatus());
});

app.get('/api/db-health', async (req, res) => {
  const isAlive = await checkDatabaseConnection();
  if (isAlive) {
    res.json({ status: 'connected' });
  } else {
    res.status(503).json({ status: 'disconnected' });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await agentService.getAgents();
    res.json(agents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const agent = await agentService.createAgent(req.body);
    res.json(agent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trades', async (req, res) => {
  try {
    const trades = await agentService.getTrades();
    res.json(trades);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/market', async (req, res) => {
  try {
    const data = await marketService.getMarketData();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/configure', async (req, res) => {
  const { rpcUrl, privateKey } = req.body;
  if (!rpcUrl || !privateKey) {
    return res.status(400).json({ error: 'rpcUrl and privateKey are required' });
  }
  try {
    const envPath = path.resolve(__dirname, '../.env');
    const newEnvContent = `PORT=${port}\nRPC_URL="${rpcUrl}"\nPRIVATE_KEY="${privateKey}"\n`;
    await fs.writeFile(envPath, newEnvContent);
    const status = ethersService.configure(rpcUrl, privateKey);
    res.json({ message: 'Configuration updated successfully', status });
  } catch (error: any) {
    console.error('Error writing to .env file:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
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

app.post('/api/contract/transfer', async (req, res) => {
    const { contractAddress, to, amount, chain } = req.body;
    if (!contractAddress || !to || !amount) {
        return res.status(400).json({ error: 'contractAddress, to, and amount are required' });
    }
    try {
        const txHash = await ethersService.transfer(contractAddress, to, amount, chain || 'ethereum');
        res.json({ message: 'Transfer successful', txHash });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);

  // Initialize agents and simulation
  try {
    await agentService.initializeAgents();
    setInterval(async () => {
      try {
        await agentService.simulateTrading();
      } catch (err) {
        console.error('Simulation error:', err);
      }
    }, 60000); // Run simulation every minute
  } catch (err) {
    console.error('Failed to initialize agents:', err);
  }
});
