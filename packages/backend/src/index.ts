import * as dotenv from 'dotenv';
import express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as ethersService from './ethersService';
import * as coingeckoService from './coingeckoService';

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

// --- Wallet and Contract --- (DEPRECATED: Client-side handling)

// --- Market Data ---

app.get('/api/market/chart', async (req, res) => {
  const { coinId, days } = req.query;

  if (!coinId || typeof coinId !== 'string') {
    return res.status(400).json({ error: 'coinId is required' });
  }

  const daysParam = parseInt(days as string, 10);
  if (isNaN(daysParam) || daysParam <= 0) {
    return res.status(400).json({ error: 'A valid number of days is required' });
  }

  try {
    const data = await coingeckoService.getMarketChart(coinId, daysParam);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
