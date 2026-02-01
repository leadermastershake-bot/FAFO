import axios from 'axios';

let cachedData: any = null;
let lastFetch = 0;

export async function getMarketData() {
  const now = Date.now();
  if (cachedData && now - lastFetch < 60000) {
    return cachedData;
  }

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
    cachedData = response.data;
    lastFetch = now;
    return cachedData;
  } catch (error) {
    console.error('Error fetching market data from CoinGecko:', error);
    return cachedData || {}; // Return old data if fetch fails
  }
}
