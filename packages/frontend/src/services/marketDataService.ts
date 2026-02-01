export interface MarketData {
  price: number;
  timestamp: number;
}

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const TARGET_CURRENCY = 'usd';
const TARGET_ID = 'bitcoin';

class MarketDataService {
  private data: MarketData | null = null;
  private subscribers: ((data: MarketData) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.fetchPrice = this.fetchPrice.bind(this);
  }

  async fetchPrice(): Promise<void> {
    try {
      const response = await fetch(`${COINGECKO_API_URL}?ids=${TARGET_ID}&vs_currencies=${TARGET_CURRENCY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from CoinGecko');
      }
      const jsonData = await response.json();
      const price = jsonData[TARGET_ID][TARGET_CURRENCY];

      this.data = {
        price,
        timestamp: Date.now(),
      };

      if (this.data) {
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }

  subscribe(callback: (data: MarketData) => void): void {
    this.subscribers.push(callback);
    if (this.data) {
      callback(this.data);
    }
  }

  unsubscribe(callback: (data: MarketData) => void): void {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  private notifySubscribers(): void {
    if (this.data) {
      this.subscribers.forEach(sub => sub(this.data as MarketData));
    }
  }

  start(): void {
    this.fetchPrice();
    if (this.intervalId) {
        clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(this.fetchPrice, 15000); // Fetch every 15 seconds
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const marketDataService = new MarketDataService();
