import * as dotenv from 'dotenv';
import express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as ethersService from './ethersService';
import prisma from './prismaService';
import * as agentService from './agentService';
import { getDbStatus, checkDbConnection } from './dbStatus';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// --- Status and Configuration ---

app.get('/', (req, res) => {
  res.send('METABOTPRIME Backend is running!');
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

app.post('/api/configure/database', async (req, res) => {
  const { databaseUrl } = req.body;
  if (!databaseUrl) {
    return res.status(400).json({ error: 'databaseUrl is required' });
  }
  try {
    const envPath = path.resolve(__dirname, '../.env');
    // Read the existing .env file
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (e) {
      // .env file might not exist, that's fine
    }

    // Update the DATABASE_URL
    const lines = envContent.split('\n');
    let dbUrlSet = false;
    const newLines = lines.map(line => {
      if (line.startsWith('DATABASE_URL=')) {
        dbUrlSet = true;
        return `DATABASE_URL="${databaseUrl}"`;
      }
      return line;
    });

    if (!dbUrlSet) {
      newLines.push(`DATABASE_URL="${databaseUrl}"`);
    }

    await fs.writeFile(envPath, newLines.join('\n'));

    // Re-check the database connection
    await checkDbConnection();

    res.json({ message: 'Database configuration updated successfully' });

  } catch (error: any) {
    console.error('Error writing to .env file:', error);
    res.status(500).json({ error: 'Failed to update database configuration' });
  }
});

// --- Agent Endpoints ---

app.get('/api/agents', async (req, res) => {
  // NOTE: In a real app, we'd get the userId from an authenticated session
  const { user } = await agentService.getOrCreateDefaultUserAndWallet();
  try {
    const agents = await agentService.getAgents(user.id);
    res.json(agents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agents', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Agent name is required' });
  }
  // NOTE: In a real app, we'd get the userId from an authenticated session
  const { user } = await agentService.getOrCreateDefaultUserAndWallet();
  try {
    const newAgent = await agentService.createAgent(name, user.id);
    res.status(201).json(newAgent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/trades', async (req, res) => {
  try {
    const trades = await agentService.getRecentTrades(50); // Get last 50 trades
    res.json(trades);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Wallet and Contract ---

app.get('/api/wallet/balance', async (req, res) => {
  try {
    const balance = await ethersService.getBalance();
    res.json({
      address: ethersService.getWallet().address,
      balance: balance
    });
  } catch (error: any) {
    if (error.message === 'Service not configured') {
      return res.status(409).json({ error: error.message, isConfigured: false });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contract/approve', async (req, res) => {
    const { contractAddress, spender, amount } = req.body;
    if (!contractAddress || !spender || !amount) {
        return res.status(400).json({ error: 'contractAddress, spender, and amount are required' });
    }
    try {
        const txHash = await ethersService.approve(contractAddress, spender, amount);
        res.json({ message: 'Approval successful', txHash });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contract/transfer', async (req, res) => {
    const { contractAddress, to, amount } = req.body;
    if (!contractAddress || !to || !amount) {
        return res.status(400).json({ error: 'contractAddress, to, and amount are required' });
    }
    try {
        const txHash = await ethersService.transfer(contractAddress, to, amount);
        res.json({ message: 'Transfer successful', txHash });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);

  // Start the agent simulation loop
  setInterval(agentService.runAgentSimulation, 30000); // Run every 30 seconds
});
