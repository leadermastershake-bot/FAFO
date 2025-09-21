const { ethers } = require('ethers');
require('dotenv').config();

let provider;
let wallet;
let isConfigured = false;

function initializeService() {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (rpcUrl && privateKey && !rpcUrl.includes("YOUR_INFURA_PROJECT_ID") && !privateKey.includes("YOUR_PRIVATE_KEY")) {
    try {
      provider = new ethers.JsonRpcProvider(rpcUrl);
      wallet = new ethers.Wallet(privateKey, provider);
      isConfigured = true;
      console.log("Ethers service configured successfully.");
    } catch (error) {
      console.error("Failed to configure Ethers service:", error.message);
      isConfigured = false;
    }
  } else {
    console.warn("Ethers service is not configured. Please provide RPC_URL and PRIVATE_KEY in .env file or use the configuration API.");
    isConfigured = false;
  }
}

// Initial setup
initializeService();

const getStatus = () => {
  return {
    isConfigured: isConfigured,
    address: isConfigured ? wallet.address : null
  };
};

const getBalance = async () => {
  if (!isConfigured) {
    throw new Error('Service not configured');
  }
  try {
    const balanceWei = await provider.getBalance(wallet.address);
    return ethers.formatEther(balanceWei);
  } catch (error) {
    console.error('Error getting balance:', error.message);
    throw new Error('Could not get wallet balance.');
  }
};

// Function to update the configuration
const configure = (newRpcUrl, newPrivateKey) => {
    // This is a simplified version for now. We will later write to the .env file.
    process.env.RPC_URL = newRpcUrl;
    process.env.PRIVATE_KEY = newPrivateKey;
    initializeService();
    return getStatus();
};

module.exports = {
  getStatus,
  getBalance,
  configure,
  // We conditionally export wallet and provider so they are not used when unconfigured
  get wallet() {
    if (!isConfigured) throw new Error('Service not configured');
    return wallet;
  },
  get provider() {
    if (!isConfigured) throw new Error('Service not configured');
    return provider;
  }
};
