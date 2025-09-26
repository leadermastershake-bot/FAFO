import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as ethersService from './ethersService';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000; // Changed to 5000 to match legacy server

app.use(cors());
app.use(express.json());

// --- Mock API Endpoints from legacy server ---

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password, accessLevel } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  console.log(`Login attempt for user: ${username} with access level ${accessLevel}`);
  res.json({
    username: username,
    accessLevel: accessLevel,
    message: 'Login successful!'
  });
});

// System Status Data
app.get('/api/system-status', (req, res) => {
  res.json({
    status: 'Online',
    learningMode: 'Active',
    activeAgents: 3,
    databaseStatus: 'Connected',
    successRate: '68%',
    totalTrades: 142,
    uptime: '01:23:45',
  });
});

// Trading Dashboard Data
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

// Database Panel Data
app.get('/api/database-status', (req, res) => {
  res.json({
    records: 1200000,
    size: '256MB',
    backups: 12,
    nextBackup: 'In 3 hours',
    lastBackup: '3 hours ago',
  });
});

// Agents Panel Data
app.get('/api/agents', (req, res) => {
  res.json([
    { id: 'alpha', name: 'ALPHA - Strategy Optimizer', status: 'active', task: 'Analyzing market patterns', performance: 0.75 },
    { id: 'beta', name: 'BETA - Risk Manager', status: 'working', task: 'Monitoring portfolio risk', performance: 0.92 },
    { id: 'gamma', name: 'GAMMA - Network Monitor', status: 'learning', task: 'System health monitoring', performance: -0.15 },
  ]);
});

// Chat Endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  console.log(`Received chat message: ${message}`);
  res.json({
    sender: 'llm',
    text: `Acknowledged: "${message}". Processing...`
  });
});


// --- Ethers Service API ---

app.get('/', (req, res) => {
  res.send('METABOTPRIME Backend is running!');
});

app.get('/api/status', (req, res) => {
  res.json(ethersService.getStatus());
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
});
