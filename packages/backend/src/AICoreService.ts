import axios from 'axios';

const MODEL_SERVICE_BASE_URL = process.env.MODEL_SERVICE_BASE_URL || 'http://localhost:5000';

interface AnalysisParams {
  coin_id: string;
  vs_currency: string;
  days: number;
  indicators: string[];
}

export const getTradingSignal = async (params: AnalysisParams): Promise<string> => {
  try {
    const response = await axios.post(`${MODEL_SERVICE_BASE_URL}/analyze`, params);
    return response.data.signal;
  } catch (error) {
    console.error('Error fetching trading signal:', error);
    throw new Error('Could not fetch trading signal from model service');
  }
};

interface MarketDataParams {
    coin_id: string;
    vs_currency: string;
    days: number;
}

export const getMarketData = async (params: MarketDataParams): Promise<any> => {
    try {
        const response = await axios.post(`${MODEL_SERVICE_BASE_URL}/market_data`, params);
        return response.data;
    } catch (error) {
        console.error('Error fetching market data:', error);
        throw new Error('Could not fetch market data from model service');
    }
};

interface VolatilityParams {
    coin_id: string;
    vs_currency: string;
}

export const getVolatility = async (params: VolatilityParams): Promise<any> => {
    try {
        const response = await axios.post(`${MODEL_SERVICE_BASE_URL}/volatility`, params);
        return response.data;
    } catch (error) {
        console.error('Error fetching volatility data:', error);
        throw new Error('Could not fetch volatility data from model service');
    }
};
