const { ethers } = require('ethers');
require('dotenv').config();

// Get the environment variables
const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;

// Check if the required environment variables are set
if (!rpcUrl || !privateKey || rpcUrl === "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID" || privateKey === "YOUR_PRIVATE_KEY") {
  console.warn("WARNING: RPC_URL or PRIVATE_KEY are not set in the .env file, or are using placeholder values. The application might not work as expected.");
}

// Create a provider
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Create a wallet instance
const wallet = new ethers.Wallet(privateKey, provider);

/**
 * Gets the balance of the server's wallet.
 * @returns {Promise<string>} The balance in Ether.
 */
const getBalance = async () => {
  try {
    const balanceWei = await provider.getBalance(wallet.address);
    // Format the balance to a more readable format (Ether)
    return ethers.formatEther(balanceWei);
  } catch (error) {
    console.error('Error getting balance:', error.message);
    // Check for common issues
    if (error.code === 'INVALID_ARGUMENT') {
        throw new Error('Could not get wallet balance. The private key in the .env file might be invalid.');
    }
    if (error.code === 'NETWORK_ERROR') {
        throw new Error('Could not get wallet balance. There might be an issue with the RPC_URL or your network connection.');
    }
    throw new Error('Could not get wallet balance.');
  }
};

module.exports = {
  wallet,
  getBalance,
  provider,
};
