// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001; // Using a different port to avoid potential conflicts

// Middleware to parse JSON bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.send('METABOTPRIME Backend is running!');
});

// Import the ethers service
const { getBalance } = require('./ethersService');

// API route to get wallet balance
app.get('/api/wallet/balance', async (req, res) => {
  try {
    const balance = await getBalance();
    res.json({
      address: require('./ethersService').wallet.address,
      balance: balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
