require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const ethersService = require('./ethersService');

app.get('/', (req, res) => {
  res.send('METABOTPRIME Backend is running!');
});

// New status endpoint
app.get('/api/status', (req, res) => {
  res.json(ethersService.getStatus());
});

// Updated balance endpoint
app.get('/api/wallet/balance', async (req, res) => {
  try {
    const balance = await ethersService.getBalance();
    res.json({
      address: ethersService.wallet.address,
      balance: balance
    });
  } catch (error) {
    // If the service is not configured, we send a specific status code
    if (error.message === 'Service not configured') {
      return res.status(409).json({ error: error.message, isConfigured: false }); // 409 Conflict
    }
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
