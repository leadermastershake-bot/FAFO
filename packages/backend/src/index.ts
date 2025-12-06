import * as dotenv from 'dotenv';
import express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as ethersService from './ethersService';
import * as AICoreService from './AICoreService';

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

// --- AI Core Service ---

app.post('/api/market_data', async (req, res) => {
    const { coin_id, vs_currency, days } = req.body;
    if (!coin_id || !vs_currency || !days) {
        return res.status(400).json({ error: 'coin_id, vs_currency, and days are required' });
    }
    try {
        const marketData = await AICoreService.getMarketData({ coin_id, vs_currency, days });
        res.json({ marketData });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/volatility', async (req, res) => {
    const { coin_id, vs_currency } = req.body;
    if (!coin_id || !vs_currency) {
        return res.status(400).json({ error: 'coin_id and vs_currency are required' });
    }
    try {
        const volatility = await AICoreService.getVolatility({ coin_id, vs_currency });
        res.json({ volatility });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/signal', async (req, res) => {
    const { coin_id, vs_currency, days, indicators } = req.body;
    if (!coin_id || !vs_currency || !days || !indicators) {
        return res.status(400).json({ error: 'coin_id, vs_currency, days, and indicators are required' });
    }
    try {
        const signal = await AICoreService.getTradingSignal({ coin_id, vs_currency, days, indicators });
        res.json({ signal });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
