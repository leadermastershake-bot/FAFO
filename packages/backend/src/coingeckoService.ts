import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function getMarketChart(coinId: string, days: number = 1) {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error);
    throw new Error('Failed to fetch market data from CoinGecko');
  }
}
