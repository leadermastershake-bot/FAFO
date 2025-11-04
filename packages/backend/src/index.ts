import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getBlockchainService } from './services/blockchainServiceFactory';
import { IBlockchainService } from './services/IBlockchainService';
import { AuctionService } from './services/auctionService';
import { AIService } from './services/AIService';
import { AICoreService } from './services/AICoreService';
import { MongoClient } from 'mongodb';
import portfolioRoutes from './routes/portfolio.routes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;
const aiService = new AIService();
const aiCoreService = new AICoreService();
const envPath = path.resolve(__dirname, '../.env');

app.use(express.json());

// Middleware to get the blockchain service
const withBlockchainService = (handler: (req: Request, res: Response, service: IBlockchainService) => void) => {
  return (req: Request, res: Response) => {
    const chain = req.body.chain || req.query.chain;
    if (!chain || typeof chain !== 'string') {
      return res.status(400).json({ error: 'Chain identifier is required' });
    }
    try {
      const service = getBlockchainService(chain);
      handler(req, res, service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
};

const withAuctionService = (handler: (req: Request, res: Response, service: AuctionService) => void) => {
  return (req: Request, res: Response) => {
    const chain = req.body.chain || req.query.chain || 'ethereum'; // Default to ethereum for now
    if (typeof chain !== 'string') {
      return res.status(400).json({ error: 'Chain identifier must be a string' });
    }
    try {
      const service = new AuctionService(chain);
      handler(req, res, service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
};

// --- Status and Configuration ---

app.get('/', (req, res) => {
  res.send('METABOTPRIME Backend is running!');
});

app.post('/api/status', withBlockchainService((req, res, service) => {
  res.json(service.getStatus());
}));

app.post('/api/configure', withBlockchainService((req, res, service) => {
  const { rpcUrl, privateKey } = req.body;
  if (!rpcUrl || !privateKey) {
    return res.status(400).json({ error: 'rpcUrl and privateKey are required' });
  }
  try {
    const status = service.configure(rpcUrl, privateKey);
    res.json({ message: `Configuration updated successfully for chain: ${req.body.chain}`, status });
  } catch (error: any) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
}));

// --- Database Configuration ---

app.get('/api/database/status', async (req, res) => {
  const isConfigured = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("placeholder");
  res.json({ isConfigured });
});

app.post('/api/database/configure', async (req, res) => {
  const { connectionString } = req.body;
  if (!connectionString) {
    return res.status(400).json({ error: 'MongoDB connection string is required' });
  }

  try {
    // Test the connection
    const client = new MongoClient(connectionString);
    await client.connect();
    await client.close();

    // Save the connection string to the .env file
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (e) {
      // .env file might not exist yet
    }

    const lines = envContent.split('\n');
    const dbUrlLineIndex = lines.findIndex(line => line.startsWith('DATABASE_URL='));
    if (dbUrlLineIndex !== -1) {
      lines[dbUrlLineIndex] = `DATABASE_URL="${connectionString}"`;
    } else {
      lines.push(`DATABASE_URL="${connectionString}"`);
    }

    await fs.writeFile(envPath, lines.join('\n'));

    res.json({ message: 'Database configured successfully. Please restart the server.' });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ error: 'Invalid MongoDB connection string.' });
  }
});


// --- Wallet and Contract ---

app.post('/api/wallet/balance', withBlockchainService(async (req, res, service) => {
  try {
    const balance = await service.getBalance();
    const status = service.getStatus();
    res.json({
      address: status.address,
      balance: balance
    });
  } catch (error: any) {
    if (error.message === 'Service not configured') {
      return res.status(409).json({ error: error.message, isConfigured: false });
    }
    res.status(500).json({ error: error.message });
  }
}));

app.post('/api/contract/approve', withBlockchainService(async (req, res, service) => {
    const { contractAddress, spender, amount } = req.body;
    if (!contractAddress || !spender || !amount) {
        return res.status(400).json({ error: 'contractAddress, spender, and amount are required' });
    }
    try {
        const txHash = await service.approve(contractAddress, spender, amount);
        res.json({ message: 'Approval successful', txHash });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}));

app.post('/api/contract/transfer', withBlockchainService(async (req, res, service) => {
    const { contractAddress, to, amount } = req.body;
    if (!contractAddress || !to || !amount) {
        return res.status(400).json({ error: 'contractAddress, to, and amount are required' });
    }
    try {
        const txHash = await service.transfer(contractAddress, to, amount);
        res.json({ message: 'Transfer successful', txHash });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}));

// --- Auction Endpoints ---

app.get('/api/auctions', withAuctionService(async (req, res, service) => {
    try {
        const auctions = await service.getAllAuctions();
        res.json(auctions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}));

app.get('/api/auctions/:auctionId', withAuctionService(async (req, res, service) => {
    try {
        const { auctionId } = req.params;
        const auction = await service.getAuction(auctionId);
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }
        res.json(auction);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}));

app.post('/api/auctions', withAuctionService(async (req, res, service) => {
  try {
    const auction = await service.createAuction(req.body);
    res.status(201).json(auction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}));

app.post('/api/auctions/:auctionId/bids', withAuctionService(async (req, res, service) => {
  try {
    const { auctionId } = req.params;
    const bid = await service.placeBid(auctionId, req.body);
    res.status(201).json(bid);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}));

// --- Portfolio Endpoints ---
app.use('/api/portfolio', portfolioRoutes);

// --- AI Endpoints ---

app.post('/api/ai/trade-suggestions', async (req, res) => {
  try {
    const suggestions = await aiService.getTradeSuggestions(req.body);
    res.json(suggestions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/daily-brief', async (req, res) => {
  try {
    const brief = await aiCoreService.getPersonalizedBrief(req.body);
    res.json(brief);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
